updateAnnotation = function(word) {
  
  d3.csv("data/composite_wordle_data.csv").then((data) => {
  let wordObject = data.filter(function(d) { 
    return d["word"].localeCompare(word) == 0 })[0];

  let annotation = d3.select("#annotation");

  let displayAnnotation = "";
  displayAnnotation += ("Date: " + wordObject.date);
  displayAnnotation += ("<br>Word: " + wordObject.word);
  displayAnnotation += ("<br>Part of Speech: " + wordObject.part_of_speech);
  displayAnnotation += ("<br>Definition: " + wordObject.definition);
  displayAnnotation += ("<br>Rarity: " + wordObject.rarity);
  displayAnnotation += ("<br>Average Number of Tries: " + wordObject.avg_num_of_tries);
  
  annotation.html(displayAnnotation)
    .style("opacity", 1);
  })
};
