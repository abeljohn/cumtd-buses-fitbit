import { me } from "companion";
import * as messaging from "messaging";
import { settingsStorage } from "settings";

import { CUMTDAPI } from "./cumtd.js"
import { BUS_COUNT, FAVORITE_STOP_SETTING } from "../common/globals.js";

settingsStorage.onchange = function(evt) {
  sendSchedule(0);
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send or receive messages
  sendSchedule(0);
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  // console.log(JSON.stringify(evt.data));
  if (evt.data == "update") {
    sendSchedule(0);
  } else if (evt.data.substring(0,6) == "update") {
    let val = parseInt(evt.data.substring(6));
    if (val != NaN)
      sendSchedule(val);
  }
}
function sendSchedule(num) {
  let station = settingsStorage.getItem(FAVORITE_STOP_SETTING);
  let cumtdApi = new CUMTDAPI();
  if (station) {
    try {
      station = JSON.parse(station);
    }
    catch (e) {
      console.log("error parsing setting value: " + e);
    }
  }
  if (num == 0) {
    if (!station || typeof(station) !== "object" || station.length < 1 || typeof(station[0]) !== "object") {
      station = { code: "IU" };
      cumtdApi.realTimeDepartures(station.code).then(function(departures) {
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          // Limit results to the number of tiles available in firmware
          departures.splice(BUS_COUNT, departures.length);
          messaging.peerSocket.send(departures);
        }
      }).catch(function (e) {
        console.log("error"); console.log(e)
      });
    } else if (station.length > 1) {
      messaging.peerSocket.send(station);
    } else {
      station = station[0].value;
      cumtdApi.realTimeDepartures(station.code).then(function(departures) {
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          // Limit results to the number of tiles available in firmware
          departures.splice(BUS_COUNT, departures.length);
          messaging.peerSocket.send(departures);
        }
      }).catch(function (e) {
        console.log("error"); console.log(e)
      });
    }
  } else {
    if (!station || typeof(station) !== "object" || station.length < num || typeof(station[num-1]) !== "object") {
      sendSchedule(0);
    } else {
      station = station[num-1].value;
      cumtdApi.realTimeDepartures(station.code).then(function(departures) {
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          // Limit results to the number of tiles available in firmware
          departures.splice(BUS_COUNT, departures.length);
          messaging.peerSocket.send(departures);
        }
      }).catch(function (e) {
        console.log("error"); console.log(e)
      });
    }
  }
}