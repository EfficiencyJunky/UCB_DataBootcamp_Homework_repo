import os

import pandas as pd
import numpy as np
from datetime import datetime

import json

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy

from config import sql_root_password


#################################################
# Global Variables
#################################################

# device_type = ["IOS", "ANDROID"]
# advertiser = ["Facebook Ads", "pinterest_int", "snapchat_int", "googleadwords_int", "Apple Search Ads", "Organic"]

device_type = ["IOS"]
advertiser = ["Facebook Ads"]

start_date = "2019-04-01"
end_date = "2019-04-01"

Data = {'Product': ['Desktop Computer','Tablet','iPhone','Laptop'],
        'Price': [700,250,800,1200]
        }

aggregate_data_df = pd.DataFrame(Data, columns= ['Product', 'Price'])

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

# Make sure to put your own SQL root password here
mysql_root_password = sql_root_password
rds_connection_string = "root:" + mysql_root_password + "@127.0.0.1/acquisition_bi_db_2"


#################################################
# Database Setup Style #1
#################################################

# app.config["SQLALCHEMY_DATABASE_URI"] = f'mysql://{rds_connection_string}'
# db = SQLAlchemy(app)

# # reflect an existing database into a new model
# Base = automap_base()
# # reflect the tables
# Base.prepare(db.engine, reflect=True)


#################################################
# Database Setup Style #2
#################################################

engine = create_engine(f'mysql://{rds_connection_string}')

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)


#################################################
# Verify database setup
# save reference to table(s) we care about
# create session link so we can query the database
#################################################
# inspector = inspect(engine)
# inspector.get_table_names()

# print out Table Names
print("Database Table Names")
print(engine.table_names())

# make sure our table has a primary key otherwise it won't work with SQLAlchemy
print("Database Tables that have Keys")
print(Base.classes.keys())

# Save reference to the "acquisition_bi" table
bi = Base.classes.acquisition_bi

# Create our session (link) from Python to the DB
session = Session(engine)


#################################################
# Flask Routes
#################################################


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/compare")
def index_vs():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/routes")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/test<br/>"
        f"/api/v1.0/test2<br/>"
        f"/api/v1.0/daterange/start_date/end_date"
        f"/api/v1.0/daterange_pandas/tabledata/"
        f"/api/v1.0/os_type?args"
        f"/api/v1.0/advertiser_type?args"
    )


#################################################################################
# SQL VERSION
# SQL VERSION
#  --- ROUTE TO GET THE DATA IN THE FORMAT WE WANT FROM DATE RANGE 
#################################################################################
# @app.route("/api/v1.0/daterange_sql/<new_start_date>/<new_end_date>")
# def daterange(new_start_date, new_end_date):
    
#     global start_date
#     global end_date

#     start_date = new_start_date
#     end_date = new_end_date

#     device_type_sql = "IOS"
#     advertiser_sql = "Facebook Ads"

#     results = session.query(bi.date, bi.installs).\
#                     filter(bi.date >= start_date).\
#                     filter(bi.date <= end_date).\
#                     filter(bi.device_type == device_type_sql).\
#                     filter(bi.advertiser == advertiser_sql).all()
    
#     data = []
    
#     for row in results:
#         row_dict = {}
#         row_dict["date"] = row.date
#         row_dict["installs"] = row.installs
#         data.append(row_dict)

#     return jsonify(results)




#################################################################################
# PANDAS VERSION 
# PANDAS VERSION 
#  --- ROUTE TO GET THE DATA IN THE FORMAT WE WANT FROM DATE RANGE 
#################################################################################
@app.route("/api/v1.0/daterange_pandas/<new_start_date>/<new_end_date>")
def daterange_pandas(new_start_date, new_end_date):
    
    # print("in the datarange_pandas api_call")

    global start_date
    global end_date
    global aggregate_data_df

    start_date = new_start_date
    end_date = new_end_date

    stmt = session.query(bi).statement
    df = pd.read_sql_query(stmt, session.bind)

    # filter the data between the given dates, device_type, and advertiser. group by date and advertiser
    df_filtered = df.loc[(df["date"] >= toDate(start_date)) 
                        & 
                        (df["date"] <= toDate(end_date)) 
                        &
                        (df['device_type'].isin(device_type))
                        &
                        (df['advertiser'].isin(advertiser))]\
                        .groupby( ["date", "advertiser"], as_index=False).sum()

    # Convert the dates to string before converting them to a list
    df_filtered["date"] = df_filtered["date"].apply(str)

    aggregate_data_df = df_filtered.copy()

