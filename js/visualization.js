// Set margins and dimensions 
const margin = { top: 50, right: 50, bottom: 50, left: 200 };
const width = 1250 - margin.left - margin.right;
const height = 650 - margin.top - margin.bottom;

/*
Line chart (chart 1) set up and initialization
*/ 
// Append svg object to the body of the page to house linechart1
const svg1 = d3.select("#vis-container")
                .append("svg")
                .attr("class", "charts")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]); 

// Initialize brush for linechart1 and points. So that they are global. 
let myLine1; 

const svg2 = d3.select("#vis2-container")
                .append("svg")
                .attr("class", "charts")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]); 


// Plotting 
d3.csv("data/composite_wordle_data.csv").then((data) => {
  
  // So that the scales for all of the following charts are global
  let x1, y1, x2, y2, x3, y3;  

  // So that the keys are global
  let xKey1, yKey1, xKey2, yKey2, xKey3, yKey3;

  /*
  Scatterplot1
  */
  {
    // initializing the x and y axes keys
    xKey1 = "date";
    yKey1 = "number_of_players";

    // Find max x
    var parseTime = d3.timeParse("%m/%d/%Y");
    let maxX1 = d3.max(data, (d) => { return parseTime(d[xKey1]); });
    let minX1 = d3.min(data, (d) => { return parseTime(d[xKey1]); });

    // Create X scale
    x1 = d3.scaleLinear()
            .domain([minX1,maxX1])
            .range([margin.left, width-margin.right]);
        
    // Add x axis 
    svg1.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`) 
        .call(d3.axisBottom(x1)   
          .tickFormat(d3.timeFormat("%m/%d")))
        .attr("font-size", '20px')
        .call((g) => g.append("text")
                      .attr("x", width - margin.right)
                      .attr("y", margin.bottom - 4)
                      .attr("fill", "black")
                      .attr("text-anchor", "end")
                      .text(xKey1)
      );

    maxY1 = 18000; // TODO: get rid of hard coding
    minY1 = 0;

    // Create Y scale
    y1 = d3.scaleLinear()
                .domain([minY1, maxY1])
                .range([height - margin.bottom, margin.top]);

    // Add y axis 
    svg1.append("g")
        .attr("transform", `translate(${margin.left}, 0)`) 
        .call(d3.axisLeft(y1)) 
        .attr("font-size", '20px') 
        .call((g) => g.append("text")
                      .attr("x", 0)
                      .attr("y", margin.top - 20)
                      .attr("fill", "black")
                      .attr("text-anchor", "end")
                      .text(yKey1)
      );

    const yTooltipOffset = 15; 

    // Adds a tooltip with the information
    let tooltip = d3.select("#vis-container") 
                    .append("div3") 
                    .attr('id', "tooltip3") 
                    .style("opacity", 0) 
                    .attr("class", "tooltip");

    // Mouseover event handler
    let mouseover = function(event, d) {
    tooltip.html("Date: " + d[xKey1] + "<br> Number of Players: " + d[yKey1] + "<br>")
            .style("opacity", 1);

    tooltip.html("test")
            .style("opacity", 1);
    };

    // Mouse moving event handler
    let mousemove = function(event) {
    tooltip.style("left", (event.pageX)+"px") 
            .style("top", (event.pageY + yTooltipOffset) +"px");
    };

    // Mouseout event handler
    let mouseleave = function() { 
    tooltip.style("opacity", 0);
    };

    // Add points
    myLine1 = svg1.selectAll("circle")
                            .data(data)
                            .enter()
                              .append("circle")
                              .attr("id", (d) => d.wordle_id)
                              .attr("cx", (d) => x1(parseTime(d[xKey1])))
                              .attr("cy", (d) => y1(d[yKey1]))
                              .attr("r", 8)
                              .style("opacity", 1)
                              .on("mouseover", mouseover) 
                              .on("mousemove", mousemove)
                              .on("mouseleave", mouseleave);

    var line = d3.line()
    .x((d) => x1(parseTime(d[xKey1]))) 
    .y((d) => y1(d[yKey1])) 
    .curve(d3.curveMonotoneX)
    
    svg1.append("path")
    .datum(data) 
    .attr("class", "line") 
    .attr("d", line)
    .style("fill", "none")
    .style("stroke", "#0000FF")
    .style("stroke-width", "2");

}

  /*
  BarChart
  */
 {
  // initializing the x and y axes keys
  xKey2 = "date";
  yKey2 = "performance";

  // Find max x
  var parseTime = d3.timeParse("%m/%d/%Y");
  let maxX2 = d3.max(data, (d) => { return parseTime(d[xKey2]); });
  let minX2 = d3.min(data, (d) => { return parseTime(d[xKey2]); });

  // Create X scale
  let xScale2 = d3.scaleLinear()
          .domain([minX2,maxX2])
          .range([margin.left, width-margin.right]);
      
  // Add x axis 
  svg2.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`) 
      .call(d3.axisBottom(xScale2)   
        .tickFormat(d3.timeFormat("%m/%d")))
      .attr("font-size", '20px')
      .call((g) => g.append("text")
                    .attr("x", width - margin.right)
                    .attr("y", margin.bottom - 4)
                    .attr("fill", "black")
                    .attr("text-anchor", "end")
                    .text(xKey2)
    );

  // Find max y
  // var maxY1 = d3.max(data, (d) => { return d.number_of_players; });
  // var minY1 = d3.min(data, function(d){ return d.number_of_players; });
  // ext = d3.extent(data, (d) => {return d[yKey1]});

  maxY2 = 8.5;
  minY2 = 4.0;

  // Create Y scale
  let yScale2 = d3.scaleLinear()
              .domain([minY2, maxY2])
              .range([height - margin.bottom, margin.top]);

  // Add y axis 
  svg2.append("g")
      .attr("transform", `translate(${margin.left}, 0)`) 
      .call(d3.axisLeft(yScale2)) 
      .attr("font-size", '20px') 
      .call((g) => g.append("text")
                    .attr("x", 0)
                    .attr("y", margin.top - 20)
                    .attr("fill", "black")
                    .attr("text-anchor", "end")
                    .text("Performance")
    );

  const yTooltipOffset = 15; 

  // Adds a tooltip with the information
  let tooltip = d3.select("#vis2-container") 
                  .append("div3") 
                  .attr('id', "tooltip3") 
                  .style("opacity", 0) 
                  .attr("class", "tooltip");


  let rarity = "word_rarity"
  let word = "word"
  let numPlayers = "number_of_players"
  let partOfSpeech = "part_of_speech"
  let averageNumTries = "avg_num_of_tries"
  // Mouseover event handler
  let mouseover = function(event, d) {
  tooltip.html("Date: " + d[xKey2] 
  + "<br> Average # of Tries: " + d[averageNumTries] 
  + "<br> Word: " + d[wordr]
  + "<br> Word Rarity: " + d[rarity]
  + "<br> Part of Speech: " + d[partOfSpeech]
  + "<br> Total Number of Players " + d[numPlayers]
  + "<br>")
          .style("opacity", 1);
  };

  // Mouse moving event handler
  let mousemove = function(event) {
  tooltip.style("left", (event.pageX)+"px") 
          .style("top", (event.pageY + yTooltipOffset) +"px");
  };

  // Mouseout event handler
  let mouseleave = function() { 
  tooltip.style("opacity", 0);
  };

// Create x scale
 let barWidth = d3.scaleBand()
            .domain(d3.range(data.length))
            .range([margin.left, width - margin.right])
            .padding(0.1); 
  // Add points
  let myLine2 = svg2.selectAll(".bar")
                          .data(data)
                          .enter()
                            .append("rect")
                            .attr("class", "bar")
                            .attr("id", (d) => d.wordle_id)
                            .attr("x", (d,i) => x1(parseTime(d[xKey1])))
                            .attr("y", (d) => yScale2(d[yKey2]))
                            .attr("width", 15)
                            .attr("height", (d) => (height - margin.bottom) - yScale2(d[yKey2]))
                            .style("opacity", 1)
                            .style("fill", function(d){ // TODO: make gradient in each bar
                              if (d[yKey2] <= 4.413630118) {
                                return 'black' // TODO: change to Wordle blue
                              } else if (d[yKey2] >= 4.432132964 && d[yKey2] < 5.510370517) {
                                return '#787c7e'
                              } else if (d[yKey2] >= 5.53633218 && d[yKey2] < 6.218866798) {
                                return '#cab558'
                              } else {
                                return '#6aaa64'
                              }})
                            .on("mouseover", mouseover) 
                            .on("mousemove", mousemove)
                            .on("mouseleave", mouseleave);

}



})
