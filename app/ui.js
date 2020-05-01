import { BUS_COUNT } from "../common/globals.js";
import document from "document";

export function BusUI() {
  this.busList = document.getElementById("busList");
  this.statusText = document.getElementById("status");

  this.tiles = [];
  for (let i = 0; i < BUS_COUNT; i++) {
    let tile = document.getElementById(`bus-${i}`);
    if (tile) {
      this.tiles.push(tile);
    }
  }
}

BusUI.prototype.updateUI = function(state, departures) {
  if (state === "refresh") {
    this.statusText.text = "Refreshing...";
  }
  else if (state === "loaded") {
    this.busList.style.display = "inline";
    this.statusText.text = (departures.length > 0 ? "" : "No departures at this time");
    this.updateDepartureList(departures);
  }
  else {
    this.busList.style.display = "none";

    if (state === "loading") {
      this.statusText.text = "Loading departures ...";
    }
    else if (state === "disconnected") {
      this.statusText.text = "Please check connection to phone and Fitbit App";
    }
    else if (state === "error") {
      this.statusText.text = "Something terrible happened.";
    }
  }
}

BusUI.prototype.updateDepartureList = function(departures) {
  for (let i = 0; i < BUS_COUNT; i++) {
    let tile = this.tiles[i];
    if (!tile) {
      continue;
    }

    const bus = departures[i];
    if (!bus) {
      tile.style.display = "none";
      continue;
    }

    tile.style.display = "inline";
    tile.getElementById("line-background").style.fill = '#' + bus.b;
    tile.getElementById("destination").text = bus.t;
    tile.getElementById("destination").style.fill = '#' + bus.f;
    tile.getElementById("minutes").text = bus.m + (bus.m == 1 ? " minute" : " minutes");
    tile.getElementById("minutes").style.fill = '#' + bus.f;
    if (bus.i) {
      tile.getElementById("istop").style.opacity = 1;
    } else {
      tile.getElementById("istop").style.opacity = 0;
    }
  }
}