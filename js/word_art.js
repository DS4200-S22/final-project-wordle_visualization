let drawWordArt = function(word) {

    d3.select("#word-art").selectAll("*").remove();

    d3.csv("data/composite_wordle_data.csv").then((data) => {
        let wordObject = data.filter(function(d) { 
            return d["word"].localeCompare(word) == 0 
        })[0];

        wordArt = d3
        .select("#word-art")
        .append("svg")
        .append("text")
        .style("font-size", 50)
        .style("fill", '#6aaa64')
        .attr("text-anchor", "middle")
        .style("font-family", "Open Sans")
        .style("font-weight", 900)
    })

    
}