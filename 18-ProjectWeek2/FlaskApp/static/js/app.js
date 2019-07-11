/* ################################
  ****  GLOBAL VARIABLES
################################### */
// let start_date = "2019-05-20";
// let end_date = "2019-05-23";

// console.log("this is the start: " + start_date);
// console.log("this is the end: " + end_date);

// console.log("this is the beginning " );
let advertiser_info = {
  "Facebook Ads":       {"name": "FB",      "color": "blue"},
  "pinterest_int":      {"name": "PINT",    "color": "red"},
  "snapchat_int":       {"name": "SNAP",    "color": "orange"},
  "googleadwords_int":  {"name": "GOOG",    "color": "brown"},
  "Apple Search Ads":   {"name": "ASA",     "color": "grey"},
  "Organic":            {"name": "Organic", "color": "green"}
};


// "dash" -- 
//      Sets the dash style of lines. Set to a dash 
//      type string ("solid", "dot", "dash", "longdash", "dashdot", or "longdashdot") 
//      or a dash length list in px (eg "5px,10px,2px,2px").
let metrics_info = {
  "spend":             {"name":"Spend",       "symbol": "$",   "stackable": true,     "is_subs_metric": false,     "yaxis": "y1", "dash": "solid",       "numerator": "none",              "divisor": "none"},
  "installs":          {"name":"Installs",    "symbol": "",    "stackable": true,     "is_subs_metric": false,     "yaxis": "y1", "dash": "longdash",    "numerator": "none",              "divisor": "none"},
  "cpi":               {"name":"CPI",         "symbol": "$",   "stackable": false,    "is_subs_metric": false,     "yaxis": "y2", "dash": "dashdot",     "numerator": "spend",             "divisor": "installs"},
  "arpu":              {"name":"ARPU",        "symbol": "$",   "stackable": false,    "is_subs_metric": true,      "yaxis": "y2", "dash": "dot",         "numerator": "ltv_subs_revenue",  "divisor": "installs"},
  "trial_starts_all":  {"name":"Trial Starts","symbol": "",    "stackable": true,     "is_subs_metric": false,     "yaxis": "y1", "dash": "longdash",    "numerator": "none",              "divisor": "none"},
  "cpt":               {"name":"CPT",         "symbol": "$",   "stackable": false,    "is_subs_metric": false,     "yaxis": "y2", "dash": "dashdot",     "numerator": "spend",             "divisor": "trial_starts_all"},
  "arp_trial":         {"name":"ARP Trial",   "symbol": "$",   "stackable": false,    "is_subs_metric": true,      "yaxis": "y2", "dash": "dot",         "numerator": "ltv_subs_revenue",  "divisor": "trial_starts_all"},
  "trials_per_user":   {"name":"Trials/Inst", "symbol": "%",   "stackable": false,    "is_subs_metric": false,     "yaxis": "y2", "dash": "dot",         "numerator": "trial_starts_all",  "divisor": "installs"},
  "ltv_subs_all":      {"name":"Subscribers", "symbol": "",    "stackable": true,     "is_subs_metric": true,      "yaxis": "y1", "dash": "longdash",    "numerator": "none",              "divisor": "none"},
  "subs_per_trial":    {"name":"Subs/Trial",  "symbol": "%",   "stackable": false,    "is_subs_metric": true,      "yaxis": "y2", "dash": "dash",        "numerator": "ltv_subs_all",      "divisor": "trial_starts_all"},
  "ltv_subs_revenue":  {"name":"Revenue",     "symbol": "$",   "stackable": true,     "is_subs_metric": true,      "yaxis": "y1", "dash": "longdash",    "numerator": "none",              "divisor": "none"},
  "roas":              {"name":"ROAS",        "symbol": "%",   "stackable": false,    "is_subs_metric": true,      "yaxis": "y4", "dash": "dash",        "numerator": "ltv_subs_revenue",  "divisor": "spend"},
  "yaxis_placeholder": {"name":"y1",          "symbol": "",    "stackable": false,    "is_subs_metric": false,     "yaxis": "y1", "dash": "longdash",    "numerator": "none",              "divisor": "none"}
};


let comp_chart_info = {
  "spend_vs_revenue":   {"name": "Spend Vs. Revenue",         "xaxis_title": "Spend",           "yaxis_title": "Revenue"},
  "spend_vs_gm":        {"name": "Spend Vs. Gross Margin",    "xaxis_title": "Spend",           "yaxis_title": "Gross Margin"},
  "spend_vs_roi":       {"name": "Spend Vs. ROI",             "xaxis_title": "Spend",           "yaxis_title": "ROI"},
  "gm_vs_roi":          {"name": "Gross Margin Vs. ROI",      "xaxis_title": "Gross Margin",    "yaxis_title": "ROI"}
};


let blank_row_data2 = [{
  "advertiser": "",
  "clicks": "",
  "impressions": "",
  "installs": "",
  "ltv_subs_all": "",
  "ltv_subs_revenue": "",
  "new_workout_saved_unique": "",
  "sessions": "",
  "spend": "",
  "trial_starts_all": "",
  "views": ""
}];

let blank_row_data = [{
  "advertiser": 0,
  "clicks": 0,
  "impressions": 0,
  "installs": 0,
  "ltv_subs_all": 0,
  "ltv_subs_revenue": 0,
  "new_workout_saved_unique": 0,
  "sessions": 0,
  "spend": 0,
  "trial_starts_all": 0,
  "views": 0
}];

let metrics_chosen = [];

let os_chosen = [];

let chartdata = [];
let comparison_data = [];

let displayStackedGraph = false;
let displayComparisonChart = false;

let comparisonChartType = "spend_vs_revenue";

let y1AxisMaxValue = 0;
let y2AxisMaxValue = 0;

let showLTVPerTrial = false;
let customLTV = 19;

// this will be initialized in the "init()" function below
let revenueCutoffDate = moment().subtract(8, 'days').format('YYYY-MM-DD');
let showRevenueCutoffDate = false;

console.log("revenue day:", revenueCutoffDate);
console.log("revenue day type:", typeof(revenueCutoffDate));

// let firstcall = true;
let myPlotDiv = document.getElementById('linegraph');

// need to replace all instances of
// advertiser_colors
// advertiser_shortname_lookup
// metrics_axis_lookup[metric]
// metrics_info[metric].dash
// metrics_linetype_lookup
// metric_divisor_lookup

/* #########################################
  ****  CHART GENERATORS AND DATA DISPLAYER
############################################ */
// function buildCharts(data1, data2) {
function buildCharts() {

  (displayComparisonChart === true) ? comparisonChart() : lineChartWithMetricsChoices();
  
}

