let drawBarChart = function (rarity, bar_chart_svg) {
  // true = rarity, false = performance
  let legendSvg = d3.select("#legend");
  legendSvg.selectAll("*").remove();
  let keys;

  if (rarity) {
    keys = ["Common Word", "Somewhat Common Word","Rare Word"];
  } else {
    keys = ["Good Performance", "Ok Performance", "Bad Performance"];
  }
  legendSvg.append("text").attr("x", 0).attr("y", 15).text("Color Legend").style("font-size", "25px").attr("alignment-baseline","middle");
  legendSvg.append("rect").attr("x",0).attr("y",35).attr("width", 10).attr("height", 10).style("fill", "#6aaa64");
  legendSvg.append("rect").attr("x",0).attr("y",55).attr("width", 10).attr("height", 10).style("fill", "#cab558");
  legendSvg.append("rect").attr("x",0).attr("y",75).attr("width", 10).attr("height", 10).style("fill", "black");
  legendSvg.append("text").attr("x",15).attr("y", 40).text(keys[0]).style("font-size", "15px").attr("alignment-baseline","middle").attr("fill","#6aaa64");
  legendSvg.append("text").attr("x",15).attr("y", 60).text(keys[1]).style("font-size", "15px").attr("alignment-baseline","middle").attr("fill","#cab558");
  legendSvg.append("text").attr("x",15).attr("y", 80).text(keys[2]).style("font-size", "15px").attr("alignment-baseline","middle").attr("fill","black");


  d3.csv("data/composite_wordle_data.csv").then((data) => {
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const height = 400;
    const width = 525;

  

    // initializing the x and y axes keys
    xKey2 = "date";
    if (rarity) {
      yKey2 = "word_rarity";
    } else {
      yKey2 = "avg_num_of_tries";
    }

    // Find max x
    let parseTime = d3.timeParse("%m/%d/%Y");
    let maxX2 = d3.max(data, (d) => {
      return parseTime(d[xKey2]);
    });
    let minX2 = d3.min(data, (d) => {
      return parseTime(d[xKey2]);
    });

    // Create X scale
    let xScale2 = d3
      .scaleLinear()
      .domain([minX2, maxX2])
      .range([margin.left, width - margin.right]);

    // Add x axis
    bar_chart_svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale2).tickFormat(d3.timeFormat("%m/%d")))
      .attr("font-size", "10px")
      .call((g) =>
        g
          .append("text")
          .attr("x", width - margin.right)
          .attr("y", margin.bottom - 4)
          .attr("fill", "black")
          .attr("text-anchor", "end")
          .text(xKey2)
      );

    // TODO: get rid of hard coding
    // finding maxY

    if (rarity) {
      maxY2 = 4.6;
      minY2 = 0.2;
    } else {
      maxY2 = 5.0;
      minY2 = 3.5;
    }

    // Create Y scale
    let yScale2 = d3
      .scaleLinear()
      .domain([minY2, maxY2])
      .range([height - margin.bottom, margin.top]);

    // Add y axis with correct labels

    let correct_label = rarity ? "Rarity" : "Attempts";

    // Append the correct y scale and label
    bar_chart_svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale2))
      .attr("font-size", "10px")
      .call((g) =>
        g.append("text")
        .attr("x", 0)
        .attr("y", margin.top - 20)
        .attr("fill", "black")
        .attr("text-anchor", "end")
        .text(correct_label));

    const yTooltipOffset = 15;

    // Adds a tooltip with the information
    let tooltip = d3
      .select("#bar-chart")
      .append("div")
      .attr("id", "tooltip3")
      .style("opacity", 0)
      .attr("class", "tooltip");

    // Mouseover event handler
    let mouseover = function (event, d) {
      activeWord = d["word"];
      if (rarity) {
        tooltip
        .html(
          "Date: " +
            d[xKey2] +
            "<br> Rarity: " +
            d["word_rarity"] +
            "<br> Part of Speech: " +
            d["part_of_speech"])
        .style("opacity", 1);
        } else {
          tooltip
          .html(
            "Date: " +
              d[xKey2] +
              "<br> Average Number of Tries: " +
              d["avg_num_of_tries"])
          .style("opacity", 1);
        }

      d3.selectAll(".word_" + activeWord)
        .transition()
        .style("text-shadow", "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000");

      updateAnnotationFor(activeWord);
    };

    // Mouse moving event handler
    let mousemove = function (event) {
      tooltip
        .style("left", event.pageX + "px")
        .style("top", event.pageY + yTooltipOffset + "px");
    };

    // Mouseout event handler
    let mouseleave = function () {
      tooltip.style("opacity", 0);
      d3.selectAll(".word_" + activeWord)
        .transition()
        .style("text-shadow", "none");
    };

    // Add points
    let myRects = bar_chart_svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", (d) => "bar_" + d["word"])
      .attr("x", (d, i) => xScale2(parseTime(d[xKey1])))
      .attr("y", (d) => yScale2(d[yKey2]))
      .attr("width", 10)
      .attr("height", (d) => height - margin.bottom - yScale2(d[yKey2]))
      .style("opacity", 1)
      .style("fill", function (d) {
        if (!rarity) {
          if (d[yKey2] < 4.0) {
            return "#6aaa64";
          } else if (d[yKey2] >= 4.0 && d[yKey2] < 4.5) {
            return "#cab558";
          } else {
            return "black";
          }
        } else {
          if (d[yKey2] < 1.5) {
            return "#6aaa64";
          } else if (d[yKey2] >= 1.5 && d[yKey2] < 2.75) {
            return "#cab558";
          } else {
            return "black";
          }
        }
      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  });
};
