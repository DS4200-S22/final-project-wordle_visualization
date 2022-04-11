d3.csv("data/composite_wordle_data.csv").then((data) => {
    {
        const height = 1000 - margin.top - margin.bottom;
        
        // attach a new svg canvas to the respective div
        const svg = d3.select("#bar-chart")
                    .append("svg")
                    .attr("class", "charts")
                    .attr("width", width - margin.left - margin.right)
                    .attr("height", 800 - margin.top - margin.bottom)
                    .attr("viewBox", [0, 0, width, height]); 

        // initializing the x and y axes keys
        xKey2 = "date";
        yKey2 = "performance";

        // Find max x
        let parseTime = d3.timeParse("%m/%d/%Y");
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

        // TODO: get rid of hard coding
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
        let tooltip = d3.select("#bar-chart") 
                        .append("div3") 
                        .attr('id', "tooltip3") 
                        .style("opacity", 0) 
                        .attr("class", "tooltip");

        // Mouseover event handler
        let mouseover = function(event, d) {
                activeWord = d["word"]
                tooltip.html("Date: " + d[xKey2] 
                        + "<br> Average Number of Tries: " + d["avg_num_of_tries"] 
                        + "<br> Rarity: " + d["word_rarity"] 
                        + "<br> Part of Speech: " + d["part_of_speech"])
                .style("opacity", 1);

                d3.selectAll(".word_"+activeWord)
                .transition().style('outline','solid');
                
        }

        // Mouse moving event handler
        let mousemove = function(event) {
        tooltip.style("left", (event.pageX)+"px") 
                .style("top", (event.pageY + yTooltipOffset) +"px");
        };

        // Mouseout event handler
        let mouseleave = function() { 
        tooltip.style("opacity", 0);
        d3.selectAll(".word_"+activeWord)
        .transition().style('outline','none');
        };

        // Add points
        let myLine2 = svg.selectAll(".bar")
                        .data(data)
                        .enter()
                        .append("rect")
                        .attr("class", (d) => "bar_" + d["word"])
                        // .attr("id", (d) => d.wordle_id)
                        .attr("x", (d,i) => x1(parseTime(d[xKey1])))
                        .attr("y", (d) => yScale2(d[yKey2]))
                        .attr("width", 28)
                        .attr("height", (d) => (height - margin.bottom) - yScale2(d[yKey2]))
                        .style("opacity", 1)
                        .style("fill", function(d){ 
                            if (d[yKey2] <= 5.510370517) {
                            return 'black'; 
                            } else if (d[yKey2] >= 5.53633218 && d[yKey2] < 6.218866798) {
                            return '#cab558';
                            } else {
                            return '#6aaa64';
                            }})
                        .on("mouseover", mouseover) 
                        .on("mousemove", mousemove)
                        .on("mouseleave", mouseleave);
    }
})