var activeWord;
d3.csv("data/composite_wordle_data.csv").then((data) => {
    {
        const height = 1000 - margin.top - margin.bottom;
        let words = []
    
        for(let i = 0; i < data.length; i++) {
            words.push({
              // id: data[i].wordle_id,
              word: data[i].word,
              size: data[i].rarity * 20});
        }

        const yTooltipOffset = 15; 

        // Adds a tooltip with the information
        let tooltip = d3.select("#word-cloud") 
                        .append("div3") 
                        .attr('id', "tooltip3") 
                        .style("opacity", 0) 
                        .attr("class", "tooltip");

        // Mouseover event handler
        let mouseover = function(event, d) {
          activeWord = d.text
          tooltip.html("Word: " + activeWord)
                  .style("opacity", 1);
          d3.selectAll("."+activeWord)
          .transition().style('opacity',function () {
            return (this === activeWord) ? 1.0 : 0.0;
        });
        };

        // Mouse moving event handler
        let mousemove = function(event) {
        tooltip.style("left", (event.pageX)+"px") 
                .style("top", (event.pageY + yTooltipOffset) +"px");
        };

        // Mouseout event handler
        let mouseleave = function() { 
        tooltip.style("opacity", 0);
        d3.selectAll(".bar_"+activeWord)
          .style('opacity', 1)
        };

    
        // append the svg object to the page
        let svg = d3.select("#word-cloud")
            .append("svg")
            .attr("width", width - margin.left - margin.right)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .append("g")
            .attr("transform",
                  `translate(${margin.left},${margin.top})`);
    
        let layout = d3.layout.cloud()
            .size([width,height])
            .words(words.map(function(d) { return {text: d.word, size:d.size}; }))
            .padding(10)
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
            .attr("class", (d) =>  d.word)
            .style("font-size", (d) => d.size)
            .style("fill", function(d,i){ 
              if (data[i].rarity == 1) {
                return '#000000'; 
              } else if (data[i].rarity == 2) {
                return '#cab558';
              } else {
                return '#6aaa64';
              }
            })
            .attr("text-anchor", "middle")
            .style("font-family", "Open Sans")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) {return d.text})
            .on("mouseover", mouseover) 
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
        }
      }
})