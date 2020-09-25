// @TODO: YOUR CODE HERE!
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads, remove it
    // and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");

    // clear svg if not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }

    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = {
    top: 80,
    right: 800,
    bottom: 80,
    left: 50
    };

    // Creating dimensions in our canvas space
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Select body, append SVG area to it, and set dimensions
    var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    // Append an SVG group
    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Retrieve data from the CSV file and excecute everything below
    d3.csv("assets/data/data.csv").then(function(journalismData, err) {
        if (err) throw err;

        console.log(journalismData);

        journalismData.forEach(function(data) {
            //data.id 
            //data.state 
            //data.abbr
            data.poverty = +data.poverty
            //data.povertyMoe 
            //data.age
            //data.ageMoe
            //data.income
            //data.incomeMoe
            data.healthcare = +data.healthcare
            //data.healthcareLow
            //data.healthcareHigh
            //data.obesity
            //data.obesityLow
            //data.obesityHigh
            //data.smokes
            //data.smokesLow
            //data.smokesHigh
        });

        // 
        var xAxisName = "poverty";
        var yAxisName = "healthcare";

        // create scales
        var xLinearScale = d3.scaleLinear()
            .domain(d3.extent(journalismData, d => d.poverty))
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(journalismData, d=> d.healthcare)])
            .range([height, 0]);

        // create axes
        var xAxis = d3.axisBottom(xLinearScale).ticks(7);
        var yAxis = d3.axisLeft(yLinearScale);

        // append axes to the chart
        chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)

        chartGroup.append("g")
        .classed("y-axis", true)
        .call(yAxis);

        // Create axes labels
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 35})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");

        // append circles
        var circlesGroup = chartGroup.selectAll("circle")
        .data(journalismData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "blue")
        .attr("stroke-width", "1")
        .attr("stroke", "black")
        .attr("opacity", "0.7")

        // append text to circles
        var textGroup = chartGroup.append("g")
        .selectAll("text")
        .data(journalismData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("alignment-baseline", "middle")
        .style("font-size", "10px")
        .attr("fill", "#fff")
        .text(d => d.abbr);

    }).catch(function(error) {
        console.log(error);
    });
};

// When the browser loads, makeResponsive() is called.
makeResponsive();
  
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);