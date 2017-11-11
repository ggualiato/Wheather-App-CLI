const request = require('request');

var getWeather = (lat, lng, callback) => {
  request({
    url: `https://api.darksky.net/forecast/ae7f0513dd99ec226c1e6d981bf2697a/${lat},${lng}?units=si`,
    json: true
  }, (error, response, body) => {
    //Maneira nova
    if (!error && response.statusCode === 200) {
      callback(undefined, {
        temperature: body.currently.temperature,
        apparentTemperature: body.currently.apparentTemperature
      });
    } else {
      callback("Unable to fetch weather");
    }
  });
};

module.exports = {
  getWeather
};
