let activeWord;
let rarity = false;
d3.csv("data/composite_wordle_data.csv").then((data) => {
    {
        const height = 800 - margin.top - margin.bottom;

        // Create an array of sizes based off number of tries
        num_tries = data.map(function(d) {return d.avg_num_of_tries});
        let min_tries = d3.min(num_tries);
        let max_tries = d3.max(num_tries);
        let tries_size_scale = d3.scaleSqrt()
          .domain([min_tries, max_tries])
          .range([15, 100]);
        tries_sizes = num_tries.map(function(d) {
          return Math.ceil(tries_size_scale(d) / 10) * 10;
        });
    
        // Create an array of JSON for the word and the size
        // according to rarity or performance
        let words = [];
        for(let i = 0; i < data.length; i++) {
            let current_size = rarity ? data[i].rarity * 20 : tries_sizes[i];
            words.push({
              word: data[i].word,
              size: current_size});
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
          d3.selectAll(".bar_"+activeWord)
          .transition().style('outline','solid')
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
        .transition().style('outline','none')
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
            .attr("class", (d) => "word_" + d.text)
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