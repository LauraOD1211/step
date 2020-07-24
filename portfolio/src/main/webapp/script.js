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

/**
 * Adds a random fact to the page.
 */
function addRandomFact () {
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

  // Pick a random fact.
  const fact = facts[Math.floor(Math.random() * facts.length)];

  // Add it to the page.
  const factContainer = document.getElementById('fact-container');
  factContainer.innerText = fact;
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
  fetch("/data?comments="+numComments).then(response => response.json()).then((comments) => {
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
  /*switch (vote) {
    //User upvotes
    case "up":
      if (commentMap.get(id)=="unvoted") { //not upvoted before, so upvote
        commentMap.set(id, "upvoted");
        numVotes = 1;
      } else if (commentMap.get(id)=="upvoted") { //already upvoted, so unvote
        commentMap.set(id, "unvoted");
        numVotes = -1;
      } else if (commentMap.get(id)=="downvoted") { //downvoted, so undownvote (+1) then upvote(+1)
        commentMap.set(id, "upvoted"); 
        numVotes = 2; 
      }
      break;
    //user downvotes
    case "down":
      if (commentMap.get(id)=="unvoted") {
        commentMap.set(id, "downvoted");
        numVotes =  -1;
      } else if (commentMap.get(id)=="downvoted") {
        commentMap.set(id, "unvoted");
        numVotes = 1;
      } else if (commentMap.get(id)=="upvoted") {
        commentMap.set(id, "downvoted"); 
        numVotes = -2;
      }
      break;
  }*/
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