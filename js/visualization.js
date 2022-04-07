/*
Margin set up with width and height
*/
// Set margins and dimensions 
const margin = { top: 50, right: 50, bottom: 50, left: 200 };
const width = 1250 - margin.left - margin.right;
const height = 650 - margin.top - margin.bottom;

// Initialize brush for linechart1 and points. So that they are global. 
let myLine1; 

// Define color scale
// const color = d3.scaleOrdinal()
//                 .domain(["setosa", "versicolor", "virginica"])
//                 .range(["#FF7F50", "#21908dff", "#fde725ff"]);

d3.csv("data/composite_wordle_data.csv").then((data) => {
  
  console.table(data);
  
  // So that the scales for all of the following charts are global
  let x1, y1;  

  // So that the keys are global
  let xKey1, yKey1, xKey5, yKey5;
  
  let words = []

  for(let i = 0; i < data.length; i++) {
      words.push({
        word: data[i].word,
        size: data[i].rarity * 10});
  }

  /*
  Line chart plotting
  */
  {
    // Append svg object to the body of the page to house linechart1
    const svg = d3.select("#vis1-container")
      .append("svg")
      .attr("class", "charts")
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .attr("viewBox", [0, 0, width, height]); 

    // initializing the x and y axes keys
    xKey1 = "date";
    yKey1 = "number_of_players";

    // Find max and min x
    var parseTime = d3.timeParse("%m/%d/%Y");
    let maxX1 = d3.max(data, (d) => { return parseTime(d[xKey1]); });
    let minX1 = d3.min(data, (d) => { return parseTime(d[xKey1]); });

    // Create X scale
    x1 = d3.scaleLinear()
            .domain([minX1,maxX1])
            .range([margin.left, width-margin.right]);
        
    // Add x axis 
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`) 
        .call(d3.axisBottom(x1)   
          .tickFormat(d3.timeFormat("%m/%d")))
        .attr("font-size", '20px')
        .call((g) => g.append("text")
                      .attr("x", width - margin.right)
                      .attr("y", margin.bottom - 4)
                      .attr("fill", "black")
                      .attr("text-anchor", "end")
                      .text(xKey1));

    // Finx max y (hardcoded for now but tried to work on the function)
    // var maxY1 = d3.max(data, (d) => { return d.number_of_players; });
    // var minY1 = d3.min(data, function(d){ return d.number_of_players; });
    maxY1 = 18000;
    minY1 = 0;

    // Create Y scale
    y1 = d3.scaleLinear()
            .domain([minY1, maxY1])
            .range([height - margin.bottom, margin.top]);

    // Add y axis 
    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`) 
        .call(d3.axisLeft(y1)) 
        .attr("font-size", '20px') 
        .call((g) => g.append("text")
                      .attr("x", 0)
                      .attr("y", margin.top - 20)
                      .attr("fill", "black")
                      .attr("text-anchor", "end")
                      .text(yKey1));

    // to make sure there is an offset with the tooltip
    const yTooltipOffset1 = 15; 

    // Adds a tooltip with the information
    let tooltip1 = d3.select("#vis1-container") 
                    .append("div") 
                    .attr('id', "tooltip") 
                    .style("opacity", 0) 
                    .attr("class", "tooltip");

    // Mouseover event handler
    let mouseover = function(event, d) {
    tooltip1.html("Date: " + d[xKey1] + "<br> Number of Players: " + d[yKey1] + "<br>")
            .style("opacity", 1);
    };

    // Mouse moving event handler
    let mousemove = function(event) {
    tooltip1.style("left", (event.pageX)+"px") 
            .style("top", (event.pageY + yTooltipOffset1) +"px");
    };

    // Mouseout event handler
    let mouseleave = function() { 
    tooltip1.style("opacity", 0);
    };

    // Add points
    myLine1 = svg.selectAll("circle")
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

    // adding a line's curve to the line chart
    var line = d3.line()
                  .x((d) => x1(parseTime(d[xKey1]))) 
                  .y((d) => y1(d[yKey1])) 
                  .curve(d3.curveMonotoneX)
    
    svg.append("path")
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
    // attach a new svg canvas to the respective div
    const svg = d3.select("#vis4-container")
                .append("svg")
                .attr("class", "charts")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]); 

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
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`) 
        .call(d3.axisBottom(xScale2)   
          .tickFormat(d3.timeFormat("%m/%d")))
        .attr("font-size", '20px')
        .call((g) => g.append("text")
                      .attr("x", width - margin.right)
                      .attr("y", margin.bottom - 4)
                      .attr("fill", "black")
                      .attr("text-anchor", "end")
                      .text(xKey2));

    // Finx max y 
    // var maxY1 = d3.max(data, (d) => { return d.number_of_players; });
    // var minY1 = d3.min(data, function(d){ return d.number_of_players; });
    // ext = d3.extent(data, (d) => {return d[yKey1]});
    // console.log("key1:" + ext);
    // console.log(maxY1);
    // console.log(minY1);
    maxY2 = 8.5;
    minY2 = 4.0;

    // Create Y scale
    let yScale2 = d3.scaleLinear()
                .domain([minY2, maxY2])
                .range([height - margin.bottom, margin.top]);

    // Add y axis 
    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`) 
        .call(d3.axisLeft(yScale2)) 
        .attr("font-size", '20px') 
        .call((g) => g.append("text")
                      .attr("x", 0)
                      .attr("y", margin.top - 20)
                      .attr("fill", "black")
                      .attr("text-anchor", "end")
                      .text("Performance"));

    const yTooltipOffset = 15; 

    // Adds a tooltip with the information
    let tooltip = d3.select("#vis4-container") 
                    .append("div3") 
                    .attr('id', "tooltip3") 
                    .style("opacity", 0) 
                    .attr("class", "tooltip");

    // Mouseover event handler
    let mouseover = function(event, d) {
    tooltip.html("Date: " + d[xKey2] + "<br> Performance: " + d[yKey2] + "<br>")
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
    let myLine2 = svg.selectAll(".bar")
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
                              .style("fill", function(d){ 
                                if (d[yKey2] <= 4.413630118) {
                                  return 'black' 
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

  /* WORD CLOUD */
  {

    let words = []

    for(let i = 0; i < data.length; i++) {
        words.push({
          word: data[i].word,
          size: data[i].rarity * 10});
    }

    // Dimensions and Margins of the graph
    let margin = {top: 10, right: 10, bottom: 10, left: 10};
    let width = 600 - margin.left - margin.right;
    let height = 600 - margin.top - margin.bottom;
    
    // append the svg object to the page
    let svg = d3.select("#vis3-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              `translate(${margin.left},${margin.top})`);

    let layout = d3.layout.cloud()
        .size([width,height])
        .words(words.map(function(d) { return {text: d.word, size:d.size}; }))
        .padding(5)
        .rotate(function() { return 0;})
        .fontSize(function(d) { return d.size; })
        .on("end", draw);

    layout.start();

    function draw(words) {
      svg.append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) {return d.size;})
        .style("fill", "#69b3a2")
        .attr("text-anchor", "middle")
        .style("font-family", "Open Sans")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) {return d.text});
    }
  }

  /* STACKED BAR CHART */
  {
  // initializing the x and y axes keys
  xKey5 = "date";
  yKey5 = "performance";

  // Find max x
  var parseTime = d3.timeParse("%m/%d/%Y");
  let maxX5 = d3.max(data, (d) => { return parseTime(d[xKey5]); });
  let minX5 = d3.min(data, (d) => { return parseTime(d[xKey5]); });

  // Create X scale
  let xScale5 = d3.scaleLinear()
          .domain([minX5,maxX5])
          .range([margin.left, width-margin.right]);
      
  // Add x axis 
  svg5.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`) 
      .call(d3.axisBottom(xScale5)   
        .tickFormat(d3.timeFormat("%m/%d")))
      .attr("font-size", '20px')
      .call((g) => g.append("text")
                    .attr("x", width - margin.right)
                    .attr("y", margin.bottom - 4)
                    .attr("fill", "black")
                    .attr("text-anchor", "end")
                    .text(xKey5));

  // Finx max y 
  maxY5 = 8.5;
  minY5 = 4.0;

  // Create Y scale
  let yScale5 = d3.scaleLinear()
              .domain([minY5, maxY5])
              .range([height - margin.bottom, margin.top]);

  // Add y axis 
  svg5.append("g")
      .attr("transform", `translate(${margin.left}, 0)`) 
      .call(d3.axisLeft(yScale5)) 
      .attr("font-size", '20px') 
      .call((g) => g.append("text")
                    .attr("x", 0)
                    .attr("y", margin.top - 20)
                    .attr("fill", "black")
                    .attr("text-anchor", "end")
                    .text("Performance"));
  
  // to make sure there is an offset with the tooltip
  const yTooltipOffset5 = 15; 

  // Adds a tooltip with the information
  let tooltip5 = d3.select("#vis5-container") 
                  .append("div") 
                  .attr('id', "tooltip") 
                  .style("opacity", 0) 
                  .attr("class", "tooltip");

  // Mouseover event handler
  let mouseover = function(event, d) {
  tooltip5.html("Date: " + d[xKey5] + "<br> Performance: " + d[yKey5] + "<br>")
          .style("opacity", 1);
  };

  // Mouse moving event handler
  let mousemove = function(event) {
  tooltip5.style("left", (event.pageX)+"px") 
          .style("top", (event.pageY + yTooltipOffset5) +"px");
  };

  // Mouseout event handler
  let mouseleave = function() { 
  tooltip5.style("opacity", 0);
  };

  // Create x scale
  let barWidth = d3.scaleBand()
            .domain(d3.range(data.length))
            .range([margin.left, width - margin.right])
            .padding(0.1); 

  // Add points
  let myLine2 = svg5.selectAll(".bar")
                          .data(data)
                          .enter()
                            .append("rect")
                            .attr("class", "bar")
                            .attr("id", (d) => d.wordle_id)
                            .attr("x", (d,i) => x1(parseTime(d[xKey1])))
                            .attr("y", (d) => yScale5(d[yKey5]))
                            .attr("width", 15)
                            .attr("height", (d) => (height - margin.bottom) - yScale5(d[yKey5]))
                            .style("opacity", 1)
                            .style("fill", function(d){ 
                              if (d[yKey5] <= 4.413630118) {
                                return 'black' 
                              } else if (d[yKey5] >= 4.432132964 && d[yKey5] < 5.510370517) {
                                return '#787c7e'
                              } else if (d[yKey5] >= 5.53633218 && d[yKey5] < 6.218866798) {
                                return '#cab558'
                              } else {
                                return '#6aaa64'
                              }})
                            .on("mouseover", mouseover) 
                            .on("mousemove", mousemove)
                            .on("mouseleave", mouseleave);
  }
});