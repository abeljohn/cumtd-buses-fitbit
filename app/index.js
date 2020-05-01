import * as messaging from "messaging";
import { BusUI } from "./ui.js";

import { display } from "display";

import document from "document";

import { me } from "appbit";
me.appTimeoutEnabled = false;

let ui = new BusUI();
let refReady = false;
let buttons = document.getElementById("buttons");
buttons.style.display = "none";
ui.updateUI("disconnected");
let station = "";
let updateFn = function() {
  messaging.peerSocket.send("update" + station);
  ui.updateUI("loading");
  buttons.style.display = "none";
}
let button1 = document.getElementById("button-1").getElementById("mybutton");
button1.onactivate = function(evt) {
  station = "1";
  updateFn();
}
let button2 = document.getElementById("button-2").getElementById("mybutton");
button2.onactivate = function(evt) {
  station = "2";
  updateFn();
}
let button3 = document.getElementById("button-3").getElementById("mybutton");
button3.onactivate = function(evt) {
  station = "3";
  updateFn();
}
let button4 = document.getElementById("button-4").getElementById("mybutton");
button4.onactivate = function(evt) {
  station = "4";
  updateFn();
}
let button5 = document.getElementById("button-5").getElementById("mybutton");
button5.onactivate = function(evt) {
  station = "5";
  updateFn();
}
let button6 = document.getElementById("button-6").getElementById("mybutton");
button6.onactivate = function(evt) {
  station = "6";
  updateFn();
}
let button7 = document.getElementById("button-7").getElementById("mybutton");
button7.onactivate = function(evt) {
  station = "7";
  updateFn();
}
let button8 = document.getElementById("button-8").getElementById("mybutton");
button8.onactivate = function(evt) {
  station = "8";
  updateFn();
}
let button9 = document.getElementById("button-9").getElementById("mybutton");
button9.onactivate = function(evt) {
  station = "9";
  updateFn();
}
// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  ui.updateUI("loading");
  messaging.peerSocket.send("Hi!");
}

display.onchange = (evt) => {
  if (refReady && display.on) {
    ui.updateUI("refresh");
    messaging.peerSocket.send("update" + station);
  }
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  let datas = evt.data;
  refReady = false;
  try {
    if (datas.length < 1)
      throw "empty";
    for (let i = 0; i < 9; i++) {
      if (datas[i]) {
        document.getElementById(`button-${i+1}`).text = datas[i].name.slice(0,Math.min(datas[i].name.length, 16));
        document.getElementById(`button-${i+1}`).style.display = "inline";
      } else
        document.getElementById(`button-${i+1}`).style.display = "none";
    }
    buttons.style.display = "inline";
  } catch(e) {
    buttons.style.display = "none";
    ui.updateUI("loaded", evt.data);
    refReady = true;
  }
  display.poke();
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  ui.updateUI("error");
}