function comparisonChart() {

  //let unique_advertisers = chartdata.advertiser.filter( onlyUnique );

  // console.log("length of advertiser array", unique_advertisers.length);
  // console.log("unique advertisers array", unique_advertisers);

  let traces = [];

  // sampleData.sample_values.max

  //for(i=0; i < unique_advertisers.length; i++ ){

    //let advertiser = unique_advertisers[i];

    //for(j=0; j < metrics_chosen.length; j++){

      //let metric = metrics_chosen[j];
      //abracadabra
      let trace = {
        x: getComparisonChartXValues("actual"),//getOvertimeGraphXValues(chartdata, "date", advertiser),
        y: getComparisonChartYValues("actual"), //comparison_data.ltv_subs_revenue,//getOvertimeGraphYValues(chartdata, metric, advertiser),
        name: "Actual Revenue",
        // name: advertiser_shortname_lookup[advertiser] + " " + metric,
        text: comparison_data.date,
        mode: 'markers',
        //stackgroup: setStackGroup(metric),
        // hovertext: setComparisonChartHoverText(),
        // hoverinfo: 'text+name', //will display the hovertext next to the name
        // hoverinfo: 'x+y+name',
        // size: comparison_data.spend.map( d => 100),
        // size: comparison_data.installs.map( (value) => {
        //   if(value < 10){
        //     return 10; 
        //   }
        //   return value/20;
        // }),
        //visible: setTraceVisibility(metric),
        //yaxis: metrics_info[metric].yaxis,
        // yaxis: metrics_axis_lookup[metric],
        marker: {
          color: 'rgba(0, 0, 255, 0.6)',
          // color: "blue",
          size: 10//comparison_data.spend.map( d => 100),
          // color: advertiser_info[advertiser].color
        }
      };
      
    //}

  //}

  if(showLTVPerTrial){

    let trace_ltv = {
      x: getComparisonChartXValues("LTV"),
      y: getComparisonChartYValues("LTV"),
      name: "LTV $" + customLTV,
      text: comparison_data.date,
      mode: 'markers',
      marker: {
        color: 'rgba(255, 0, 0, 0.6)',
        // color: "red",
        size: 10
      }
    };

    traces.push(trace_ltv);
  }

  traces.push(trace);

  if(comparisonChartType == "spend_vs_revenue"){
    // console.log("trace 1 x vals", trace.x);
    let max_x_val = Math.max(...trace.x);
    // console.log("trace 1 max xval", maxVal);

    let trace2 = {
      x: [0, max_x_val],
      y: [0, max_x_val],
      name: "Break Even",
      mode: 'lines',
      // fill: 'tozeroy',
      // fillcolor: 'rgba(255, 165, 0, 0.3)',
      line: {
        color: "orange"
      }
    };

    let trace3 = {
      x: [0, max_x_val],
      y: [0, max_x_val * 1.12],
      name: "112% GM",
      mode: 'lines',
      fill: 'tonexty',
      fillcolor: 'rgba(255, 165, 0, 0.3)',
      line: {
        color: "green"
      }
    };    

    traces.push(trace2);
    traces.push(trace3);

  }



  // console.log("traces: ", traces);
  var comparisonLayout = {
    hovermode:'closest',
    title: comp_chart_info[comparisonChartType].name,
    // showlegend: false,
    xaxis: {
      title: comp_chart_info[comparisonChartType].xaxis_title, 
      //domain: [0.06, 0.94]},
      rangemode: "tozero"
    },
    yaxis: {
      title: comp_chart_info[comparisonChartType].yaxis_title,//nameYAxisTitle("y1"), //"yaxis1 title"
      // range: setAxisRangeWhenEmpty([0,1]), // if no metric is selected, the y axis range will default to whatever value you send into the function
      // range: setYAxisRange(metric), // Modify this so that when there's no visible trace, the range is 0 to something
      // autorange: true,
      // showticklabels: setShowTickLabels(), // true or false depending on if any metrics are chosen
      rangemode: "tozero"
    },
    // yaxis: {title: "yaxis1 title"},
    // yaxis2: {
    //   title: nameYAxisTitle("y2"), //'yaxis2 title'
    //   rangemode: "tozero",
    //   // titlefont: {color: 'rgb(148, 103, 189)'},
    //   // tickfont: {color: 'rgb(148, 103, 189)'},
    //   overlaying: 'y',
    //   // anchor: 'x',
    //   // autorange: true,
    //   side: 'right'
    // },
    // yaxis3: {
    //   title: nameYAxisTitle("y3"), //'yaxis2 title'
    //   rangemode: "tozero",
    //   titlefont: {color: 'rgb(148, 103, 189)'},
    //   tickfont: {color: 'rgb(148, 103, 189)'},
    //   gridcolor: 'rgb(148, 103, 189)',
    //   anchor: 'free',
    //   overlaying: 'y',
    //   // autorange: true,
    //   side: 'left',
    //   position: 0.0
    // },
    // yaxis4: {
    //   title: nameYAxisTitle("y4"), //'yaxis2 title'
    //   rangemode: "tozero",
    //   titlefont: {color: 'rgb(148, 103, 189)'},
    //   tickfont: {color: 'rgb(148, 103, 189)'},
    //   gridcolor: 'rgba(148, 103, 189, 0.3)',
    //   // linecolor: 'rgb(148, 103, 189)', // sets the color of the vertical y axis line next to the ticks
    //   zerolinecolor: 'rgba(148, 103, 189, 0.8)', // #969696
    //   zerolinewidth: 2,
    //   anchor: 'free',
    //   overlaying: 'y',
    //   // autorange: true,
    //   side: 'right',
    //   position: 1.0
    // },
    // legend: {orientation:"h"},
    //legend: {orientation:"h", x: "0.0", y: "1.2"},
    height: 600,
    width: 1200
  };  
  
  Plotly.react(myPlotDiv, traces, comparisonLayout);
  // Plotly.newPlot('linegraph', traces, comparisonLayout);

}

