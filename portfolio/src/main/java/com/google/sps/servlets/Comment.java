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

package com.google.sps.servlets;

import com.google.appengine.api.datastore.Key;
import java.util.*;
/**
 * Object for holding Comment info 
 */
public class Comment {
  String name;
  String body;
  Date posted;
  long votes;
  long id;

  /**
   * Builder for existing comments
   */
  public Comment(long id, String name, String body, Date posted, long votes) {
    this.posted = posted;
    this.name = name;
    this.body = body;
    this.votes = votes;
    this.id = id;
  }
}