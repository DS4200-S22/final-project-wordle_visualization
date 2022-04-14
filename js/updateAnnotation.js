let updateAnnotation = function(word, dataRow) {
  let wordObject = d3.select(["[class^='word_", word].join(""))
  let annotation = d3.select("#annotationBox");

  let displayAnnotation = "";
  displayAnnotation += ("Word: " + word);
  displayAnnotation += ("<br>Part of Speech: " + dataRow.part_of_speech);
  annotation.html(displayAnnotation)
    .style("opacity", 1);
};
