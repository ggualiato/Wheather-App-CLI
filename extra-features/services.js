const fs = require('fs');

var geocodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=`;
var weatherUrl = `https://api.darksky.net/forecast/ae7f0513dd99ec226c1e6d981bf2697a/`;

var getDefaultLocation = () => {
  var defaultString = fs.readFileSync('weather-data.json');
  var location = JSON.parse(defaultString);

  return location;
}

var saveLocation = (lat, lng, formatted_address) => {
  var location = {
    latitude: lat,
    longitude: lng,
    address: formatted_address
  }

  fs.writeFileSync('weather-data.json', JSON.stringify(location));
}

module.exports = {
  getDefaultLocation,
  saveLocation
};
