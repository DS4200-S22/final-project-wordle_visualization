// //This is filler -- delete it and start coding your visualization tool here
// d3.select("#vis-container")
//   .append("text")
//   .attr("x", 20)
//   .attr("y", 20)
//   .text("Hello World!");

// Set margins and dimensions 
const margin = { top: 50, right: 50, bottom: 50, left: 200 };
const width = 900 - margin.left - margin.right;
const height = 650 - margin.top - margin.bottom;

/*
Line chart (chart 1) set up and initialization
*/ 
// Append svg object to the body of the page to house linechart1
const svg1 = d3.select("#vis-holder")
                .append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]); 

// Initialize brush for linechart1 and points. So that they are global. 
let myLine1; 

// Define color scale
// const color = d3.scaleOrdinal()
//                 .domain(["setosa", "versicolor", "virginica"])
//                 .range(["#FF7F50", "#21908dff", "#fde725ff"]);

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
    let maxX1 = d3.max(data, (d) => { return d[xKey1]; });

    // Create X scale
    x1 = d3.scaleLinear()
                .domain([0,maxX1])
                .range([margin.left, width-margin.right]); 
    
    // Add x axis 
    svg1.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`) 
        .call(d3.axisBottom(x1))   
        .attr("font-size", '20px')
        .call((g) => g.append("text")
                      .attr("x", width - margin.right)
                      .attr("y", margin.bottom - 4)
                      .attr("fill", "black")
                      .attr("text-anchor", "end")
                      .text(xKey1)
      );

    // Finx max y 
    maxY1 = d3.max(data, (d) => { return d[yKey1]; });

    // Create Y scale
    y1 = d3.scaleLinear()
                .domain([0, maxY1])
                .range([height - margin.bottom, margin.top]); 

    // Add y axis 
    svg1.append("g")
        .attr("transform", `translate(${margin.left}, 0)`) 
        .call(d3.axisLeft(y1)) 
        .attr("font-size", '20px') 
        .call((g) => g.append("text")
                      .attr("x", 0)
                      .attr("y", margin.top)
                      .attr("fill", "black")
                      .attr("text-anchor", "end")
                      .text(yKey1)
      );

    // Add points
    myLine1 = svg1.selectAll("circle")
                            .data(data)
                            .enter()
                              .append("circle")
                              .attr("id", (d) => d.id)
                              .attr("cx", (d) => x1(d[xKey1]))
                              .attr("cy", (d) => y1(d[yKey1]))
                              .attr("r", 8)
                              .style("fill", (d) => color(d.Species))
                              .style("opacity", 0.5);
}
}
)
