let drawBarChart = function (rarity, bar_chart_svg) {
  // true = rarity, false = performance

  
  let legendSvg = d3.select("#legend");
  legendSvg.selectAll("*").remove();
  let barKeys;

  if (rarity) {
    barKeys = ["Rare Word", "Somewhat Common Word", "Common Word"];
  } else {
    barKeys = ["Good Performance", "Ok Performance", "Bad Performance"];
  }
  legendSvg
    .append("text")
    .attr("x", 0)
    .attr("y", 15)
    .text("Color Legend")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .attr("alignment-baseline", "middle");
  legendSvg
    .append("rect")
    .attr("x", 0)
    .attr("y", 35)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "#6aaa64");
  legendSvg
    .append("rect")
    .attr("x", 0)
    .attr("y", 65)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "#cab558");
  legendSvg
    .append("rect")
    .attr("x", 0)
    .attr("y", 95)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "black");
  legendSvg
    .append("text")
    .attr("x", 25)
    .attr("y", 40)
    .text(barKeys[0])
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .attr("fill", "#6aaa64");
  legendSvg
    .append("text")
    .attr("x", 25)
    .attr("y", 70)
    .text(barKeys[1])
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .attr("fill", "#cab558");
  legendSvg
    .append("text")
    .attr("x", 25)
    .attr("y", 100)
    .text(barKeys[2])
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .attr("fill", "black");

  // Load the data from the local csv file
  d3.csv("data/composite_wordle_data.csv").then((data) => {
    const margin = { top: 80, right: 50, bottom: 50, left: 50 };
    const height = 550;
    const width = 525;

    // initializing the x and y axes keys
    xKey2 = "date";
    if (rarity) {
      yKey2 = "rarity";
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

    let maxY2;
    let minY2;

    // Determine which column to get the min and max of
    if (rarity) {
      // added padding to make sure max and min show up
      maxY2 =
        d3.max(data, function (d) {
          return +d[yKey2];
        }) + 0.2;
      minY2 =
        d3.min(data, function (d) {
          return +d[yKey2];
        }) - 0.1;
    } else {
      maxY2 =
        d3.max(data, function (d) {
          return +d[yKey2];
        }) + 0.2;
      minY2 =
        d3.min(data, function (d) {
          return +d[yKey2];
        }) + 3.2;
    }

    // Create Y scale
    let yScale2 = d3
      .scaleLinear()
      .domain([minY2, maxY2])
      .range([height - margin.bottom, margin.top]);

    // Add y axis with correct labels

    let correct_label = rarity ? "Frequency" : "Attempts";

    // Append the correct y scale and label
    bar_chart_svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale2))
      .attr("font-size", "10px")
      .call((g) =>
        g
          .append("text")
          .attr("x", 0)
          .attr("y", margin.top - 20)
          .attr("fill", "black")
          .attr("text-anchor", "end")
          .text(correct_label)
      );

    // Mouseover event handler
    let mouseover = function (event, d) {
      activeWord = d["word"];

      d3.select("#word_" + activeWord)
        .transition()
        .style(
          "text-shadow",
          "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000"
        );

      d3.select("#bar_" + activeWord)
        .transition()
        .style("outline", "0.5px solid black");

      updateAnnotation(activeWord);
      updatePieChart(activeWord);
    };

    // Mouseout event handler
    let mouseleave = function () {
      d3.select("#word_" + activeWord)
        .transition()
        .style("text-shadow", "none");

      d3.select("#bar_" + activeWord)
        .transition()
        .style("outline", "none");
    };

    // Add points
    let myRects = bar_chart_svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("id", (d) => "bar_" + d["word"])
      .attr("x", (d, i) => xScale2(parseTime(d[xKey1])))
      .attr("y", (d) => yScale2(d[yKey2]))
      .attr("width", 4)
      .attr("height", function (d) {
        let barHeight = height - margin.bottom - yScale2(d[yKey2]);
        if (barHeight > 0) {
          return barHeight;
        } else {
          return 0;
        }
      })
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
      .on("mouseleave", mouseleave);
  });
};
