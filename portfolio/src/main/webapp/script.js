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
      out += '<div class=\'comment\'><h3>' + comments[i].name +
      '</h3><p>' + comments[i].body + '</p></div>';
    }
    document.getElementById('comment-section').innerHTML = out;
  });
}

function deleteComments () {
  const request = new Request('/delete-data', {method: 'POST'});
  fetch(request).then((response) => {
    document.getElementById('comment-section').classList.add('empty');
    displayComments();
  });
}