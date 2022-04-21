d3.csv("data/composite_wordle_data.csv").then((data) => {
        const height = 300;

        // Append svg object to the body of the page to house linechart1
        svg = d3.select("#line-chart")
          .append("svg")
          .attr("class", "charts")
          .attr("width", width - margin.left - margin.right)
          .attr("height", height - margin.top - margin.bottom)
          .attr("viewBox", [0, 0, width, height]); 
    
        // initializing the x and y axes keys
        xKey1 = "date";
        wordKey = "word";
        yKey1 = "number_of_players";

        // Find max and min x
        let parseTime = d3.timeParse("%m/%d/%Y");
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
                          .text("Date"));
                      
        maxY1 = 2302 + // added padding to make sure max shows up, and making max a nice number (18000)
                d3.max(data, function (d) {
                  return +d[yKey1];
                });
        minY1 = d3.min(data, function (d) {
                  return +d[yKey1];
                });
        
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
                          .text("Number of Players"));
        
        // Add points
        myPoints = svg.selectAll("circle")
                        .data(data)
                        .enter()
                        .append("circle")
                        .attr("id", (d) => d.wordle_id)
                        .attr("cx", (d) => x1(parseTime(d[xKey1])))
                        .attr("cy", (d) => y1(d[yKey1]))
                        .attr("r", 5)
                        .style("fill", "black")
                        .style("opacity", 0.40);
            
        // Add new york times acquisition
        if ((d) => d.wordle_id == 226){
                d = data[16];
                yVal = d[yKey1];
                xVal = d[xKey1];

                console.log(d[yKey1]);
                console.log("here it is");
                myAcPoint = svg.selectAll("circles")
                                .data(data)
                                .enter()
                                .append("circle")
                                .attr("id", (d) => d.wordle_id)
                                .attr("cx", x1(parseTime(xVal)))
                                .attr("cy", y1(yVal))
                                .attr("r", 7)
                                .style("stroke", "red")
                                .style("opacity", 1);
        }

        // adding a line's curve to the line chart
        line = d3.line()
                .x((d) => x1(parseTime(d[xKey1]))) 
                .y((d) => y1(d[yKey1])) 
                .curve(d3.curveMonotoneX)
        
        // Create a line chart
        svg.append("path")
                .datum(data) 
                .attr("class", "line") 
                .attr("d", line)
                .style("fill", "none")
                .style("stroke", "#000000")
                .style("stroke-width", "2");

        // Initialize brush for linechart.
        let brush; 
        brush = d3.brush().extent([[0, 0], [width, height]]);

        // Add brush1 to svg1
        svg.call(brush
                .on("start", clear)
                .on("brush", updateChart));

        // Call to removes existing brushes 
        function clear() {
                svg.call(brush.move, null);
        }

        // Call when Scatterplot1 is brushed 
        function updateChart(brushEvent) {

                let extent = brushEvent.selection;
                d3.selectAll("[class^='bar_")
                .style("opacity", 0.25);

                d3.selectAll("[class^='word_")
                .style("opacity", 0.25);

                // Gives bold outline to all points within the brush region in Scatterplot1
                myPoints.classed("selected", function(d) {
                        
                        if (isBrushed(extent, x1(parseTime(d[xKey1])), y1(d[yKey1]))) {
                                let searchBarQuery = ["[class^='bar_", d[wordKey], "']"];
                                // console.log(searchBarQuery.join(""));
                                d3.selectAll(searchBarQuery.join(""))
                                .style("opacity", 1.0);

                                let searchCloudQuery = ["[class^='word_", d[wordKey], "']"];
                                // console.log(searchCloudQuery.join(""));
                                d3.selectAll(searchCloudQuery.join(""))
                                .style("opacity", 1.0);
                                return true
                        }
                })
        }

        //Finds dots within the brushed region
        function isBrushed(brush_coords, cx, cy) {
                if (brush_coords === null) return;
        
                let x0 = brush_coords[0][0],
                x1 = brush_coords[1][0],
                y0 = brush_coords[0][1],
                y1 = brush_coords[1][1];
                startDate = x0;
                endDate = x1;
                return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1; // This return TRUE or FALSE depending on if the points is in the selected area
        }

        
})