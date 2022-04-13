d3.csv("data/composite_wordle_data.csv").then((data) => {
        // Append svg object to the body of the page to house linechart1
        svg = d3.select("#line-chart")
          .append("svg")
          .attr("class", "charts")
          .attr("width", width - margin.left - margin.right)
          .attr("height", height - margin.top - margin.bottom)
          .attr("viewBox", [0, 0, width, height]); 
    
        // initializing the x and y axes keys
        xKey1 = "date";
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
                          .text(xKey1));
        
        // TODO: get rid of hard coding                  
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
    
        // Add points
        myPoints = svg.selectAll("circle")
                        .data(data)
                        .enter()
                        .append("circle")
                        .attr("class", "select")
                        .attr("id", (d) => d.wordle_id)
                        .attr("cx", (d) => x1(parseTime(d[xKey1])))
                        .attr("cy", (d) => y1(d[yKey1]))
                        .attr("r", 10)
                        .attr("color", "black")
                        .style("opacity", 1);

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

                // Finds coordinates of brushed region 
                let selection = d3.brushSelection(this);
        
                // Gives bold outline to all points within the brush region in Scatterplot1
                myPoints.classed("selected", function(d) {
                        return isBrushed(selection, d[xKey1], d[yKey1])
                })
        }

        //Finds dots within the brushed region
        function isBrushed(brush_coords, cx, cy) {
                if (brush_coords === null) return;
        
                var x0 = brush_coords[0][0],
                x1 = brush_coords[1][0],
                y0 = brush_coords[0][1],
                y1 = brush_coords[1][1];
                return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1; // This return TRUE or FALSE depending on if the points is in the selected area
        }
})