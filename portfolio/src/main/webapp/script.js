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
      'My favourite video game is The Legend of Zelda: Breath of the Wild',
      'My favourite TV show is Erased',
      'I have two sisters, one older and one younger'
    ]

  // Pick a random fact.
  const fact = facts[Math.floor(Math.random() * facts.length)]

  // Add it to the page.
  const factContainer = document.getElementById('fact-container')
  factContainer.innerText = fact
}

/**
 * Displays text when clicked on.
 */
function showText (id) {
  const text = document.getElementById(id);
  if (text.classList.contains('hide')) {
    text.classList.replace('hide', 'show')
  } else {
    text.classList.replace('show', 'hide')
  }
}
