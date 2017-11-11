const yargs = require('yargs');
const axios = require('axios');
const fs = require('fs');

const services = require('./extra-features/services.js');

const argv = yargs
.options({
  a: {
    demand: false,
    alias: 'address',
    describe: 'Address to fetch weather for',
    string: true
  },
  d: {
    demand: false,
    alias: 'default',
    describe: 'Show the default location',
    boolean: true
  },
  sd: {
    demand: false,
    alias: 'setdefault',
    describe: 'Set a default location',
    boolean: true
  }
})
.help()
.alias('help', 'h')
.argv;

if (argv.default) {
  try {

    var location = services.getDefaultLocation();

    console.log(location.address);

    var weatherUrl = `https://api.darksky.net/forecast/ae7f0513dd99ec226c1e6d981bf2697a/${location.latitude},${location.longitude}?units=si`;

    axios.get(weatherUrl).then((response) => {
      var temperature = response.data.currently.temperature;
      var apparentTemperature = response.data.currently.apparentTemperature;
      var weatherType = response.data.currently.precipType;

      console.log(`${weatherType} | Temperature: ${temperature} | Apparent Temperature: ${apparentTemperature} |`);

    }).catch((e) => {
      if (e === 'ENOTFOUND'){
        console.log('Unable to connect to API servers.');
      } else {
        console.log(e.message)
      }
    });
  } catch (e) {
    console.log('There is no default location');
  }
} else if (argv.address) {
  var encodedAddress = encodeURIComponent(argv.address);
  var geocodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

  axios.get(geocodeUrl).then((response) => {
    if (response.data.status === 'ZERO_RESULTS'){
      throw new Error('Unable to find that address')
    }

    var formatted_address = response.data.results[0].formatted_address;
    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    var weatherUrl = `https://api.darksky.net/forecast/ae7f0513dd99ec226c1e6d981bf2697a/${lat},${lng}?units=si`;

    console.log(formatted_address);

    if (argv.setdefault & response.data.status === 'OK') {

      console.log('Setting default location...');

      services.saveLocation(lat, lng, formatted_address);

    }

    return axios.get(weatherUrl);
  }).then((response) => {
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;

    console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`);
  }).catch((e) => {
    if (e === 'ENOTFOUND'){
      console.log('Unable to connect to API servers.');
    } else {
      console.log(e.message)
    }
  });
}
