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

import java.io.Serializable;
import com.google.appengine.api.datastore.Key;
import java.util.Date;
import com.google.appengine.api.datastore.Entity;
/**
 * Object for holding Comment info 
 */
public class Comment implements Serializable {
  private String name;
  private String body;
  private Date posted;
  private long votes;
  private long id;
  private double score;

  /**
   * Builder for existing comments
   */
  public Comment(long id, String name, String body, Date posted, long votes, double score) {
    this.posted = posted;
    this.name = name;
    this.body = body;
    this.votes = votes;
    this.id = id;
    this.score = score;
  }

  public void setBody (String body) {
    this.body = body;
  }

  public String getBody () {
    return body;
  }

  public long getID () {
    return id;
  }

  public String getName () {
    return name;
  }
  public long getVotes () {
    return votes;
  }
  public Date getPosted () {
    return posted;
  }
  public double getScore () {
    return score;
  }

  public void changeVotes (long votes) {
    this.votes += votes;
  }
}