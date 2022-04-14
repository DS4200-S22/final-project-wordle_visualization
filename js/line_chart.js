let startDate = "1/15/2022"
let endDate = "2/28/2022"

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
        yKey2 = "wins_in_1";
        yKey3 = "wins_in_2";
        yKey4 = "wins_in_3";
        yKey5 = "wins_in_4";
        yKey6 = "wins_in_5";
        yKey7 = "wins_in_6";
    
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
                          .text("Number of Players"));
    
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

        // List of groups = header of the csv files
        let keys = data.columns.slice(14)
        console.log(keys);

        // color palette
        // let color = d3.scaleOrdinal()
        //                 .domain(keys)
        //                 .range(['#6aaa64','#88bb82','#a6cca0','#c4ddbf','#e1eedf','#ffffff'])

        //stack the data
        let stackedData = d3.stack().keys(keys)(data)

        // Add the area
        svg.append("path")
                .datum(stackedData)
                .enter()
                .style("fill", "#a6cca0")
                .attr("fill-opacity", 1)
                .attr("g", d3.area()
                        .x(function(d) { return x1(parseTime(d[xKey1])) })
                        .y0(function(d) {0})
                        .y1(function(d) { return y1(d[yKey1]) }))
                .attr("stroke", "black");

        // Add points
        myPoints = svg.selectAll("circle")
                        .data(data)
                        .enter()
                        .append("circle")
                        .attr("id", (d) => d.wordle_id)
                        .attr("cx", (d) => x1(parseTime(d[xKey1])))
                        .attr("cy", (d) => y1(d[yKey1]))
                        .attr("r", 10)
                        .style("fill", "black")
                        .style("opacity", 0.40)
                        .on("mouseover", mouseover) 
                        .on("mousemove", mousemove)
                        .on("mouseleave", mouseleave);
    
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
                                console.log(searchBarQuery.join(""));
                                d3.selectAll(searchBarQuery.join(""))
                                .style("opacity", 1.0);

                                let searchCloudQuery = ["[class^='word_", d[wordKey], "']"];
                                console.log(searchCloudQuery.join(""));
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