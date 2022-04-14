/*visualization.js
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

function configureToolTip() {
  let wordObject = data.filter(function(d) { 
    return d["word"].localeCompare(activeWord) == 0 })[0];

  if (rarity) {
    tooltip.html("Frequency: " + wordObject.frequency
    + "<br> Word Rarity: " + wordObject.rarity)
      .style("opacity", 1);
  } else {
    tooltip.html(
      "Average Number of Tries: " + wordObject.avg_num_of_tries
    + "<br> % Wins in 2 tries: " + wordObject.wins_in_2
    + "<br> % Wins in 3 tries: " + wordObject.wins_in_3
    + "<br> % Wins in 4 tries: " + wordObject.wins_in_4
    + "<br> % Wins in 5 tries: " + wordObject.wins_in_5
    + "<br> % Wins in 6 tries: " + wordObject.wins_in_6)
      .style("opacity", 1);
  }
}