function lineChartWithMetricsChoices() {

  let unique_advertisers = chartdata.advertiser.filter( onlyUnique );

  // console.log("length of advertiser array", unique_advertisers.length);
  // console.log("unique advertisers array", unique_advertisers);

  let traces = [];

  // sampleData.sample_values.max

  for(i=0; i < unique_advertisers.length; i++ ){

    let advertiser = unique_advertisers[i];

    for(j=0; j < metrics_chosen.length; j++){

      let metric = metrics_chosen[j];
      
      let trace = {
        x: getOvertimeGraphXValues(chartdata, "date", advertiser),
        y: getOvertimeGraphYValues(chartdata, metric, advertiser),
        name: advertiser_info[advertiser].name + " " + metrics_info[metric].name,
        // name: advertiser_shortname_lookup[advertiser] + " " + metric,
        // text: "testing",
        mode: 'scatter',
        // mode: 'lines+markers',
        stackgroup: setStackGroup(metric),
        hovertext: setHoverText(chartdata, metric, advertiser),
        hoverinfo: 'text+name', //will display the hovertext next to the name
        // hoverinfo: 'x+y+name',
        // size: chartdata.installs.map( (value) => {
        //   if(value < 10){
        //     return 10; 
        //   }
        //   return value/20;
        // }),
        visible: setTraceVisibility(metric),
        yaxis: metrics_info[metric].yaxis,
        // yaxis: metrics_axis_lookup[metric],
        line: {
          dash: metrics_info[metric].dash,
          shape: "spline",
          smoothing: 0.6,
          // dash: metrics_linetype_lookup[metric],
          color: advertiser_info[advertiser].color
          // color: advertiser_colors[advertiser]
        }
      };
  
      traces.push(trace);

    }

  }

  // console.log("traces: ", traces);
  var lineLayout = {
    hovermode:'closest',
    // title: 'Bubble Chart Hover Text',
    // showlegend: false,
    xaxis: {title: "date", domain: [0.06, 0.94], showgrid: false},
    yaxis: {
      title: nameYAxisTitle("y1"), //"yaxis1 title"
      // range: setAxisRangeWhenEmpty([0,1]),
      range: (y1AxisMaxValue === 0) ? setAxisRangeWhenEmpty([0,1]) : [0, y1AxisMaxValue], 
      autorange: (y1AxisMaxValue === 0) ? true : false, // autorange will take precedence over the above
      showticklabels: setAxisLabelsAndGridVisibility(), // true or false depending on if any metrics are chosen
      showgrid: setAxisLabelsAndGridVisibility(),
      rangemode: "tozero"
    },
    // yaxis: {title: "yaxis1 title"},
    yaxis2: {
      title: nameYAxisTitle("y2"), //'yaxis2 title'
      // range: [0, 5],
      //if y2AxisMaxValue is 0, then return [] otherwise return [0, y2AxisMaxValue]
      range: (y2AxisMaxValue === 0) ? [] : [0, y2AxisMaxValue],
      rangemode: "tozero",
      // titlefont: {color: 'rgb(148, 103, 189)'},
      // tickfont: {color: 'rgb(148, 103, 189)'},
      overlaying: 'y',
      // anchor: 'x',
      // autorange: true,
      side: 'right'
    },
    yaxis3: {
      title: nameYAxisTitle("y3"), //'yaxis2 title'
      rangemode: "tozero",
      titlefont: {color: 'rgb(148, 103, 189)'},
      tickfont: {color: 'rgb(148, 103, 189)'},
      gridcolor: 'rgb(148, 103, 189)',
      anchor: 'free',
      overlaying: 'y',
      // autorange: true,
      side: 'left',
      position: 0.0
    },
    yaxis4: {
      title: nameYAxisTitle("y4"), //'yaxis2 title'
      rangemode: "tozero",
      titlefont: {color: 'rgb(148, 103, 189)'},
      tickfont: {color: 'rgb(148, 103, 189)'},
      gridcolor: 'rgba(148, 103, 189, 0.3)',
      // linecolor: 'rgb(148, 103, 189)', // sets the color of the vertical y axis line next to the ticks
      zerolinecolor: 'rgba(148, 103, 189, 0.8)', // #969696
      zerolinewidth: 2,
      anchor: 'free',
      overlaying: 'y',
      // autorange: true,
      side: 'right',
      position: 1.0
    },
    // legend: {orientation:"h"},
    legend: {orientation:"h", x: "0.0", y: "1.2"},
    height: 600,
    width: 1200
  };
  
  Plotly.react(myPlotDiv, traces, lineLayout);
  // Plotly.newPlot('linegraph', traces, lineLayout);

  // Because people usually only pay us if they have converted from trial to subscription
  // We shouldn't care about revenue or subs based metrics for days between today and 7 days ago
  // Due to this, we want to draw a vertical line on the graph to show where that cutoff is
  // But we only want to do it if a metric is on the graph that is based on Revenue or Subscribers
  // so first we filter out the metrics chosen to see if any of them are "subs_metrics"
  let subs_metrics_chosen = metrics_chosen.filter((metric) => {return metrics_info[metric].is_subs_metric });
  
  // if the data we are displaying contains teh date where we want to draw the vertical line
  // AND there is at least one "subs_metrics" that the user has chosen then draw that line!
  if( chartdata.date.includes(revenueCutoffDate) && (subs_metrics_chosen.length > 0) ){

    let yAxisMaxVal = lineLayout.yaxis.range[1];

    console.log("Adding revenue cutoff date trace");
    console.log('Y-axis range max val: ' + yAxisMaxVal);
    
    let trace = {
      x: [revenueCutoffDate, revenueCutoffDate],
      y: [0, yAxisMaxVal],
      name: "8 Days Ago",
      // name: advertiser_shortname_lookup[advertiser] + " " + metric,
      // text: "testing",
      mode: 'lines',
      hovertext: moment(revenueCutoffDate).format('ddd, MM/DD'),
      hoverinfo: 'text+name', //will display the hovertext next to the name
      // hoverinfo: 'x+y+name',
      // size: chartdata.installs.map( (value) => {
      //   if(value < 10){
      //     return 10; 
      //   }
      //   return value/20;
      // }),
      //visible: true,
      showlegend: false,
      yaxis: "y1",
      line: {
        dash: "dot",
        //shape: "spline",
        //smoothing: 0.6,
        // dash: metrics_linetype_lookup[metric],
        color: "black"
        // color: advertiser_colors[advertiser]
      }
    };

    // console.log("adding revenue cutoff trace");
    Plotly.addTraces(myPlotDiv, trace);

  }

}


