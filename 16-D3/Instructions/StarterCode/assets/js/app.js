// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 700;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Configure a parseTime function which will return a new Date object from a string
// var parseTime = d3.timeParse("%B");

// Load data from data.csv
d3.csv("assets/data/data.csv").then( function(census_data) {

    // Print the census_data
    // console.log(census_data);

    // Format the date and cast the poverty and healthcare values to a number
    census_data.forEach(function(data) {
    // data.date = parseTime(data.date);
        data.poverty = +data.poverty;    
        data.healthcare = +data.healthcare;
    });

    // Configure a time scale with a range between 0 and the chartWidth
    // Set the domain for the xLinearScale function
    // d3.extent returns the an array containing the min and max values for the property specified
    var xLinearScale = d3.scaleLinear()
        .range([0, chartWidth])
        .domain([ d3.min(census_data, data => data.poverty) - 1 , d3.max(census_data, data => data.poverty) + 1 ]);
        // .domain(d3.extent(census_data, data => data.poverty));

    // Configure a linear scale with a range between the chartHeight and 0
    // Set the domain for the xLinearScale function
    var yLinearScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([ Math.floor(d3.min(census_data, data => data.healthcare)) , d3.max(census_data, data => data.healthcare) + 1 ]);
        // .domain(d3.extent(census_data, data => data.healthcare));
        // .domain([0, d3.max(census_data, data => data.healthcare)]);

    console.log("min of healthcare: ", Math.floor(d3.min(census_data, data => data.healthcare)))
    // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(census_data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        // .attr("stroke-width", "1")
        // .attr("stroke", "black")
        .attr("fill", "skyblue");


    var textLabelGroup = chartGroup.selectAll("text")
        .data(census_data)
        .enter()
        .append("text")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .attr("fill", "white")
        .attr("x", d => xLinearScale(d.poverty) - 8)
        .attr("y", d => yLinearScale(d.healthcare) + 5)
        .text( d => d.abbr);
    
    // text label for the x axis
    var xLabelGroup = chartGroup.append("text")
        // Position the text
        // Center the text:
        // (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor)
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top/2 + 10})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text("In Poverty (%)");

    // text label for the y axis
    var yLabelGroup = chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("Lacks Healthcare (%)");

    // Append an SVG group element to the SVG area, create the left axis inside of it
    chartGroup.append("g")
        .classed("axis", true)
        .call(leftAxis);

    // Append an SVG group element to the SVG area, create the bottom axis inside of it
    // Translate the bottom axis to the bottom of the page
    chartGroup.append("g")
        .classed("axis", true)
        .attr("transform", "translate(0, " + chartHeight + ")")
        .call(bottomAxis);
});