####### BE CAREFUL WHEN DOING THESE CONVERSIONS. ANY "NAN" VALUES WILL MESS EVERYTHING UP IN JAVASCRIPT
    df_filtered["cpi"] = df_filtered["spend"] / df_filtered["installs"] 
    df_filtered["arpu"] = df_filtered["ltv_subs_revenue"] / df_filtered["installs"] 
    df_filtered["cpt"] = df_filtered["trial_starts_all"] / df_filtered["installs"] 
    df_filtered["arp_trial"] = df_filtered["ltv_subs_revenue"] / df_filtered["trial_starts_all"] 

    # df_filtered_tabledata = df.loc[(df["date"] >= toDate(start_date)) 
    #                     & 
    #                     (df["date"] <= toDate(end_date)) 
    #                     &
    #                     (df['device_type'].isin(device_type))
    #                     &
    #                     (df['advertiser'].isin(advertiser))]\
    #                     .groupby( ["date", "device_type", "advertiser"], as_index=False).sum()

    # df_filtered_tabledata["date"] = df_filtered_tabledata["date"].apply(str)

    # df_filtered = df.loc[(df['device_type'].isin(device_type))
    #                     &
    #                     (df['advertiser'].isin(advertiser))]

    

####### BE CAREFUL WHEN DOING THESE CONVERSIONS. ANY "NAN" VALUES WILL MESS EVERYTHING UP IN JAVASCRIPT
    # Format the data to send as json
    chart_formated_data = {
        "date": df_filtered["date"].values.tolist(),
        "advertiser": df_filtered["advertiser"].values.tolist(),
        "spend": df_filtered["spend"].values.tolist(),
        "installs": df_filtered["installs"].values.tolist(),
        # "cpi": df_filtered["cpi"].values.tolist(),
        # "arpu": df_filtered["arpu"].values.tolist(),
        "trial_starts_all": df_filtered["trial_starts_all"].values.tolist(),
        # "cpt": df_filtered["cpt"].values.tolist(),
        # "arp_trial": df_filtered["arp_trial"].values.tolist(),
        "ltv_subs_all": df_filtered["ltv_subs_all"].values.tolist(),
        "ltv_subs_revenue": df_filtered["ltv_subs_revenue"].values.tolist()
    }


    # print(df_filtered["arp_trial"].values.tolist())
    return jsonify(chart_formated_data, daterange_pandas_tabledata(), daterange_pandas_comparison_chart())


    # data = {
    #     # Convert the dates to string before converting them to a list
    #     "date": df_filtered["date"].values.tolist(),
    #     "advertiser": df_filtered["advertiser"].values.tolist(),
    #     "installs": df_filtered["installs"].values.tolist()
    # }

    # print(type(data["date"][0]))
    # print(data["date"][0])    

    # return jsonify(data, daterange_pandas_tabledata())


