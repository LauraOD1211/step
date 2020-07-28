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

import com.google.cloud.translate.Translate;
import com.google.cloud.translate.TranslateOptions;
import com.google.cloud.translate.Translation;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import com.google.gson.Gson;
import javax.cache.Cache;
import javax.cache.CacheException;
import javax.cache.CacheFactory;
import javax.cache.CacheManager;
import java.util.Collections;
import java.util.Map;
import java.util.HashMap;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheService.IdentifiableValue;
import com.google.appengine.api.memcache.MemcacheServiceFactory;

@WebServlet("/translate")
public class TranslateServlet extends HttpServlet {

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    //Set up cache
    Cache cache = null;
    try {
      CacheFactory cacheFactory = CacheManager.getInstance().getCacheFactory();
      Map<Object, Object> properties = new HashMap<>();
      properties.put(MemcacheService.SetPolicy.ADD_ONLY_IF_NOT_PRESENT, true);
      cache = cacheFactory.createCache(properties);
    } catch (CacheException e) {
      System.out.println("Cache error");
    } 

    // Get the request parameters.
    String[] textArray = convertFromJson(request.getParameter("content"));
    String language = request.getParameter("language");
    ArrayList<String> translatedText = new ArrayList<>();

    if ( cache.containsKey(language)){
      translatedText = (ArrayList<String>) cache.get(language);
      System.out.println("Retrieved from cache");
    } else {
      // Do the translation.
      Translate translate = TranslateOptions.getDefaultInstance().getService();
      for (String content: textArray) {
        Translation translation =
          translate.translate(content, Translate.TranslateOption.targetLanguage(language));
        translatedText.add(translation.getTranslatedText());
      }
      System.out.println("Generated");
    }

    System.out.println(translatedText);

    //Puts result in cache
    cache.put(language, translatedText);

    // Output the translation.
    response.setContentType("application/json; charset=UTF-8");
    response.getWriter().println(convertToJson(translatedText));
  }

  /**
   * Converts JSON string to String array using Gson 
   */
  private String[] convertFromJson(String input) {
    Gson gson = new Gson();
    String[] json = gson.fromJson(input, String[].class);
    return json;
  }

  /**
   * Converts String array to JSON using Gson 
   */
  private String convertToJson(ArrayList<String> stringArray) {
    Gson gson = new Gson();
    String json = gson.toJson(stringArray);
    return json;
  }
}