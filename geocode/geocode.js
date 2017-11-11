const request = require('request');

var geocodeAddress = (address, callback) => {
  var encodedAddress = encodeURIComponent(address);

  request({
    url: `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
    json: true
  }, (error, response, body) => {
    if (error) {
      callback('Unable to connect to Google servers');
    } else if (body.status === 'ZERO_RESULTS') {
      callback('Unable to find that address')
    } else if (body.status === 'OK') {
      callback(undefined, {
        address: body.results[0].formatted_address,
        latitude: body.results[0].geometry.location.lat,
        longitude: body.results[0].geometry.location.lng
      });
    }
  });
};

module.exports = {
  geocodeAddress
};

//ae7f0513dd99ec226c1e6d981bf2697a

//santo andre
//https://api.darksky.net/forecast/ae7f0513dd99ec226c1e6d981bf2697a/-23.6718689,-46.5066764

//https://api.darksky.net/forecast/ae7f0513dd99ec226c1e6d981bf2697a/39.9350642,-75.1516194
