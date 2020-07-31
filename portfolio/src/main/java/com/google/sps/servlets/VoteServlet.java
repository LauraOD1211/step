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
import java.util.ArrayList;
import javax.cache.Cache;
import javax.cache.CacheException;
import javax.cache.CacheFactory;
import javax.cache.CacheManager;
import javax.cache.CacheStatistics;
import java.util.Collections;
import java.util.Map;
import java.util.HashMap;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheService.IdentifiableValue;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import javax.servlet.ServletException;

/** Servlet that returns comments data */
@WebServlet("/vote")
public class VoteServlet extends HttpServlet {

  MemcacheService cache;
  DatastoreService datastore;

  public VoteServlet ()  {
    //Init cache   
    cache = MemcacheServiceFactory.getMemcacheService();

    //Init datastore
    datastore = DatastoreServiceFactory.getDatastoreService();
  }

  /**
   * Updates comments with up/downvotes
   */
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
    // Get the input from the form.
    long id = Long.parseLong(request.getParameter("id"));
    long newVote =  Long.parseLong(request.getParameter("votes"));
    Key key = KeyFactory.createKey("Comment", id);

    for (long delayMs = 1; delayMs < 1000; delayMs *= 2) {
      //Retrieve current cache
      IdentifiableValue oldValue = cache.getIdentifiable("comments");
      
      if (oldValue == null){
        //No comments in cache, just change datastore
        break;
      }
      ArrayList<Comment> comments = (ArrayList<Comment>) cache.get("comments");
 
      //Check if wanted comment is in the cache
      for(Comment comment: comments) {
        if (comment.getID() == id) {
          //If comment found, update and break
          comment.changeVotes(newVote);
          break;
        }
      }
      if (cache.putIfUntouched("comments", oldValue, comments)) {
        // The cache has been successfully updated
        break;
      } else {
        // Something else changed the value since oldValue was retrieved
        // Wait a while before trying again, waiting longer each time
        try {
          Thread.sleep(delayMs);
        } catch (InterruptedException e) {
          throw new ServletException("Error when sleeping", e);
        }
      }
    }
    
    
    //Then update in datastore
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