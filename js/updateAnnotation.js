// This updates the annotation with statistics for the given word
updateAnnotation = function(word) {
  
  d3.csv("data/composite_wordle_data.csv").then((data) => {
  let wordObject = data.filter(function(d) { 
    return d["word"].localeCompare(word) == 0 })[0];

  let annotation = d3.select("#annotationBox");

  let displayAnnotation = "";
  displayAnnotation += (`Word: <b>${wordObject.word}</b>`);
  displayAnnotation += ("<br>Date: " + wordObject.date);
  displayAnnotation += ("<br>Part of Speech: " + wordObject.part_of_speech);
  displayAnnotation += ("<br>Definition: " + wordObject.definition);
  displayAnnotation += ("<br>Commonness (out of 5): " + wordObject.rarity);
  annotation.html(displayAnnotation)
    .style("opacity", 1);
  })
};