// ############ THIS FUNCTION WILL CREATE THE HTML THAT WILL FILL IN THE TABLE  ############
// ############ WITH ALL THE IMPORTANT INFORMATION WE CARE ABOUT FOR ACQUIAITION  ############
const getRowHTML = function(tempData){
  // console.log("inside getTableDataFunction");

  let paidTableHtml = ``;
  
  paidTableHtml = `<!-- <td>${tempData.date}</td> --><!-- Date -->
  <td>
    ${tempData.advertiser}<!-- Advertiser Name -->
  </td>
  <td>
    $${numberWithCommas(tempData.spend.toFixed(2))}<!-- Spend -->
  </td>
  <td>
    ${numberWithCommas(tempData.impressions)}<!-- Impressions -->
  </td>
  <td>
    ${numberWithCommas(tempData.clicks)}<!-- Clicks -->
  </td>
  <td>
    ${( (tempData.clicks / tempData.impressions) * 100 ).toFixed(2)}% <!-- CTR -->
  </td>
  <td>
    ${numberWithCommas(tempData.views)}<!-- Views -->
  </td>
  <td>
    ${numberWithCommas(tempData.installs)}<!-- Installs -->
  </td>
  <td>
    $${(tempData.spend / tempData.installs).toFixed(2)}<!-- CPI -->
  </td>
  <td>
    $${(tempData.ltv_subs_revenue / tempData.installs).toFixed(2)}<!-- ARPU -->
  </td>
  <td>
    ${( (tempData.installs / tempData.clicks) * 100 ).toFixed(2)}% <!-- CRI -->
  </td>
  <td>
    ${numberWithCommas(tempData.sessions)}<!-- Sessions -->
  </td>
  <td>
    ${numberWithCommas(tempData.new_workout_saved_unique)}<!-- Unique Workouts -->
  </td>
  <td>
    ${numberWithCommas(tempData.trial_starts_all)}<!-- Trial Starts -->
  </td>
  <td>
    $${(tempData.spend / tempData.trial_starts_all).toFixed(2)}<!-- CPT -->
  </td>
  <td>
    $${(tempData.ltv_subs_revenue / tempData.trial_starts_all).toFixed(2)}<!-- ARP Trial -->
  </td>
  <td>
    ${( (tempData.trial_starts_all / tempData.installs) * 100 ).toFixed(2)}% <!-- Trials / User -->
  </td>
  <td>
    ${numberWithCommas(tempData.ltv_subs_all)}<!-- Subscribers -->
  </td>
  <td>
    ${( (tempData.ltv_subs_all / tempData.trial_starts_all) * 100 ).toFixed(2)}% <!-- Subs / Trial -->
  </td>
  <td>
    $${numberWithCommas(tempData.ltv_subs_revenue.toFixed(2))}<!-- Revenue -->
  </td>
  <td>
    ${( ((tempData.ltv_subs_revenue / tempData.spend) - 1) * 100 ).toFixed(2)}% <!-- ROAS -->
  </td>`;

  return paidTableHtml;
}

const getOrganicPlusPaidSummaryRowHTML = function(tempData){

  let paidTableHtml = ``;
  
  paidTableHtml = `<!-- <td>${tempData.date}</td> --><!-- Date -->
  <td>
    ${tempData.advertiser}<!-- Advertiser Name -->
  </td>
  <td>
    $${numberWithCommas(tempData.spend.toFixed(2))}<!-- --><!-- Spend -->
  </td>
  <td>
    <!-- ${numberWithCommas(tempData.impressions)}--><!-- Impressions -->
  </td>
  <td>
    <!-- ${numberWithCommas(tempData.clicks)}--><!-- Clicks -->
  </td>
  <td>
    <!-- ${( (tempData.clicks / tempData.impressions) * 100 ).toFixed(2)}% --><!-- CTR -->
  </td>
  <td>
    <!-- ${numberWithCommas(tempData.views)}--><!-- Views -->
  </td>
  <td>
    ${numberWithCommas(tempData.installs)}<!-- Installs -->
  </td>
  <td>
    $${(tempData.spend / tempData.installs).toFixed(2)}<!-- CPI -->
  </td>
  <td>
    <!-- ARPU -->
  </td>
  <td>
    <!-- Installs / Click -->
  </td>
  <td>
    <!-- ${numberWithCommas(tempData.sessions)}--><!-- Sessions -->
  </td>
  <td>
    ${numberWithCommas(tempData.new_workout_saved_unique)}<!-- Unique Workouts -->
  </td>
  <td>
    ${numberWithCommas(tempData.trial_starts_all)}<!-- Trial Starts -->
  </td>
  <td>
    $${(tempData.spend / tempData.trial_starts_all).toFixed(2)}<!-- CPT -->
  </td>
  <td>
    <!-- ARP Trial -->
  </td>
  <td>
    ${( (tempData.trial_starts_all / tempData.installs) * 100 ).toFixed(2)}% <!-- Trials / User -->
  </td>
  <td>
    <!-- Subscribers -->
  </td>
  <td>
    GM<br>ARPU
    $${( (tempData.ltv_subs_revenue / tempData.installs) - (tempData.spend / tempData.installs) ).toFixed(2)}<!-- GM ARPU -->  
    <!-- CRS -->
  </td>
  <td>
    Gross<br>Margin<br>
    $${numberWithCommas((tempData.ltv_subs_revenue - tempData.spend).toFixed(2))}<!-- Revenue -->
    <!-- Gross Margin -->
  </td>
  <td>
    GM<br>ROI<br>
    ${( tempData.ltv_subs_revenue / tempData.spend * 100 ).toFixed(2)}%
    <!-- GM ROI -->
  </td>`;

  return paidTableHtml;
}



const getOrganicRowHTML = function(tempData){

  console.log("getOrganicRowHTML");

  let paidTableHtml = ``;
  
  paidTableHtml = `
  <td>
    ${tempData.advertiser}<!-- Advertiser Name -->
  </td>
  <td>--</td><!-- Spend -->
  <td>--</td><!-- Impressions -->
  <td>--</td><!-- Clicks -->
  <td>--</td><!-- CTR -->
  <td>--</td><!-- Views -->
  <td>
    ${numberWithCommas(tempData.installs)}<!-- Installs -->
  </td>
  <td>--</td><!-- CPI -->
  <td>--</td><!-- ARPU -->
  <td>--</td><!-- Inst/Click -->
  <td>--</td><!-- Sessions -->
  <td>
    ${numberWithCommas(tempData.new_workout_saved_unique)}<!-- Unique Workouts -->
  </td>
  <td>
    ${numberWithCommas(tempData.trial_starts_all)}<!-- Trial Starts -->
  </td>
  <td>--</td><!-- CPT -->
  <td>--</td><!-- ARP Trial -->
  <td>
    ${( (tempData.trial_starts_all / tempData.installs) * 100 ).toFixed(2)}% <!-- Trials/User -->
  </td>
  <td>--</td><!-- Subs -->
  <td>--</td><!-- Subs/Trial-->
  <td>--</td><!-- Revenue -->
  <td>--</td><!-- ROAS -->`;

  return paidTableHtml;
}


