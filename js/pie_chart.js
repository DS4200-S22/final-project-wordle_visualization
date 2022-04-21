let updatePieChart = function(word) {

    d3.csv("data/composite_wordle_data.csv").then((data) => {
        const width = 350,
        height = 300,
        margin = 70;
        const radius = Math.min(width, height) / 2 - margin;

        let pieChart = d3.select("#pie-chart");
        pieChart.selectAll("*").remove();
        pieChart = d3
            .select("#pie-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("id", "pie-chart")
            .append("g")
            .attr("transform", `translate(${width / 3}, ${height / 2})`);
        
        let wordObject = data.filter(function(d) { 
            return d["word"].localeCompare(word) == 0 
        })[0];
        const pieData = {in2: wordObject.wins_in_2, 
            in3: wordObject.wins_in_3,
            in4: wordObject.wins_in_4,
            in5: wordObject.wins_in_5,
            in6: wordObject.wins_in_6};

        const color = d3.scaleOrdinal()
                        .range(["#6aaa64",
                        "#90bf89",
                        "#b5d4af",
                        "#daead7",
                        "#ffffff"]);

        const pie = d3.pie().value(function(d) {
            return d[1];
        }).sort(null);
        const data_ready = pie(Object.entries(pieData));

        const arcGenerator = d3.arc().innerRadius(50).outerRadius(radius);

        pieChart
        .selectAll('slices')
        .data(data_ready)
        .join('path')
        .attr('d', arcGenerator)
        .attr('fill', function (d) {
            return color(d.data[0]);
          })
        .attr("stroke", "black")
        .style("stroke-width", "0.5px")
        .style("opacity", 1.0);


        pieChart
        .selectAll("slices")
        .data(data_ready)
        .join("text")
        .attr("dy", "0em")
        .text(function (d) {
            return (d.index + 2) + " guesses:";
        })
        .attr("transform", function (d) {
            let c = arcGenerator.centroid(d);
            let x = c[0];
            let y = c[1];
            let h = Math.sqrt(x * x + y * y);
            let labelr = radius + 20;
            return "translate(" + (x / h) * labelr + "," + (y / h) * labelr + ")";
        })
        .style("text-anchor", "middle")
        .style("font-size", 9);

        pieChart
        .selectAll("slices")
        .data(data_ready)
        .join("text")
        .attr("dy", "1em")
        .text(function (d) {
            return Math.floor((d.data[1] / wordObject.number_of_players) * 100) + "%";
        })
        .attr("transform", function (d) {
            let c = arcGenerator.centroid(d);
            let x = c[0];
            let y = c[1];
            let h = Math.sqrt(x * x + y * y);
            let labelr = radius + 20;
            return "translate(" + (x / h) * labelr + "," + (y / h) * labelr + ")";
        })
        .style("text-anchor", "middle")
        .style("font-size", 9);

        pieChart
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0em")
        .text("Average:");

        pieChart
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1em")
        .text(wordObject.avg_num_of_tries);
    })
}