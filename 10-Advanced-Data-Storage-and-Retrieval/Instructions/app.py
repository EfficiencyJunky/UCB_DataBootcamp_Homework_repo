import numpy as np
import pandas as pd
import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"
        f"/api/v1.0/<start><br/>"
        f"/api/v1.0/<start>/<end>"
    )


@app.route("/api/v1.0/precipitation")
def precipitation():
    """Return a list of precipitation data"""
    # Query all measurements
    results = session.query(Measurement).all()

    # Create a dictionary from the row data and append to a list of all_precipitation
    all_precipitation = []

    for row in results:
        precipitation_dict = { row.date : row.prcp}
        all_precipitation.append(precipitation_dict)
    print(all_precipitation)
    return jsonify(all_precipitation)


@app.route("/api/v1.0/stations")
def stations():
    """Return a list of all passenger names"""
    # Query all passengers
    results = session.query(Station.station, 
                            Station.name, 
                            Station.latitude,
                            Station.longitude,
                            Station.elevation).all()

    return jsonify(results)




@app.route("/api/v1.0/tobs")
def tobs():
    # Calculate the date 1 year ago from the last data point in the database
    last_date_in_measurement_table = session.query(Measurement).order_by(Measurement.date.desc()).first()
    one_year_ago = dt.date.fromisoformat(last_date_in_measurement_table.date) - dt.timedelta(days=365)
    print("one year ago: ", one_year_ago)

    # Perform a query to retrieve the data and precipitation scores
    results = session.query(Measurement.date, Measurement.prcp).filter(Measurement.date > one_year_ago).all()

    return jsonify(results)




@app.route("/api/v1.0/<start_date>/<end_date>")
def calc_temp_stats(start_date, end_date):
    print(start_date, end_date)
    """Fetch the information from start_date/end_date or a 404 if date range is not valid."""

    all_dates = session.query(Measurement.date).all()
    startdate_in_dates = False
    enddate_in_dates = False

    for date in all_dates:
        # print(date[0])
        if date[0] == start_date:
            startdate_in_dates = True
        if date[0] == end_date:
            enddate_in_dates = True            

    if end_date <= start_date:
        return jsonify({"error": f"{start_date} is after {end_date}."}), 404
    
    if (startdate_in_dates and enddate_in_dates) != True:
        return jsonify({"error": f"{start_date} or {end_date} are out of range."}), 404

    tmin, avg_temp, tmax = calc_temps(start_date, end_date)[0]

    # return jsonify({"result": f"tmin: {tmin}, avg: {avg_temp}, tmax: {tmax}."})
    return jsonify({
                        "tmin": tmin,
                        "avg" : avg_temp, 
                        "tmax" : tmax
                    })





@app.route("/api/v1.0/<start_date>")
def calc_temp_stats_single_date(start_date):
    print(start_date)
    """Fetch the information from start_date/end_date or a 404 if date range is not valid."""

    all_dates = session.query(Measurement.date).all()
    startdate_in_dates = False

    for date in all_dates:
        # print(date[0])
        if date[0] == start_date:
            startdate_in_dates = True         
    
    if startdate_in_dates != True:
        return jsonify({"error": f"{start_date} is out of range."}), 404

    tmin, avg_temp, tmax = calc_temps_2(start_date)[0]

    # return jsonify({"result": f"tmin: {tmin}, avg: {avg_temp}, tmax: {tmax}."})
    return jsonify({
                        "tmin": tmin,
                        "avg" : avg_temp, 
                        "tmax" : tmax
                    })





def calc_temps(start_date, end_date):
    """TMIN, TAVG, and TMAX for a list of dates.
    
    Args:
        start_date (string): A date string in the format %Y-%m-%d
        end_date (string): A date string in the format %Y-%m-%d
        
    Returns:
        TMIN, TAVE, and TMAX
    """

    print("two dates\n")
    return session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
        filter(Measurement.date >= start_date).filter(Measurement.date <= end_date).all()
    




def calc_temps_2(start_date):
    """TMIN, TAVG, and TMAX for a list of dates.
    
    Args:
        start_date (string): A date string in the format %Y-%m-%d
        end_date (string): A date string in the format %Y-%m-%d
        
    Returns:
        TMIN, TAVE, and TMAX
    """
    print("one date\n")
    return session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
        filter(Measurement.date >= start_date).all()





if __name__ == '__main__':
    app.run(debug=True)
