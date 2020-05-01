export function CUMTDAPI(apiKey) {
  if (apiKey !== undefined) {
    this.apiKey = apiKey;
  }
  else {
    /* NOTE: you'll need to provide your own API key */
    this.apiKey = /* go to developer.cumtd.com to register for a key */;
  }
};
CUMTDAPI.prototype.realTimeDepartures = function(origin) {
  let self = this;
  return new Promise(function(resolve, reject) {
    let url = "https://developer.cumtd.com/api/v2.2/json/getdeparturesbystop?pt=60";
    url += "&key=" + self.apiKey;
    url += "&stop_id=" + origin;
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(json) {
      //console.log("Got JSON response from server:" + JSON.stringify(json));
      let data = json["departures"];
      let departures = [];

      data.forEach( (bus) => {
        let route = bus["route"]
        let d = {
          "t": bus["headsign"],
          "m": Number.parseInt(bus["expected_mins"]),
          "b": route["route_color"],
          "f": route["route_text_color"],
          "i": bus["is_istop"]
        }
        if (!Number.isInteger(d["m"])) {
          d["m"] = 0;
        }
        departures.push(d);
      });
      // Sort departures
      departures.sort( (a,b) => { return (a["m"] - b["m"]) } );

      resolve(departures);
    }).catch(function (error) {
      reject(error);
    });
  });
}