let updateAnnotation = function(word) {
  
  d3.csv("data/composite_wordle_data.csv").then((data) => {
  let wordObject = data.filter(function(d) { 
    return d["word"].localeCompare(word) == 0 })[0];

  let annotation = d3.select("#annotationBox");

  let displayAnnotation = "";
  displayAnnotation += ("Date: " + wordObject.date);
  displayAnnotation += ("<br>Word: " + wordObject.word);
  displayAnnotation += ("<br>Part of Speech: " + wordObject.part_of_speech);
  displayAnnotation += ("<br>Definition: " + wordObject.definition);
  displayAnnotation += ("<br>Rarity: " + wordObject.rarity);
  displayAnnotation += ("<br>Average Number of Tries: " + wordObject.avg_num_of_tries);
  // displayAnnotation += ("<br>% wins in 2: " + Math.ceil(wordObject.wins_in_2/wordObject.number_of_players * 1000) / 10 + "%");
  // displayAnnotation += ("<br>% wins in 3: " + Math.ceil(wordObject.wins_in_3/wordObject.number_of_players * 1000) / 10 + "%");
  // displayAnnotation += ("<br>% wins in 4: " + Math.ceil(wordObject.wins_in_4/wordObject.number_of_players * 1000) / 10 + "%");
  // displayAnnotation += ("<br>% wins in 5: " + Math.ceil(wordObject.wins_in_5/wordObject.number_of_players * 1000) / 10 + "%");
  // displayAnnotation += ("<br>% wins in 6: " + Math.ceil(wordObject.wins_in_6/wordObject.number_of_players * 1000) / 10 + "%");
  
  annotation.html(displayAnnotation)
    .style("opacity", 1);
  })
};
