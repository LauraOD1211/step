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

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.gson.Gson;
import com.google.appengine.api.datastore.EntityNotFoundException;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

/** Servlet that returns comments data */
@WebServlet("/vote")
public class VoteServlet extends HttpServlet {
  /**
   * Updates comments with up/downvotes
   */

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException{
    // Get the input from the form.
    long id = Long.parseLong(request.getParameter("id"));
    long newVote =  Long.parseLong(request.getParameter("votes"));
    Key key = KeyFactory.createKey("Comment", id);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    try{
      Entity comment = datastore.get(key);
      long currVotes = (long) comment.getProperty("votes");
      comment.setProperty("votes", currVotes+newVote);
      datastore.put(comment);
      response.setContentType("application/json;");
      response.getWriter().println("{\"message\":\"success\"}"); 
    } catch (EntityNotFoundException e) {
      System.out.println("Entity not found");
      response.setContentType("application/json;");
      response.getWriter().println("{\"message\":\"Not found\"}"); 
    } 
  }
}