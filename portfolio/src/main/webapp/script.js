// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const facts =
    ['I am from Donegal in Ireland',
      'I can speak English, Irish, French and a little Swedish',
      'I love archery, and I am a member of my college\'s archery club',
      'I am a system admin for my college\'s computer society',
      'I have two sisters, one older and one younger',
      'I grew up on a farm, with cows and sheep',
      'I am teaching myself Swedish in my free time',
      'I am a Scorpio, born in the year of the rabbit',
      'I am terrible at coming up with facts',
      'My name comes from Latin, and means "victory"'
    ];

var transFacts = facts;

/**
 * Adds a random fact to the page.
 */
function addRandomFact () {
  // Pick a random fact.
  const fact = transFacts[Math.floor(Math.random() * transFacts.length)];

  // Add it to the page.
  const factContainer = document.getElementById('fact-container');
  factContainer.innerHTML = fact;
}

/**
 * Displays text when hovered over.
 */
function showText (id) {
  const text = document.getElementById(id);
  if (text.classList.contains('hide')) {
    text.classList.replace('hide', 'show');
  }
}

/**
 * Hides text when not hovered over.
 */
function hideText (id) {
  const text = document.getElementById(id);
  if (text.classList.contains('show')) {
    text.classList.replace('show', 'hide');
  }
}

//Map for comments and votes
let commentMap = new Map();

/**
 * Displays all comments
 */
function displayComments () {
  const numComments = document.getElementById('numComments').value;
  const language = document.getElementById('language').value;
  document.getElementById('comment-section').innerHTML = "<p>Loading...</p>";
  fetch("/data?comments="+numComments+"&language="+language).then(response => response.json()).then((comments) => {
    var out = '';
    for (var i = 0; i < comments.length; i++) {
      if (document.getElementById('comment-section').classList.contains('empty')) {
        document.getElementById('comment-section').classList.remove('empty');
      }
      if(!commentMap.has(comments[i].id)){
        commentMap.set(comments[i].id, 'unvoted');
      }
      out += '<div class=\'comment ' + commentMap.get(comments[i].id) + '\' id="' + comments[i].id + '">' +
      '<h4>' + comments[i].name + '</h4>' + 
      '<p>' + comments[i].body + '</p>' + 
      '<div class="votes">' + 
      '<i class="material-icons md-24 up">' + getSentimentIcon(comments[i].score) + '</i>' +
      '<i class="material-icons md-24 up" onclick="updateVotes(' + comments[i].id + ', \'up\')">north</i>' +
      '<span>' + comments[i].votes + '</span>' +
      '<i class="material-icons md-24 down" onclick="updateVotes(' + comments[i].id + ', \'down\')">south</i>' +
      '</div>' +
      '</div>';  
    }
    document.getElementById('comment-section').innerHTML = out;
  });
}

/**
 * Removes all comments if correct password entered
 */
function deleteComments () {
  var pass = prompt("Enter admin password to continue:", "");  
  if(pass != null) {
    const request = new Request('/delete-data?pass='+pass, {method: 'POST'});
    fetch(request).then(response => response.json()).then((res) => {
      if (res.message=='success'){
        document.getElementById('comment-section').classList.add('empty');
        displayComments();
      } else if (res.message=="incorrect") {
        alert("Access denied");
      }
    });
  }
}

/**
 * Updates votes - checks the current state of the buttons (in case already 
 * up/downvoted) and which button user pressed, and updates accordingly
 * -If user presses same button twice, it undoes the vote
 * -If user presses both buttons, the first pressed button is unpressed, and the second
 *  is pressed
 */
function updateVotes (id, vote) {
  var numVotes = 0;
  switch (commentMap.get(id)) {
    //not upvoted before
    case "unvoted":
      if (vote == "up") { 
        commentMap.set(id, "upvoted");
        numVotes = 1;
      } 
      else if (vote == "down") {
        commentMap.set(id, "downvoted");
        numVotes =  -1;
      }
      break;
    //already upvoted
    case "upvoted":
      if (vote == "up") { //undoes upvote
        commentMap.set(id, "unvoted");
        numVotes = -1; 
      } else if (vote == "down") { //changes upvote to downvote
        commentMap.set(id, "downvoted"); 
        numVotes = -2;
      }
      break;
    //already downvoted
    case "downvoted":
      if (vote == "up") { //changes downvote to upvote
        commentMap.set(id, "upvoted"); 
        numVotes = 2;
      }  else if (vote == "down") { //undoes downvote
        commentMap.set(id, "unvoted");
        numVotes = 1;
      }
      break;
  }
  recordVote(id, numVotes);
  displayComments();
}

/**
 * Updates datastore to reflect votes
 */
function recordVote (id, votes) {
  const request = new Request('/vote?id='+id+'&votes=' + votes, {method: 'POST'});
  fetch(request).then(response => response.json()).then((res) => {
    if (res.message=='success'){
      displayComments();
    }
  });
}

/**
 * Returns appropriate icon for sentiment
 */
function getSentimentIcon (score) {
  if (score <= -0.6) {
    return "mood_bad";
  }
  else if (score <= -0.2) {
    return "sentiment_very_dissatisfied";
  }
  else if (score <= 0.2) {
    return "sentiment_dissatisfied";
  }
  else if (score <= 0.6) {
    return "sentiment_satisfied";
  }
  else {
      return "sentiment_very_satisfied";
  }
}

/**
 * Takes all text elements of the site and translates them
 */
function translateAll () {
  const language = document.getElementById("pageLanguage").value;  
  if (language == 'EN') {
    location.reload();
  } else {
    var content = document.getElementsByClassName("text");
    var textArray = Array.prototype.map.call(content, (el) => el.innerHTML);
    facts.forEach(function (f) {textArray.push(f)});
    const params = new URLSearchParams();
    params.append('content', JSON.stringify(textArray));
    params.append('language', language);

    fetch('/translate', {method: 'POST', body: params}).then(response => response.json()).then((res) => {
      var i;
      for (i = 0; i < content.length; i++) {
        content[i].innerHTML = res[i];
      }
      transFacts = [];
      for (; i < res.length; i++) {
        transFacts.push(res[i]);
      }
    });
  }
}
