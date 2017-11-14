const yargs = require('yargs');

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

  services.showDefaultLocation();

} else if (argv.address) {

  services.showWeather(argv.address, argv.setdefault);

} else {

  services.getCurrentLocation();

}