const getBlankRowHTML = function(){

  console.log("we're here");

  let paidTableHtml = ``;
  
  paidTableHtml = `
  <td>--</td>
  <td>--</td>
  <td>--</td>
  <td>--</td>
  <td>--</td>
  <td>--</td>
  <td>--</td>
  <td>--</td>
  <td>--</td>
  <td>--</td>
  <td>--</td>
  <td>--</td>
  <td>--</td>
  <td>--</td>
  <td>--</td>
  <td>--</td>
  <td>--</td>
  <td>--</td>
  <td>--</td>
  <td>--</td>`;

  return paidTableHtml;
}


function addAllAdvertiserDataInColumn(data, columnName){

    let addedData = 0;

    data.map((d, i) => {
          addedData += d[columnName];
    });

    return addedData;
}

function createSummaryRow(data, row_name, tr_class, callRowHTML){
  
  let summary_row_data = [{
    "advertiser": row_name,
    "clicks": addAllAdvertiserDataInColumn(data, "clicks"),
    "impressions": addAllAdvertiserDataInColumn(data, "impressions"),
    "installs": addAllAdvertiserDataInColumn(data, "installs"),
    "ltv_subs_all": addAllAdvertiserDataInColumn(data, "ltv_subs_all"),
    "ltv_subs_revenue": addAllAdvertiserDataInColumn(data, "ltv_subs_revenue"),
    "new_workout_saved_unique": addAllAdvertiserDataInColumn(data, "new_workout_saved_unique"),
    "sessions": addAllAdvertiserDataInColumn(data, "sessions"),
    "spend": addAllAdvertiserDataInColumn(data, "spend"),
    "trial_starts_all": addAllAdvertiserDataInColumn(data, "trial_starts_all"),
    "views": addAllAdvertiserDataInColumn(data, "views")
  }];

  // add the summary row
  let tr_summary = d3.select('tbody').selectAll(tr_class).data(summary_row_data);

  tr_summary.enter()
      .append("tr").classed("highlight", true)//.classed(".table-dark", true)
      .merge(tr_summary)
      .html(callRowHTML);
  
  tr_summary.exit().remove();

  return 1;
}

// add the rows for each data entry and select all tr_class objects
function createRowsFromData(data, tr_class, callRowHTML){

    let tr = d3.select('tbody').selectAll(tr_class).data(data);    

    tr.enter()
        .append("tr")//.classed("highlight", false)
        .merge(tr)
        .html(callRowHTML);

    tr.exit().remove();
}


function displayTableData(data){

    // console.log("attempting to display table data");
    // console.log("tabledata = ", data);

    advertiser_data = data.filter((d) => {
      return d.advertiser !== "Organic";
    });

    organic_data = data.filter((d) => {
      return d.advertiser === "Organic";
    });

    // console.log("displayTableData() organic Data = ", organic_data);

    // remove all additional row formatting before building the table
    d3.select('tbody').selectAll('tr').classed("highlight", false);

    // create rows from advertiser_data
    createRowsFromData(advertiser_data, "tr", getRowHTML);

    // if there's more than one advertiser add the paid summary row
    if( advertiser_data.length > 1) {
      createSummaryRow(advertiser_data, "PAID SUMMARY", "tr.summary", getRowHTML);
    }

    // add organics row
    if( organic_data.length > 0) {

      createRowsFromData(organic_data, "tr.organic", getOrganicRowHTML);
      
    }

    // add total summary row if the number of advertisers chosen is greater than 4 and the os is IOS or both IOS and Android (this works for IOS and both)
    // OR if the advertisers chosen is greater than 1 and the os chosen is android only
    if( ( advertiser_data.length > 4 && (os_chosen.includes("IOS") ) ) || ( advertiser_data.length > 1 && os_chosen.length == 1 && (os_chosen.includes("ANDROID") ) ) ) {
      createSummaryRow(data, "TOTAL SUMMARY", "tr.summarywithorganics", getOrganicPlusPaidSummaryRowHTML);
    }   

}






/* ################################
  ****  EVENT HANDLERS
################################### */

// DATE PICKER "DATE CHANGED"
function dateChanged(start, end) {

  let start_date = start.format('YYYY-MM-DD');
  let end_date = end.format('YYYY-MM-DD');

  console.log("A new date selection was made: " + start_date + ' to ' + end_date );
  // Fetch new data each time a new sample is selected

  let api_call = "/api/v1.0/daterange_pandas/" + start_date + "/" + end_date; 

  d3.json( api_call ).then((data) => {
    // displayData(data[0]);
    chartdata = data[0];
    comparison_data = data[2];
    // buildCharts(chartdata, comparison_data);  
    buildCharts();  
    displayTableData(data[1]);
  });  

}


function updateOSSelection(){

  // console.log("checkbox chosen");
  
  let choices = [];

  d3.selectAll(".OSCheckbox").each( function(d) {
    
    // console.log("checkbox chosen 2");

    let cb = d3.select(this);

    if(cb.property("checked")){

      let chosenCheckBox = cb.property("value");

      // console.log("checkbox chosen: " + chosenCheckBox);

      choices.push(chosenCheckBox);
    }

  });

  let api_call_base = "/api/v1.0/os_type"
  let item_key = "os"

  let api_call = createAPICallString(api_call_base, item_key, choices);

  os_chosen = choices;

  console.log("os_chosen == ", os_chosen); 

  d3.json( api_call ).then((data) => {
    // displayData(data[0]);
    chartdata = data[0];
    comparison_data = data[2];
    // buildCharts(chartdata, comparison_data);  
    buildCharts();  
    displayTableData(data[1]);
  });


}


function updateAdvertiserSelection(){

  // console.log("checkbox chosen");
  
  let choices = [];

  d3.selectAll(".AdvertiserCheckbox").each( function(d) {
    
    // console.log("checkbox chosen 2");

    let cb = d3.select(this);

    if(cb.property("checked")){

      let chosenCheckBox = cb.property("value");

      // console.log("checkbox chosen: " + chosenCheckBox);

      choices.push(chosenCheckBox);
    }

  });

  let api_call_base = "/api/v1.0/advertiser_type"
  let item_key = "advertiser"

  let api_call = createAPICallString(api_call_base, item_key, choices);

  // console.log("Api Call == ", api_call);

  d3.json( api_call ).then((data) => {
    // displayData(data[0]);
    chartdata = data[0];
    comparison_data = data[2];
    // buildCharts(chartdata, comparison_data);  
    buildCharts();  
    displayTableData(data[1]);

  });   


}