#################################################################################
# PANDAS VERSION 
# PANDAS VERSION 
#  --- ROUTE TO GET THE DATA IN THE TABLE DATA FORMAT WE WANT FROM DATE RANGE 
#################################################################################
@app.route("/api/v1.0/daterange_pandas/tabledata/")
def daterange_pandas_tabledata():
    
    # print("in the tabledata api_call")

    # WAY to convert to JSON #1 -- Doesn't work because it converts each row to a string and then loads that into a json
    # json_series = aggregate_data_df[["date", "advertiser", "installs"]].apply(lambda x: x.to_json(), axis=1)
    # json_object = json_series.to_json(orient='records')

    aggregate_data_df_grouped = aggregate_data_df.groupby( ["advertiser"], as_index=False).sum().sort_values(by="spend", ascending=False)

    ####### BE CAREFUL WHEN DOING THESE CONVERSIONS. ANY "NAN" VALUES WILL MESS EVERYTHING UP IN JAVASCRIPT
    # aggregate_data_df_grouped["cpi"] = aggregate_data_df_grouped["spend"] / aggregate_data_df_grouped["installs"] 
    # aggregate_data_df_grouped["arpu"] = aggregate_data_df_grouped["ltv_subs_revenue"] / aggregate_data_df_grouped["installs"] 
    # aggregate_data_df_grouped["cpt"] = aggregate_data_df_grouped["trial_starts_all"] / aggregate_data_df_grouped["installs"] 
    # aggregate_data_df_grouped["arp_trial"] = aggregate_data_df_grouped["ltv_subs_revenue"] / aggregate_data_df_grouped["trial_starts_all"] 

    # WAY #2
    # json_object = aggregate_data_df[["date", "advertiser", "installs"]].to_json(orient='records')
    json_object = aggregate_data_df_grouped[["advertiser",
                                             "spend", 
                                             "impressions", 
                                             "clicks", 
                                             "views", 
                                             "installs",
                                            #  "cpi",
                                            #  "arpu",
                                             "sessions", 
                                             "new_workout_saved_unique", 
                                             "trial_starts_all",
                                            #  "cpt",
                                            #  "arp_trial",
                                             "ltv_subs_all", 
                                             "ltv_subs_revenue"]].to_json(orient='records')
    
    # print(json_object)

    # FINAL JSON LOADING
    returnobject = json.loads(json_object)

    # print(returnobject)
    # print(type(returnobject))

    # print(jsonobject)

    return returnobject


###############################################################################################
# 
# 
#  --- ROUTE TO GET THE DATA IN THE FORMAT FOR THE COMPARISON CHART NOT INCLUDING ORGANIC
###############################################################################################
@app.route("/api/v1.0/daterange_pandas/comparison_chart/")
def daterange_pandas_comparison_chart():
    
    comparison_data_df_grouped = aggregate_data_df.loc[aggregate_data_df['advertiser'] != "Organic"]\
                                                        .groupby( ["date"], as_index=False).sum()#.sort_values(by="spend", ascending=False)
    
    # json_series = aggregate_data_df[["date", "advertiser", "installs"]].apply(lambda x: x.to_json(), axis=1)

    # json_object = comparison_data_df_grouped[["date",
    #                                          "spend", 
    #                                          "impressions", 
    #                                          "clicks", 
    #                                          "views", 
    #                                          "installs",
    #                                         #  "cpi",
    #                                         #  "arpu",
    #                                          "sessions", 
    #                                          "new_workout_saved_unique", 
    #                                          "trial_starts_all",
    #                                         #  "cpt",
    #                                         #  "arp_trial",
    #                                          "ltv_subs_all", 
    #                                          "ltv_subs_revenue"]].apply(lambda x: x.to_json(), axis=1)
    
    # Format the data to send as json
    comparison_formated_data = {
        "date": comparison_data_df_grouped["date"].values.tolist(),
        # "advertiser": comparison_data_df_grouped["advertiser"].values.tolist(),
        "spend": comparison_data_df_grouped["spend"].values.tolist(),
        "installs": comparison_data_df_grouped["installs"].values.tolist(),
        # "cpi": comparison_data_df_grouped["cpi"].values.tolist(),
        # "arpu": comparison_data_df_grouped["arpu"].values.tolist(),
        "trial_starts_all": comparison_data_df_grouped["trial_starts_all"].values.tolist(),
        # "cpt": comparison_data_df_grouped["cpt"].values.tolist(),
        # "arp_trial": comparison_data_df_grouped["arp_trial"].values.tolist(),
        "ltv_subs_all": comparison_data_df_grouped["ltv_subs_all"].values.tolist(),
        "ltv_subs_revenue": comparison_data_df_grouped["ltv_subs_revenue"].values.tolist()
    }

    # print(comparison_formated_data)

    # FINAL JSON LOADING
    # returnobject = json.loads(str(json_object))
    # returnobject = str(json_object)
    # returnobject = json.dumps(json_object)
    

    return comparison_formated_data



