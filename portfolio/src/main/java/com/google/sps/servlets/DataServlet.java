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

/** Servlet that returns comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {
  /**
   * Retrieves comments from datastore, adds to array, and serves as JSON 
   */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    //Retrieves query parameters
    int numComments = Integer.parseInt(getParameter(request, "comments", "5"));
    String language = getParameter(request, "language", "EN");

    //Queries datastore for comments
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Query query = new Query("Comment").addSort("posted", SortDirection.DESCENDING);
    PreparedQuery results = datastore.prepare(query);

    //Converts result from query into array of comment objects
    ArrayList<Comment> comments = new ArrayList<>();
    for (Entity entity : results.asIterable(FetchOptions.Builder.withLimit(numComments))) {
      String name = (String) entity.getProperty("name");
      String body = (String) entity.getProperty("body");
      Date posted = (Date) entity.getProperty("posted");
      long votes = (long) entity.getProperty("votes");
      double score = (double) entity.getProperty("score");
      long id = entity.getKey().getId();

      //Translates comment into selected language
      String translatedBody = translateComment(body, language);

      Comment comment = new Comment(id, name, translatedBody, posted, votes, score);
      comments.add(comment);
    }

    //Converts comments to JSON and sets response
    String json = this.convertToJson(comments);
    response.setContentType("application/json;");
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
      DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
      datastore.put(commentEntity);
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
  private String convertToJson(ArrayList<Comment> comments) {
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
    LanguageServiceClient languageService = LanguageServiceClient.create();
    Sentiment sentiment = languageService.analyzeSentiment(doc).getDocumentSentiment();
    float score = sentiment.getScore();
    languageService.close();
    return score;
  }

    /**
   * Converts comments to JSON using Gson 
   */
  private String translateComment(String body, String languageCode) {
    Translate translate = TranslateOptions.getDefaultInstance().getService();
    Translation translation =
        translate.translate(body, Translate.TranslateOption.targetLanguage(languageCode));
    String translatedText = translation.getTranslatedText();
    return translatedText;
  }
}