function updateMetricsSelection(callBuildCharts){

  // console.log("metrics checkbox chosen");

  let choices = [];

  d3.selectAll(".MetricsCheckbox").each( function(d) {
    
    // console.log("checkbox chosen 2");

    let cb = d3.select(this);

    if(cb.property("checked")){

      let chosenCheckBox = cb.property("value");

      // console.log("checkbox chosen: " + chosenCheckBox);

      choices.push(chosenCheckBox);
    }

  });
  
  // if (choices === undefined || choices.length == 0){
  //   console.log("metrics boxes all unchecked. defaulting to 'spend'");
  //   choices = ["spend"];
  //   // choices.push("spend");
  // }

  metrics_chosen = choices;
  
  // callBuildCharts is only sent in when called by the init function
  if(callBuildCharts !== false){
    
    // buildCharts(chartdata, comparison_data);  
    buildCharts();
    // buildChartsWithChoices(chartdata);
  }

  
  // let api_call_base = "/api/v1.0/advertiser_type"
  // let item_key = "advertiser"

  // let api_call = createAPICallString(api_call_base, item_key, choices);

  // // console.log("Api Call == ", api_call);

  // d3.json( api_call ).then((data) => {
  //   // displayData(data[0]);
  //   displayTableData(data[1]);
  //   chartdata = data[0];
  //   buildCharts(data[0]);
  // });   


}


//abracadabra
function updateAdditionalControls(){

  // let cb = this.value;

  let chosenCheckBox = this.value;//cb.property("value");
  let isChecked = this.checked;//cb.property("checked");

  switch (chosenCheckBox) {
    case "stacked":
      displayStackedGraph = isChecked;
      // console.log("stacked is", isChecked);
      break;
    case "movingaverage":
      // console.log("is movingaverage checked?", isChecked);
      return;
      // break;
    case "comparison":
      // check to make sure there was an actual state change and if so, do stuff
      if(displayComparisonChart != isChecked){
        displayComparisonChart = isChecked;
        set_metrics_visibility_state();
      }
      break;        
    default:
      console.log("need to add '" + chosenCheckBox + "' checkbox to switch statement");
  }

  
  // buildCharts(chartdata, comparison_data);  
  buildCharts();  
}




// function updateAdditionalControls2(){

//   d3.selectAll(".GraphModifierCheckBox").each( function(d) {
    
//     // console.log("checkbox chosen 2");

//     let cb = d3.select(this);

//     let chosenCheckBox = cb.property("value");
//     let isChecked = cb.property("checked");

//     switch (chosenCheckBox) {
//       case "stacked":
//         displayStackedGraph = isChecked;
//         // console.log("stacked is", isChecked);
//         break;
//       case "movingaverage":
//         // console.log("is movingaverage checked?", isChecked);
//         break;
//       case "comparison":
//         // check to make sure there was an actual state change and if so, do stuff
//         if(displayComparisonChart != isChecked){
//           displayComparisonChart = isChecked;
//           set_metrics_visibility_state();
//         }
//         break;        
//       default:
//         console.log("need to add '" + chosenCheckBox + "' checkbox to switch statement");
//     }

//     // // comparison
//     // if(){
//     //   let chosenCheckBox = cb.property("value");

//     //   if(chosenCheckBox == "stacked"){
//     //     displayStackedGraph = (isChecked === true) ? true : 'Off';
//     //   }
      
//     // }
//     // else{
//     //   displayStackedGraph = false;
//     // }

//   });
  
    // // buildCharts(chartdata, comparison_data);  
    // buildCharts();  
// }


function updateComparisonType(){

  comparisonChartType = this.value; // "spend_vs_gm"

  // buildCharts(chartdata, comparison_data);  
  buildCharts();  
}


function setYaxisMaxValue(){

  switch (this.name) {
    case "set_y1axis_range":
        y1AxisMaxValue = (this.value === "") ? 0 : +this.value;
        break;
    case "set_y2axis_range":
        y2AxisMaxValue = (this.value === "") ? 0 : +this.value;
      break;
    default:
      // console.log("need to add '" + comparisonChartType + "' radio button to switch statement");
  }
  

  // console.log("name of input", this.name);

  // buildCharts(chartdata, comparison_data);  
  buildCharts();  
}

//abracadabra
function showTheLTVPerTrial(){

  // showLTVPerTrial = this.value;
  showLTVPerTrial = this.checked; 

  // console.log("showLTVPerTrial value", showLTVPerTrial)

  // buildCharts(chartdata, comparison_data);  
  buildCharts();  

}

function setLTVValue(){

  customLTV = (this.value === "") ? 0 : +this.value;

  // buildCharts(chartdata, comparison_data);  
  buildCharts();  
}


/* ################################
  ****  HELPER FUNCTIONS
################################### */

function createAPICallString(api_call_base, key, values){

  let api_call_string = api_call_base;

  values.map((value, i) => {
    if(i === 0){
      api_call_string = api_call_string + "?" + key + "1=" + value;
    }
    else {
      api_call_string = api_call_string + "&" + key + String(i+1) + "=" + value;
    }
  });

  return api_call_string;

}


function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}

function set_metrics_visibility_state(){

  // showComparison = (displayComparisonChart === true) ? true : false;

  let line_graph_metrics = d3.selectAll(".visible-for-line-graph").classed("HiddenElement", displayComparisonChart);
  let comparison_chart_metrics = d3.selectAll(".visible-for-comparison-chart").classed("HiddenElement", !displayComparisonChart);


}

function setTraceVisibility(metric){

  if(metrics_info[metric].name === "y1"){
    return false;
  }

  return true;
}

function setStackGroup(metric){

  if(displayStackedGraph === true && metrics_info[metric].stackable){
    return metrics_info[metric].name;
  }

  return [];
}

//abracadabra
function setComparisonChartHoverText(xvals, yvals, charttype){
  console.log("we are here");
}



