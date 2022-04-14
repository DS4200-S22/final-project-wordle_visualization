/*
Margin set up with width and height
*/
// Set margins and dimensions
const margin = { top: 50, right: 50, bottom: 50, left: 120 };
const width = 1650 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Initialize brush for linechart1 and points. So that they are global.
let myLine1;

// append the svg object to the page
let word_cloud_svg = d3.select("#word-cloud")
    .append("svg")
    .attr("id", "word-cloud-svg")
    .attr("width", width - margin.left - margin.right)
    .attr("height", 600)
    .attr("viewBox", [0, 0, 500, 500])
    .append("g")
    .attr("transform",
          `translate(${margin.left},${margin.top})`);

// attach a new svg canvas to the respective div
let bar_chart_svg = d3.select("#bar-chart")
  .append("svg")
  .attr("class", "charts")
  .attr("id", "bar-chart-svg")
  .attr("width", 500)
  .attr("height", 500)
  .attr("viewBox", [0, 0, 500, 500]);

//draw the word cloud on page load
drawWordCloud(true, word_cloud_svg);
drawBarChart(false, bar_chart_svg);

// Rarity and Attempts Button logic
// let rarity_toggle = function () {
//   console.log("rarity was chosen");
// };

// let attempts_toggle = function () {
//   console.log("attempts was chosen");
// };

d3.selectAll("input").on("change", function (d) {
  d3.select("#word-cloud-svg").selectAll("text").remove();
  d3.select("#word-cloud").selectAll("div").remove();
  d3.select("#bar-chart-svg").selectAll("rect").remove();
  d3.select("#bar-chart-svg").selectAll("g").remove();
  d3.select("#bar-chart").selectAll("div").remove();

  let selection = this.value;
  if (selection === "Rarity") {
    drawWordCloud(true, word_cloud_svg);
    drawBarChart(false, bar_chart_svg); // false = performance
  } else {
    drawWordCloud(false, word_cloud_svg);
    drawBarChart(true, bar_chart_svg); // true = rarity
  }
});

d3.csv("data/composite_wordle_data.csv").then((data) => {
  //////////////////////////////////////////////////////////////////////////
  //////////////////////* STACKED BAR CHART *///////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  {
    // append the svg canvas to the page
    // let svg = d3
    //   .select("#vis5-container")
    //   .append("svg")
    //   .attr("class", "charts")
    //   .attr("width", width - margin.left - margin.right)
    //   .attr("height", height - margin.top - margin.bottom)
    //   .attr("viewBox", [0, 0, width, height]);

    // Parse the Data
    d3.csv("data/bar_gradient_data.csv").then(function (data) {
      // List of subgroups = header of the csv files = soil condition here
      const subgroups = data.columns.slice(1);
      subgroups.slice(7);

      // List of groups = species here = value of the first column called group -> I show them on the X axis
      const groups = data.map((d) => d.date);

      // Add X axis
      const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .text("Date");

      // Add Y axis
      const y = d3.scaleLinear().domain([0, 10]).range([height, 0]);
      svg.append("g").call(d3.axisLeft(y)).text("Performance");

      // TODO: properly map each indivivdual rect to its proper color
      function colorBar(d, i) {
        let averageScore =
          1 * d[i].proportion_for_1 +
          2 * d[i].proportion_for_2 +
          3 * d[i].proportion_for_3 +
          4 * d[i].proportion_for_4 +
          5 * d[i].proportion_for_5 +
          6 * d[i].proportion_for_6;
        if (averageScore <= 23.5) {
          return blackColor(d.key);
        } else if (performance > 23.5 && performance <= 25) {
          return yellowColor(d.key);
        } else {
          return greenColor(d.key);
        }
      }

      // color palettes = one color per subgroup
      const greenColor = d3
        .scaleOrdinal()
        .domain(subgroups)
        .range([
          "#6aaa64",
          "#88bb82",
          "#a6cca0",
          "#c4ddbf",
          "#e1eedf",
          "#ffffff",
        ]);

      const yellowColor = d3
        .scaleOrdinal()
        .domain(subgroups)
        .range([
          "#cab558",
          "#d7c379",
          "#e2d29a",
          "#ede1bb",
          "#f7f0dd",
          "#ffffff",
        ]);

      const blackColor = d3
        .scaleOrdinal()
        .domain(subgroups)
        .range([
          "#000000",
          "#303030",
          "#5e5e5e",
          "#919191",
          "#c6c6c6",
          "#ffffff",
        ]);

      // stack the data per subgroup
      const stackedData = d3.stack().keys(subgroups)(data);

      // Show the bars
      // svg
      //   .append("g")
      //   .selectAll("g")
      //   // Enter in the stack data = loop key per key = group per group
      //   .data(stackedData)
      //   .join("g")
      //   .attr("fill", (d, i) => colorBar(d, i))
      //   .selectAll("rect")
      //   // enter a second time = loop subgroup per subgroup to add all rectangles
      //   .data((d) => d)
      //   .join("rect")
      //   .attr("x", (d) => x(d.data.date))
      //   .attr("y", (d) => y(d[1]))
      //   .attr("height", (d) => y(d[0]) - y(d[1]))
      //   .attr("width", x.bandwidth());
    });
  }
});
