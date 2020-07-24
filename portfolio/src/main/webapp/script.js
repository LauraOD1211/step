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
      out += '<div class=\'comment unvoted\' id="' + comments[i].id + '"><h3>' + 
      comments[i].name + '</h3><p>' + comments[i].body + '</p>' + 
      '<button onclick="updateVotes(\'' + comments[i].id + '\', \'up\')">Upvote</button>' +
      '<p>' + comments[i].votes + '</p>' +
      '<button onclick="updateVotes(\'' + comments[i].id + '\', \'down\')">Downvote</button>' +
      '</div>';
    }
    document.getElementById('comment-section').innerHTML = out;
  });
}

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
 * Updates and displays votes
 */
function updateVotes (id, vote) {
  switch (vote) {
    case "up":
      console.log('upvote init');
      if (document.getElementById(id).classList.contains("unvoted")) {
        upvote(id);
        document.getElementById(id).classList.replace("unvoted", "upvoted");
      } else if (document.getElementById(id).classList.contains("upvoted")) {
        downvote(id);
      } else if (document.getElementById(id).classList.contains("downvoted")) {
        upvote(id);
        upvote(id);
        document.getElementById(id).classList.replace("unvoted", "upvoted");  
      }
      break;
    case "down":
      console.log('Downvote init')
      if (document.getElementById(id).classList.contains("unvoted")) {
        downvote(id);
        document.getElementById(id).classList.replace("unvoted", "downvoted");
      } else if (document.getElementById(id).classList.contains("downvoted")) {
        upvote(id);
      } else if (document.getElementById(id).classList.contains("upvoted")) {
        downvote(id);
        downvote(id);
        document.getElementById(id).classList.replace("unvoted", "downvoted");  
      }
      break;
    default:
      console.log('Default');
  }
}

/**
 * Updates datastore to reflect upvotes
 */
function upvote (id) {
  console.log('upvote called');
  const request = new Request('/vote?id='+id+'&votes=up', {method: 'POST'});
  fetch(request).then(response => response.json()).then((res) => {
    if (res.message=='success'){
      console.log('success');
      displayComments();
    }
  });
}

/**
 * Updates datastore to reflect downvotes
 */
function downvote (id) {
  console.log('downvote called');
  const request = new Request('/vote?id='+id+'&votes=down', {method: 'POST'});
  fetch(request).then(response => response.json()).then((res) => {
    if (res.message=='success'){
      console.log('success');
      displayComments();
    }
  });
}