function setHoverText(data, metric, advertiser){
  //   "cpi": "spend/installs",
  //   "arpu": "revenue/installs",
  //   "cpt": "spend/trials",
  //   "arp_trial": "revenue/trials",
  //   "roas": "( (revenue/spend) - 1 ) * 100 ",
  //   "trials_per_user": "( (trials/installs) - 1 ) * 100 ",
  //   "subs_per_trial": "( (subs/trials) - 1 ) * 100 ",
  let hovertext_series = [];
  
  data.advertiser.map((d, i) => {
    if (d === advertiser){
      
      let formattedDate = moment(data["date"][i]).format('ddd, MM/DD'); //.format('ddd, MMM D') 
      let yval = 0;

      if(metric === "spend" || metric === "revenue"){
        yval = metrics_info[metric].symbol + data[metric][i].toFixed(2);
        // advertiser_series.push( (data["spend"][i] / data[metric_divisor_lookup[metric]][i]).toFixed(2) );
      }      
      else if(metric === "cpi" || metric === "arpu" || metric === "cpt" || metric === "arp_trial"){
        yval = metrics_info[metric].symbol + (data[metrics_info[metric].numerator][i] / data[metrics_info[metric].divisor][i]).toFixed(2);
        // advertiser_series.push( (data["spend"][i] / data[metric_divisor_lookup[metric]][i]).toFixed(2) );
      }
      else if(metric === "roas"){ // roas
        yval = ( ((data[metrics_info[metric].numerator][i] / data[metrics_info[metric].divisor][i]) - 1) * 100 ).toFixed(2) + "%";
        // advertiser_series.push( (data["ltv_subs_revenue"][i] / data[metric_divisor_lookup[metric]][i]).toFixed(2) );
      }
      else if(metric === "trials_per_user" || metric === "subs_per_trial"){ // trials_per_user OR subs_per_trial
        yval = ( (data[metrics_info[metric].numerator][i] / data[metrics_info[metric].divisor][i]) * 100 ).toFixed(2) + "%";
        // advertiser_series.push( (data["ltv_subs_revenue"][i] / data[metric_divisor_lookup[metric]][i]).toFixed(2) );
      }
      else if(metric === "yaxis_placeholder"){ // trials_per_user OR subs_per_trial
        yval = 0;
      }
      else{
        yval = metrics_info[metric].symbol + data[metric][i];
      }

      // console.log("val type", typeof(yval));
      // console.log("value", yval);
      let hovertext = yval + " (" + formattedDate + ")";

      hovertext_series.push(hovertext);
    }
  });

  return hovertext_series;

}


// this delegates what the Y axis range is when a number is set in the y1 or y2 max
function setAxisRangeWhenEmpty(emptyRangeValue){

  metrics_chosen.map(metric => {
    if(metrics_info[metric].yaxis === "y1" && metrics_info[metric].name !== "y1"){
      // console.log("setAxisRangeWhenEmpty", metrics_info[metric].yaxis);//, metrics_info[metric].name);
      return [];
    }
  });
  
  return emptyRangeValue;
}


function setAxisLabelsAndGridVisibility(){
  
  let num_y_axis_metrics_chosen = 0;

  metrics_chosen.map(metric => {
    // if(metrics_info[metric].yaxis === "y1" && metrics_info[metric].name !== "y1"){
    //   return [];
    // }
    if(metrics_info[metric].yaxis === "y1"){
      num_y_axis_metrics_chosen += 1;
    }
  });

  if(num_y_axis_metrics_chosen <= 1){
    return false;
  }

  return true;
}

/* ################################
  ****  Takes the shortname of an axis ("y1", "y2", or "y3"), 
  ****      figures out which metrics in the global "metrics_chosen" array
  ****      are utilizing this axis and returns a string which will be
  ****      the name of the axis */
function nameYAxisTitle(axis_shortname){

  let axis_name = axis_shortname;
  // console.log("Given Axis: ", axis_shortname);

  metrics_chosen.map( (metric) => {
    
    // console.log("Metric Axis: ", metrics_info[metric].yaxis);
    
    if(metrics_info[metric].yaxis === axis_shortname && metrics_info[metric].name !== axis_shortname){
      axis_name = axis_name + " (" + metrics_info[metric].name + ")";
    }
  });

  // if there are no metrics using the y1 axis, set the name to be blank
  if(axis_name === "y1"){
    axis_name = "";
  }

  return axis_name;
}


/* ################################
  ****  NEWEST MAPING DATA TO METRICS */
function getOvertimeGraphYValues(data, metric, advertiser) {

  advertiser_series = [];

  //   "cpi": "spend/installs",
  //   "arpu": "revenue/installs",
  //   "cpt": "spend/trials",
  //   "arp_trial": "revenue/trials",
  //   "roas": "( (revenue/spend) - 1 ) * 100 ",
  //   "trials_per_user": "( (trials/installs) - 1 ) * 100 ",
  //   "subs_per_trial": "( (subs/trials) - 1 ) * 100 ",

  data.advertiser.map((d, i) => {
    if (d === advertiser){
      // console.log("series ", series);
      // console.log("advertiser ", advertiser);
      // console.log("value ", data[series][i]);
      if(metric === "spend" || metric === "revenue"){
        // console.log("spend or revenue", data[metric][i]);
        advertiser_series.push( parseFloat(data[metric][i].toFixed(2)) );
        // advertiser_series.push( data[metric][i].toFixed(2) );
        // advertiser_series.push( (data["spend"][i] / data[metric_divisor_lookup[metric]][i]).toFixed(2) );
      }    
      else if(metric === "cpi" || metric === "arpu" || metric === "cpt" || metric === "arp_trial"){
        advertiser_series.push( parseFloat((data[metrics_info[metric].numerator][i] / data[metrics_info[metric].divisor][i]).toFixed(2)) );
        // advertiser_series.push( (data["spend"][i] / data[metric_divisor_lookup[metric]][i]).toFixed(2) );
      }
      else if(metric === "roas"){ // roas
        advertiser_series.push( parseFloat(( ((data[metrics_info[metric].numerator][i] / data[metrics_info[metric].divisor][i]) - 1) * 100 ).toFixed(2)) );
        // advertiser_series.push( (data["ltv_subs_revenue"][i] / data[metric_divisor_lookup[metric]][i]).toFixed(2) );
      }
      else if(metric === "trials_per_user" || metric === "subs_per_trial"){ // trials_per_user OR subs_per_trial
        advertiser_series.push( parseFloat(( (data[metrics_info[metric].numerator][i] / data[metrics_info[metric].divisor][i]) * 100 ).toFixed(2)) );
        // advertiser_series.push( (data["ltv_subs_revenue"][i] / data[metric_divisor_lookup[metric]][i]).toFixed(2) );
      }
      else if(metric === "yaxis_placeholder"){ // trials_per_user OR subs_per_trial
        advertiser_series.push(0);
        // advertiser_series.push(( (data[metrics_info[metric].numerator][i] / data[metrics_info[metric].divisor][i]) * 100 ).toFixed(2) );
        // advertiser_series.push( (data["ltv_subs_revenue"][i] / data[metric_divisor_lookup[metric]][i]).toFixed(2) );
      }
      else{
        advertiser_series.push(data[metric][i]);
      }

    }
  });

  return advertiser_series;

}



function getOvertimeGraphXValues(data, series, advertiser) {

  advertiser_series = [];

  data.advertiser.map((d, i) => {
    if (d === advertiser){
      // console.log("series ", series);
      // console.log("advertiser ", advertiser);
      // console.log("value ", data[series][i]);
      advertiser_series.push(data[series][i]);
    }
  });

  return advertiser_series;

}


