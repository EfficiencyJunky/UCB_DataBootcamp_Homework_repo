function buildGauge(sample) {

  var level = sample/9 * 180;

  // Trig to calc meter point
  var degrees = 180 - level,
      radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{ type: 'scatter',
    x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'WFREQ',
      // text: level/180 * 9,
      text: sample,
      hoverinfo: 'text+name'},
    { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
    rotation: 90,
    text: ['8-9','7-8','6-7',
           '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgba(0, 25, 0, .5)', 'rgba(0, 60, 0, .5)', 'rgba(5, 100, 0, .5)',
                          'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                          'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                          'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                          'rgba(255, 255, 255, 0)']},
    labels: ['8-9','7-8','6-7',
             '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    title: '<b>Belly Button Washing Frequency</b> <br>Scrubs per Week',
    height: 500,
    width: 500,
    xaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]}
  };

  Plotly.newPlot('gauge', data, layout);

}


function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // let sampleToUse = "/metadata/" + sample;

  d3.json("/metadata/" + sample).then((sampleMetadata) => {

    // Use d3 to select the panel with id of `#sample-metadata`
    let metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sampleMetadata).forEach( ([key, value]) => {

      let paragraph = metadataPanel.append("p");
      
      paragraph.text(key + ": " + value);

    });


    // BONUS: Build the Gauge Chart
    console.log("the WFREQ value is: " + sampleMetadata.WFREQ);
    buildGauge(sampleMetadata.WFREQ);

  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/" + sample).then((sampleData) => {

    // @TODO: Build a Bubble Chart using the sample data

    // sampleData.sample_values.max

    var bubbleTrace = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: 'markers',
      hoverinfo: 'x+y+text',
      marker: {
        color: sampleData.otu_ids,
        size: sampleData.sample_values.map( (value) => {
          if(value < 10){
            return 10; 
          }
          return value;
        })
      }
    };
    
    var bubbleData = [bubbleTrace];
    
    var bubbleLayout = {
      hovermode:'closest',
      // title: 'Bubble Chart Hover Text',
      // showlegend: false,
      xaxis: {title: "OTU ID"},
      height: 600,
      width: 1200
    };
    
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    // Plotly.newPlot('bubble', bubbleData);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    // Part 5 - Working Pie Chart
    var pieTrace = {
      labels: sampleData.otu_ids.slice(0, 10),
      values: sampleData.sample_values.slice(0, 10),
      type: 'pie',
      text: sampleData.otu_labels.slice(0, 10),
      textinfo: 'percent',
      hoverinfo: 'text'
    };

    var pieData = [pieTrace];

    var pieLayout = {
      // title: "'Bar' Chart",
      autosize: true,
      margin: {
        l: -50,
        r: -50
        // b: 100,
        // t: 100,
        // pad: 1
      }
      // height: 500,
      // width: 500    
    };

    // Plotly.newPlot("pie", pieData);
    Plotly.newPlot("pie", pieData, pieLayout);

  });


}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