###############################################
# RESPOND TO OS CHECK BOXES BEING CHECKED
###############################################
@app.route("/api/v1.0/os_type", methods=['GET'])
def osSelection():
    global device_type
    device_type = []

    device_type.append( request.args.get('os1', None) )
    device_type.append( request.args.get('os2', None) )

    device_type[:] = [x for x in device_type if type(x) != type(None)]

    if device_type == []:
        print("list is empty, default to ALL DEVICE_TYPES")
        device_type = ["IOS", "ANDROID"]

    # for d in device_type:
    #     print("Device: ")
    #     print(d)
        # print("Type: ")
        # print(type(d))

    # device_type = new_device_type

    return daterange_pandas(start_date, end_date)

    # return jsonify({"response": "none"})

# OLD WAY OF DOING WHAT WE ARE DOING ABOVE
# @app.route("/api/v1.0/os_type/<os1>/<os2>")
# def osSelection2(os1=None, os2=None):

#     print("first os: ")
#     print(os1)

#     print("second os: ")
#     print(os2)

#     return jsonify({"response": "none"})
    



###################################################
# RESPOND TO ADVERTISER CHECK BOXES BEING CHECKED
###################################################
@app.route("/api/v1.0/advertiser_type", methods=['GET'])
def advertiserSelection():
    global advertiser

    advertiser = []

    advertiser.append( request.args.get('advertiser1', None) )
    advertiser.append( request.args.get('advertiser2', None) )
    advertiser.append( request.args.get('advertiser3', None) )
    advertiser.append( request.args.get('advertiser4', None) )
    advertiser.append( request.args.get('advertiser5', None) )
    advertiser.append( request.args.get('advertiser6', None) )

    advertiser[:] = [x for x in advertiser if type(x) != type(None)]

    if advertiser == []:
        print("list is empty, default to ALL ADVERTISERS")
        advertiser = ["Facebook Ads", "pinterest_int", "snapchat_int", "googleadwords_int", "Apple Search Ads", "Organic"]

    # for d in advertiser:
    #     print("Advertiser: ")
    #     print(d)
        # print("Type: ")
        # print(type(d))

    return daterange_pandas(start_date, end_date)



###################################################
# RESPOND TO FRONTEND INIT REQUEST
###################################################
@app.route("/api/v1.0/frontend_init")
def frontendInit():
    
    return jsonify(device_type, advertiser)






#################################################
# TEST ROUTES
#################################################

@app.route("/api/v1.0/test")
def test():
    """testing testing 123"""
    # Query all passengers
    # results = session.query(Passenger.name).all()

    results = session.query(bi.date, bi.installs).all()

    # Convert list of tuples into normal list
    # all_installs = results[0]
    # print(len(all_installs))
    # all_names_list = [result[0] for result in results]

    return jsonify(results)
    # return "this is a test"


@app.route("/api/v1.0/test2")
def test2():
    """testing testing 123"""
    # Query all passengers
    # results = session.query(Passenger).all()

    # Query all columns of the AppsflyerIOS table
    results = session.query(bi).all()
    # Create a dictionary from the row data and append to a list of all_passengers
    
    all_rows = []
    for row in results:
        row_dict = {}
        row_dict["date"] = row.date
        row_dict["installs"] = row.installs
        row_dict["trial_starts"] = row.trial_starts_all
        all_rows.append(row_dict)

    # print(all_rows)
    return jsonify(all_rows)



#################################################
# Helper Functions
#################################################
def toDate(input_date):
    return datetime.strptime(input_date, '%Y-%m-%d').date()



#################################################
# Main function to run app
#################################################
if __name__ == '__main__':
    app.run(debug=True)
    # app.run()
    