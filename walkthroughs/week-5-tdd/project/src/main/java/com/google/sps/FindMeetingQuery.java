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

package com.google.sps;

import java.util.Collection;
import java.util.ArrayList;
import java.util.Iterator;

public final class FindMeetingQuery {
  //needs to return a collection of timeranges that suit all attending parties
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    //Step One: go through each event, find out which events request participants are in
    Collection<Event> conflictingEvents = new ArrayList<>();
    for(Event event: events) {
      for(String attendee: request.getAttendees()) {
        if (event.getAttendees().contains(attendee)){
          conflictingEvents.add(event);
          break;
        }
      }
    }
    //Step Two: starting with the whole day, break the time range into smaller ranges each time there is a conflict
    ArrayList<TimeRange> ranges = new ArrayList<>();
    ranges.add(TimeRange.WHOLE_DAY);
    for(Event event: conflictingEvents){
      for(Iterator<TimeRange> iterator = ranges.iterator(); iterator.hasNext();){
        TimeRange timerange = iterator.next();

        if(timerange.contains(event.getWhen())) {
          //Break containing TimeRange into 2 TimeRanges, before and after the conflict, then remove original
          ranges.add(TimeRange.fromStartEnd(timerange.start(), event.getWhen().start(), false)); //new range before event
          ranges.add(TimeRange.fromStartEnd(event.getWhen().end(), timerange.end(), false)); //new range after event
          ranges.remove(timerange);
          break;
        }
        else if(timerange.overlaps(event.getWhen())) {
          if(timerange.start() < event.getWhen().start()) {
            ranges.add(TimeRange.fromStartEnd(timerange.start(), event.getWhen().start(), false));
          }
          else {
            ranges.add(TimeRange.fromStartEnd(event.getWhen().end(), timerange.end(), false));
          }  
          ranges.remove(timerange);
          break;       
        }
        
      }
    }

    for(Iterator<TimeRange> iterator = ranges.iterator(); iterator.hasNext();) {
      TimeRange timerange = iterator.next();
      if (timerange.duration() < request.getDuration()){
        iterator.remove();
      }
      
    }
    return ranges;
  }
}
