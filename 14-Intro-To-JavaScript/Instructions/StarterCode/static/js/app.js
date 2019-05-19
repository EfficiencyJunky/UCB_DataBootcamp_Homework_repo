// from data.js
let tableData = data;

// Select the buttons
let submit = d3.select("#filter-btn");
let clearButton = d3.select("#clear-filter-btn");

// select the table elements
let thead = d3.select("thead");
let tbody = d3.select("tbody");

// fill the table with all the data to begin
fillTableWithValues2(tableData);

// the brute force way of filling the table up
function fillTableWithValues1 (filteredData){

    tbody.html("");

    filteredData.forEach( (ufoSighting) => {
    
        let row = tbody.append("tr");
        let cell1 = tbody.append("td").text(ufoSighting.datetime);
        let cell2 = tbody.append("td").text(ufoSighting.city);
        let cell3 = tbody.append("td").text(ufoSighting.state);
        let cell4 = tbody.append("td").text(ufoSighting.country);
        let cell5 = tbody.append("td").text(ufoSighting.shape);
        let cell6 = tbody.append("td").text(ufoSighting.durationMinutes); 
        let cell7 = tbody.append("td").text(ufoSighting.comments); 
    
      });

}

// the more elegant way of filling the table up
function fillTableWithValues2 (filteredData){

    tbody.html("");

    filteredData.forEach( (ufoSighting) => {

    var row = tbody.append("tr");

    Object.entries(ufoSighting).forEach( ([key, value]) => {

        var cell = tbody.append("td");

        cell.text(value);

    });

    });
}

// a failed experiment for filling the table up
function fillTableWithValues3 (filteredData){

    tbody.html("");

    const columns = thead.selectAll('th').selectAll(function() {
        return this.textContent;
      })._groups;

    // console.log("the columns are: ", thead.selectAll('th').selectAll('text')   );
    console.log("the columns are: ", columns);
    // console.log("the columns are: ", columns);

    // create a row for each object in the data
    // var rows = tbody.selectAll('tr')
    //     .data(filteredData)
    //     .enter()
    //     .append('tr');


    // // // create a cell in each row for each column
    // var cells = rows.selectAll('td')
    //     .data(function (row) {
    //     return columns.map(function (column) {
    //         return {column: column, value: row[column]};
    //     });
    //     })
    //     .enter()
    //     .append('td')
    //     .text(function (d) { return d.value; });
}


// click handler for "submit" button
submit.on("click", function() {

    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input element and get the raw HTML node
    let inputDate = d3.select("#datetime").property("value");
    let inputCity = d3.select("#city").property("value");
    let inputState = d3.select("#state").property("value");
    let inputCountry = d3.select("#country").property("value");
    let inputShape = d3.select("#shape").property("value");

    console.log("The date input was: ", inputDate);
    console.log("Here's the original dataset: ", tableData);

    let filteredData = tableData;

    if (inputDate != ""){
        filteredData = filteredData.filter(ufoSighting => ufoSighting.datetime === inputDate);
    }
    if (inputCity != ""){
        filteredData = filteredData.filter(ufoSighting => ufoSighting.city === inputCity);
    }
    if (inputState != ""){
        filteredData = filteredData.filter(ufoSighting => ufoSighting.state === inputState);
    }
    if (inputCountry != ""){
        filteredData = filteredData.filter(ufoSighting => ufoSighting.country === inputCountry);
    }
    if (inputShape != ""){
        filteredData = filteredData.filter(ufoSighting => ufoSighting.shape === inputShape);
    }

    console.log("Here's the filtered dataset based on input date: ", filteredData);

    //   fillTableWithValues1 (filteredData);
    fillTableWithValues2 (filteredData);

});

// click handler for "clear filters" button because it's just nice to 
// be able to clear all the filters and get back to square one
clearButton.on("click", function() {

    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input element and get the raw HTML node
    let inputDate = d3.select("#datetime").property("value", "");
    let inputCity = d3.select("#city").property("value", "");
    let inputState = d3.select("#state").property("value", "");
    let inputCountry = d3.select("#country").property("value", "");
    let inputShape = d3.select("#shape").property("value", "");

    fillTableWithValues2 (tableData);

});



