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
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.gson.Gson;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.ArrayList;
import com.google.cloud.language.v1.Document;
import com.google.cloud.language.v1.LanguageServiceClient;
import com.google.cloud.language.v1.Sentiment;
import com.google.cloud.translate.Translate;
import com.google.cloud.translate.TranslateOptions;
import com.google.cloud.translate.Translation;
import javax.cache.Cache;
import javax.cache.CacheException;
import javax.cache.CacheFactory;
import javax.cache.CacheManager;
import javax.cache.CacheStatistics;
import java.util.Collections;
import java.util.List;

/** Servlet that returns comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {
  Cache cache;
  DatastoreService datastore;
  Translate translate;
  LanguageServiceClient languageService;


  //Constructor
  public DataServlet () throws IOException {
    //Init Datastore
    datastore = DatastoreServiceFactory.getDatastoreService();

    //Init cache
    try {
      CacheFactory cacheFactory = CacheManager.getInstance().getCacheFactory();
      cache = cacheFactory.createCache(Collections.emptyMap());
    } catch (CacheException e) {
      System.out.println("Cache error");
      return;
    }

    cacheComments();

    //Init Translation
    translate = TranslateOptions.getDefaultInstance().getService();

    //Init Natural language
    languageService = LanguageServiceClient.create();
  }

  /**
   * Retrieves comments from datastore, adds to array, and serves as JSON 
   */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    //Retrieves query parameters
    int numComments = Integer.parseInt(getParameter(request, "comments", "5"));
    String language = getParameter(request, "language", "EN");

    //Retrieve array of comments
    ArrayList<Comment> comments;
    if (cache.containsKey("comments")){
      comments = (ArrayList<Comment>) cache.get("comments");
    } else {
      comments = cacheComments();
    }

    //Take number of comments asked for
    List<Comment> commentList;
    if (numComments < comments.size()) {
      commentList = comments.subList(0, numComments);
    }
    else {
      commentList = comments;
    }

    //Translate array if necessary
    if(!language.equals("EN")){
      translateComments(commentList, language);
    }

    //Converts comments to JSON and sets response
    String json = this.convertToJson(commentList);
    response.setContentType("application/json; charset=UTF-8");
    response.getWriter().println(json);
  }

  /**
   * Stores comment in datastore
   */
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Get the input from the form.
    String name = getParameter(request, "name", "Anonymous");
    String body = getParameter(request, "body", "");

    if (!body.isEmpty()){
      //Retrieves comment Sentiment score
      float sentimentScore = calculateSentimentScore(body);

      //Creates entity for comment
      Entity commentEntity = new Entity("Comment");
      commentEntity.setProperty("name", name);
      commentEntity.setProperty("body", body);
      commentEntity.setProperty("posted", new Date());
      commentEntity.setProperty("votes", 0);
      commentEntity.setProperty("score", sentimentScore);

      //Stores comment in datastore
      datastore.put(commentEntity);

      //Create comment object
      Date posted = (Date) commentEntity.getProperty("posted");
      long id = commentEntity.getKey().getId();
      Comment comment = new Comment(id, name, body, posted, 0, sentimentScore);

      //Add comment to cache
      ArrayList<Comment> comments;
      if (cache.containsKey("comments")){
        comments = (ArrayList<Comment>) cache.get("comments");
      } else {
        comments = new ArrayList<>();
      }
      comments.add(0, comment);
      cache.put("comments", comments);
    }
   
    //Refreshes page
    response.sendRedirect("/#comments");
  }

  /**
   * Retrieves parameter, returning an alternative if param doesn't exist 
   */
  private String getParameter(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    if (value == null || value.isEmpty()) {
      return defaultValue;
    }
    return sanitiseInput(value);
  }

  /**
   * Sanitises input by replacing < and >
   */
  private String sanitiseInput(String input) {
    String lessThan = input.replaceAll("<", "&lt;");
    return lessThan.replaceAll("<", "&gt;");
  }

  /**
   * Converts comments to JSON using Gson 
   */
  private String convertToJson(List<Comment> comments) {
    Gson gson = new Gson();
    String json = gson.toJson(comments);
    return json;
  }

  /**
   * Calculates sentiment score using Natural Language API
   */
  private float calculateSentimentScore(String message) throws IOException { //make float when working
    Document doc =
      Document.newBuilder().setContent(message).setType(Document.Type.PLAIN_TEXT).build();
    Sentiment sentiment = languageService.analyzeSentiment(doc).getDocumentSentiment();
    float score = sentiment.getScore();
    return score;
  }

  /**
   * Translates comment body to chosen language 
   */
  private String translateBody(String body, String languageCode) {
    Translation translation =
        translate.translate(body, Translate.TranslateOption.targetLanguage(languageCode));
    String translatedText = translation.getTranslatedText();
    return translatedText;
  }

  /**
   * Translates arraylist of comments
   */
  private void translateComments(List<Comment> comments, String languageCode) {
    for(Comment comment: comments) {
      String body = translateBody(comment.getBody(), languageCode);
      comment.setBody(body);
    }
  }

  /**
   * Retrieves comments from datastore and caches them
   */
  private ArrayList<Comment> cacheComments () {
    //Queries datastore for comments
    Query query = new Query("Comment").addSort("posted", SortDirection.DESCENDING);
    PreparedQuery results = datastore.prepare(query);

    //Converts result from query into array of comment objects
    ArrayList<Comment> comments = new ArrayList<>();
    for (Entity entity : results.asIterable(FetchOptions.Builder.withLimit(10))) {
      String name = (String) entity.getProperty("name");
      String body = (String) entity.getProperty("body");
      Date posted = (Date) entity.getProperty("posted");
      long votes = (long) entity.getProperty("votes");
      double score = (double) entity.getProperty("score");
      long id = entity.getKey().getId();
      Comment comment = new Comment(id, name, body, posted, votes, score);
      comments.add(comment);
    }

    //Saves array in cache
    cache.put("comments", comments);
    return comments;
  }
}