function getComparisonChartXValues(return_dataset){

  let xAxisValues = [];
  let xAxisLTVValues = [];

  switch (comparisonChartType) {
    case "spend_vs_roi":
    case "spend_vs_revenue":
    case "spend_vs_gm":
        xAxisValues = comparison_data.spend;
        xAxisLTVValues = comparison_data.spend;
      break;
    // case "spend_vs_gm":
    //     xAxisValues = comparison_data.ltv_subs_revenue.map((revenue, i) => {
    //     return numberWithCommas((revenue - comparison_data.spend[i]).toFixed(2));
    //   });
    //   // console.log("is movingaverage checked?", isChecked);
    //   break;
    case "gm_vs_roi":
        xAxisValues = comparison_data.ltv_subs_revenue.map((revenue, i) => {
          return numberWithCommas((revenue - comparison_data.spend[i]).toFixed(2));
        });

        xAxisLTVValues = comparison_data.trial_starts_all.map((trials, i) => {
          return numberWithCommas(((trials * customLTV) - comparison_data.spend[i]).toFixed(2));
        });    

        // console.log("is movingaverage checked?", isChecked);
        break;
    // case "gm_vs_roi":
    //     // ${( tempData.ltv_subs_revenue / tempData.spend * 100 ).toFixed(2)}%
    //     xAxisValues = comparison_data.ltv_subs_revenue.map((revenue, i) => {
    //       return ( ( (revenue / comparison_data.spend[i]) - 1 ) * 100 ).toFixed(2);
    //     });
    //     // console.log("is movingaverage checked?", isChecked);
    //     break;
    default:
      console.log("need to add '" + comparisonChartType + "' radio button to switch statement");
  }
  
  // return xAxisValues;
  return (return_dataset === "LTV") ? xAxisLTVValues : xAxisValues;
}



function getComparisonChartYValues(return_dataset){

  let yAxisValues = [];
  let yAxisLTVValues = [];

  switch (comparisonChartType) {
    case "spend_vs_revenue":
      yAxisValues = comparison_data.ltv_subs_revenue;
      //abracadabra
      yAxisLTVValues = comparison_data.trial_starts_all.map((trials, i) => {
        return numberWithCommas( (trials * customLTV).toFixed(2) );
      });
      break;
    case "spend_vs_gm":
      yAxisValues = comparison_data.ltv_subs_revenue.map((revenue, i) => {
        return numberWithCommas((revenue - comparison_data.spend[i]).toFixed(2));
      });

      yAxisLTVValues = comparison_data.trial_starts_all.map((trials, i) => {
        return numberWithCommas( ((trials * customLTV) - comparison_data.spend[i]).toFixed(2) );
        // return numberWithCommas( (trials * customLTV).toFixed(2) );
      });      
      // console.log("is movingaverage checked?", isChecked);
      break;
    case "spend_vs_roi":
    case "gm_vs_roi":
        yAxisValues = comparison_data.ltv_subs_revenue.map((revenue, i) => {
          return ( ( (revenue / comparison_data.spend[i]) - 1 ) * 100 ).toFixed(2);
        });

        yAxisLTVValues = comparison_data.trial_starts_all.map((trials, i) => {
          return ( ( ((trials * customLTV) / comparison_data.spend[i]) - 1 ) * 100 ).toFixed(2);
          // return numberWithCommas( (trials * customLTV).toFixed(2) );
        });           
        // console.log("is movingaverage checked?", isChecked);
        break;
    // case "gm_vs_roi":
    //     // ${( tempData.ltv_subs_revenue / tempData.spend * 100 ).toFixed(2)}%
    //     yAxisValues = comparison_data.ltv_subs_revenue.map((revenue, i) => {
    //       return ( ( (revenue / comparison_data.spend[i]) - 1 ) * 100 ).toFixed(2);
    //     });
    //     // console.log("is movingaverage checked?", isChecked);
    //     break;
    default:
      console.log("need to add '" + comparisonChartType + "' radio button to switch statement");
  }
  
  return (return_dataset === "LTV") ? yAxisLTVValues : yAxisValues;
}



/* ################################
  ****  INITIALIZATION FUNCTIONS
################################### */

function init() {
  console.log("init function will sync the checkboxes' 'checked' state to the server settings and set UI elements accordingly");
  
  set_metrics_visibility_state();

  let api_call = "/api/v1.0/frontend_init"; 

  // let cb = d3.selectAll(".OSCheckbox[value='IOS']");
  // console.log("checkbox property == ", cb.property("value"));
  // console.log("is it checked? == ", cb.property("checked"));

  // makes the above API call 
  d3.json( api_call ).then((chosenCheckboxes) => {

    // index 0 returns a list of value names for the OS Checkboxes that are 'checked'
    // index 1 returns a list of value names for the Advertiser Checkboxes that are 'checked'
    let osCheckboxes = chosenCheckboxes[0];
    let advertiserCheckboxes = chosenCheckboxes[1];

    osCheckboxes.map( (checkbox) => {

      selectStatement = ".OSCheckbox[value='" + checkbox + "']";

      // console.log(selectStatement);

      d3.selectAll(selectStatement).property("checked", true);

    });

    os_chosen = osCheckboxes;
    // console.log("os_chosen == ", os_chosen); 

    advertiserCheckboxes.map( (checkbox) => {

      selectStatement = ".AdvertiserCheckbox[value='" + checkbox + "']";

      d3.selectAll(selectStatement).property("checked", true);
    });

    // Create our Plotly object for the first time with some random data
    var data = [{
      x: [0],
      y: [0],
      type: 'scatter'
    }];
  
    Plotly.newPlot(myPlotDiv, data);

    // adding the "false" means it will not try to display the graph
    // this is good because otherwise we'll be trying to display the graph 2x in a row
    updateMetricsSelection(false);
    
  });
  
}


/* ################################
  ****  INITIALIZATION CALLS
################################### */
// Initialize the dashboard
// init_sql();
init();

d3.selectAll(".OSCheckbox").on("change", updateOSSelection);
d3.selectAll(".AdvertiserCheckbox").on("change", updateAdvertiserSelection);
d3.selectAll(".MetricsCheckbox").on("change", updateMetricsSelection);
d3.selectAll(".GraphModifierCheckBox").on("change", updateAdditionalControls);
d3.selectAll(".ComparisonMetrics").on("change", updateComparisonType);
d3.selectAll(".YAxisRangeSetter").on("keyup", setYaxisMaxValue);
d3.selectAll(".LTVPerTrialCheckbox").on("change", showTheLTVPerTrial);
d3.selectAll(".LTVPerTrialSetter").on("keyup", setLTVValue);

