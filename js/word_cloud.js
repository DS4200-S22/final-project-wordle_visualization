let drawWordCloud = function(rarity, word_cloud_svg) {

  let legendSvg = d3.select("#cloud-legend");
  legendSvg.selectAll("*").remove();
  let keys;

  if (rarity) {
    keys = ["Rare Word", "Somewhat Common Word","Common Word"];
  } else {
    keys = ["Good Performance", "Ok Performance", "Bad Performance"];
  }
  legendSvg.append("text").attr("x", 0).attr("y", 15).text("Word Cloud Size Legend").style("font-size", "25px").attr("alignment-baseline","middle");
  legendSvg.append("text").attr("x", 0).attr("y", 40).text("Small = " + keys[0]).style("font-size", "15px").attr("alignment-baseline","middle");
  legendSvg.append("text").attr("x", 0).attr("y", 60).text("Medium = " + keys[1]).style("font-size", "15px").attr("alignment-baseline","middle");
  legendSvg.append("text").attr("x", 0).attr("y", 80).text("Large = " + keys[2]).style("font-size", "15px").attr("alignment-baseline","middle");


  let activeWord;
  d3.csv("data/composite_wordle_data.csv").then((data) => {
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const height = 500;
    const width = 500;

    // Create an array of sizes based off number of tries
    num_tries = data.map(function(d) {return d.avg_num_of_tries});
    let min_tries = d3.min(num_tries);
    let max_tries = d3.max(num_tries);
    let tries_size_scale = d3.scaleSqrt()
      .domain([min_tries, max_tries])
      .range([15, 90]);
    tries_sizes = num_tries.map(function(d) {
      return Math.ceil(tries_size_scale(d) / 10) * 10;
    });

    // Create an array of JSON for the word and the size
    // according to rarity or performance
    let words = [];
    for(let i = 0; i < data.length; i++) {
      let current_size = rarity ? data[i].rarity * 10 : tries_sizes[i];
      words.push({
        word: data[i].word,
        size: current_size});
    }

    const yTooltipOffset = 15; 

    // Adds a tooltip with the information
    let tooltip = d3.select("#word-cloud") 
                    .append("div") 
                    .attr('id', "tooltip3") 
                    .style("opacity", 0) 
                    .attr("class", "tooltip");

    // Mouseover event handler
    let mouseover = function(event, d) {
      activeWord = d.text

      if (rarity) {
        tooltip.html("Rarity: " + d["rarity"])
          .style("opacity", 1);
      } else {
        tooltip.html(
          "<br> Average Number of Tries: " + d["avg_num_of_tries"]
        + "<br> % Wins in 2 tries: " + d["wins_in_2"]/d["number_of_players"])
          .style("opacity", 1);
      }

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


    let layout = d3.layout.cloud()
      .size([width,height])
      .words(words.map(function(d) { return {text: d.word, size:d.size}; }))
      .padding(12)
      .rotate(function() { return 0;})
      .fontSize(function(d) { return d.size; })
      .on("end", draw);

    layout.start();

    function draw(words) {
      word_cloud_svg.append("g")
        .attr("transform", "translate(" + (layout.size()[0] / 2 - 100) + "," + (layout.size()[1] / 2 - 75) + ")")
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
        .style("font-weight", 900)
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) {return d.text})
        .on("mouseover", mouseover) 
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    }
  });
};