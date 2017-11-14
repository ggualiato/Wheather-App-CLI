const fs = require('fs');
const axios = require('axios');

var geocodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=`;
var weatherUrl = `https://api.darksky.net/forecast/ae7f0513dd99ec226c1e6d981bf2697a/`;
var ipApiUrl = 'http://ip-api.com/json';

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

var showDefaultLocation = () => {
  try {

    var location = getDefaultLocation();

    var url = `${weatherUrl}${location.latitude},${location.longitude}?units=si`;

    console.log(location.address);

    axios.get(url).then((response) => {
      var temperature = response.data.currently.temperature;
      var apparentTemperature = response.data.currently.apparentTemperature;

      console.log(`Temperature: ${temperature} | Apparent Temperature: ${apparentTemperature} |`);

    }).catch((e) => {
      if (e === 'ENOTFOUND'){
        console.log('Unable to connect to API servers.');
      } else {
        console.log(e.message);
      }
    });
  } catch (e) {
    console.log('There is no default location');
  }
}

var showWeather = (address, setdefault) => {
  var encodedAddress = encodeURIComponent(address);
  var url = `${geocodeUrl}${encodedAddress}`;

  axios.get(url).then((response) => {
    if (response.data.status === 'ZERO_RESULTS'){
      throw new Error('Unable to find that address')
    }

    var formatted_address = response.data.results[0].formatted_address;
    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    var url = `${weatherUrl}${lat},${lng}?units=si`;

    console.log(formatted_address);

    if (setdefault && response.data.status === 'OK') {

      console.log('Setting default location...');

      saveLocation(lat, lng, formatted_address);
    }

    return axios.get(url);

  }).then((response) => {
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;

    console.log(`Temperature: ${temperature} | Apparent Temperature: ${apparentTemperature} |`);

  }).catch((e) => {
    if (e === 'ENOTFOUND'){
      console.log('Unable to connect to API servers.');
    } else {
      console.log(e.message);
    }
  });
}

var getCurrentLocation = () => {
  axios.get(ipApiUrl).then((response) => {
    var lat = response.data.lat;
    var lng = response.data.lon;
    var url = `${weatherUrl}${lat},${lng}?units=si`;

    return axios.get(url);

  }).then((response) => {
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;

    console.log('Currenty Location');
    console.log(`Temperature: ${temperature} | Apparent Temperature: ${apparentTemperature} |`);
  }).catch((e) => {
    if (e === 'ENOTFOUND') {
      console.log('Unable to connect to API servers.');
    } else {
      console.log(e.message);
    }
  });
}

module.exports = {
  getDefaultLocation,
  saveLocation,
  showDefaultLocation,
  showWeather,
  getCurrentLocation
};
