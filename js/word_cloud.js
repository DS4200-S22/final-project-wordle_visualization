let drawWordCloud = function(rarity, word_cloud_svg) {


  // Word cloud legend
  let legendSvg = d3.select("#cloud-legend");
  legendSvg.selectAll("*").remove();
  let cloudKeys;

  if (rarity) {
    cloudKeys = ["Rare Word", "Somewhat Common Word","Common Word"];
  } else {
    cloudKeys = ["Good Performance", "Ok Performance", "Bad Performance"];
  }
  legendSvg.append("text").attr("x", 0).attr("y", 15).text("Word Cloud Size Legend").style("font-size", "20px").style("font-weight", "bold").attr("alignment-baseline","middle");
  legendSvg.append("text").attr("x", 5).attr("y", 40).text("A").style("font-size", "15px").attr("alignment-baseline","middle");
  legendSvg.append("text").attr("x", 3).attr("y", 70).text("A").style("font-size", "20px").attr("alignment-baseline","middle");
  legendSvg.append("text").attr("x", 0).attr("y", 100).text("A").style("font-size", "30px").attr("alignment-baseline","middle");

  legendSvg.append("text").attr("x", 25).attr("y", 40).text(cloudKeys[0]).style("font-size", "15px").attr("alignment-baseline","middle");
  legendSvg.append("text").attr("x", 25).attr("y", 70).text(cloudKeys[1]).style("font-size", "15px").attr("alignment-baseline","middle");
  legendSvg.append("text").attr("x", 25).attr("y", 100).text(cloudKeys[2]).style("font-size", "15px").attr("alignment-baseline","middle");


  // the current hovered word for brushing
  let activeWord;

  // Read the data from the local csv file
  d3.csv("data/composite_wordle_data.csv").then((data) => {

    const height = 350;
    const width = 450;

    // Create an array of sizes based off number of tries
    num_tries = data.map(function(d) {return d.avg_num_of_tries});
    num_tries = num_tries.filter(tries => tries > 0);
    let min_tries = d3.min(num_tries);
    let max_tries = d3.max(num_tries);
    let tries_size_scale = d3.scaleLinear()
      .domain([min_tries, max_tries])
      .range([15, 60]);
    tries_sizes = num_tries.map(function(d) {
      return Math.ceil(tries_size_scale(d) / 10) * 4;
    });

    // Create an array of JSON for the word and the size
    // according to rarity or performance
    let words = [];
    let wordToNum = new Map();
    for(let i = 0; i < data.length; i++) {
      let current_size = rarity ? data[i].rarity * 10 : tries_sizes[i] * 2;
      current_size = current_size < 8 ? 8 : current_size;
      words.push({
        word: data[i].word,
        size: current_size});
      wordToNum.set(data[i].word, i);
    }


    // Mouseover event handler
    let mouseover = function(event, d) {
      activeWord = d.text;
      let wordObject = data.filter(function(d) { 
        return d["word"].localeCompare(activeWord) == 0 })[0];

      d3.selectAll("#bar_"+activeWord)
      .transition().style("outline", "0.5px solid black");

      d3.selectAll("#word_"+activeWord)
      .transition().style("text-shadow", "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000");

      updateAnnotation(d.text);
      updatePieChart(d.text);
    };

    // Mouseout event handler
    let mouseleave = function() { 
      d3.selectAll("#bar_"+activeWord)
      .transition().style('outline','none')
  
      d3.selectAll("#word_"+activeWord)
      .transition().style("text-shadow", "none");
    };  

    // Call the d3 cloud api to get position and size data
    let layout = d3.layout.cloud()
      .size([500,500])
      .words(words.map(function(d) { return {text: d.word, size:d.size}; }))
      .padding(6)
      .rotate(function() { return 0;})
      .fontSize(function(d) { return d.size; })
      .on("end", draw);

    layout.start();

    // Use the cloud api results to draw the words
    function draw(words) {
      word_cloud_svg.append("g")
        .attr("transform", "translate(" + (layout.size()[0] / 2 - 100) + "," + (layout.size()[1] / 2 - 75) + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .attr("id", (d) => "word_" + d.text)
        .style("font-size", (d) => d.size)
        .style("fill", function(d,i){ 
          dataRow = data[wordToNum.get(d.text)];
          if (rarity) {
            // Color by performance
            let avgNumTries = dataRow.avg_num_of_tries;
            if (avgNumTries < 4.0) {
              return "#6aaa64";
            } else if (avgNumTries >= 4.0 && avgNumTries < 4.5) {
              return "#cab558";
            } else {
              return "black";
            }
          } else {
            // Color by rarity
            let wordRarity = dataRow.rarity;
            if (wordRarity < 1.5) {
              return "#6aaa64";
            } else if (wordRarity >= 1.5 && wordRarity < 2.75) {
              return "#cab558";
            } else {
              return "black";
            }
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
        .on("mouseleave", mouseleave);
    }
  });
};

