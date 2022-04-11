d3.csv("data/composite_wordle_data.csv").then((data) => {
    {
        // Append svg object to the body of the page to house linechart1
        const svg = d3.select("#line-chart")
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
    
        // to make sure there is an offset with the tooltip
        const yTooltipOffset1 = 15; 
    
        // Adds a tooltip with the information
        let tooltip1 = d3.select("#line-chart") 
                        .append("div") 
                        .attr('id', "tooltip") 
                        .style("opacity", 0) 
                        .attr("class", "tooltip");
    
        // Mouseover event handler
        let mouseover = function(event, d) {
        let rarity = "word_rarity"
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
                                  .attr("r", 1)
                                  .style("opacity", 1)
                                  .on("mouseover", mouseover) 
                                  .on("mousemove", mousemove)
                                  .on("mouseleave", mouseleave);
    
        // adding a line's curve to the line chart
        let line = d3.line()
                      .x((d) => x1(parseTime(d[xKey1]))) 
                      .y((d) => y1(d[yKey1])) 
                      .curve(d3.curveMonotoneX)
        
        svg.append("path")
        .datum(data) 
        .attr("class", "line") 
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#000000")
        .style("stroke-width", "2");
      }
})