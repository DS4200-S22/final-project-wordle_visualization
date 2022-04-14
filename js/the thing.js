// set the dimensions and margins of the graph
// let margin = {top: 20, right: 30, bottom: 30, left: 55},
//     width = 460 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

let parseTime = d3.timeParse("%m/%d/%Y");

// append the svg object to the body of the page
let svg2 = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("data/area_chart.csv").then((data) => {

    // List of groups = header of the csv files
    let keys = data.columns.slice(1)

    // Add X axis
    let x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return parseTime(d["date"]); }))
    .range([ 0, width ]);
    svg2.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5));

    console.log(data["date"]);

    // Add Y axis
    let y = d3.scaleLinear()
    .domain([0, 18000])
    .range([ height, 0 ]);
    svg2.append("g")
    .call(d3.axisLeft(y));

    // color palette
    let color = d3.scaleOrdinal()
    .domain(keys)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf'])

    //stack the data?
    let stackedData = d3.stack()
    .keys(keys)
    (data)
    //console.log("This is the stack result: ", stackedData)

    // Show the areas
    svg2
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
        .style("fill", function(d) { return color(d.key); })
        .attr("g", d3.area()
            .x(function(d, i) { return x(parseTime(d["date"])); })
            .y0(function(d) {return y(d[0]); })
            .y1(function(d) { return y(d[1]); })
    )
})