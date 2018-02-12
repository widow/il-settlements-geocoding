'use strict';
var logger = require('winston');
var axios = require('axios');

var GOOGLE_MAPS_API_KEY = '<PUT YOU KEY HERE>'

function getLocation(name){
  name = name.trim();
  axios.get('https://maps.googleapis.com/maps/api/geocode/json?key='+GOOGLE_MAPS_API_KEY+'&address=\''+encodeURIComponent(name)+'\'')
  .then(response => {
    var result = response.data;
    if(result.status === 'ZERO_RESULTS'){
      logger.info('il-cities-geocoding::getLocation() - no results for: ', name);
      return
    }

    // Google API results are here, for example:
    // result.results[0].geometry.location.lng
    // result.results[0].geometry.location.lat

  })
  .catch(error => {
    logger.info('il-cities-geocoding::getLocation() - error:', error.response.data);
  });
}

function start(){
  logger.info('il-cities-geocoding::start()');
  axios.get('https://data.gov.il/api/action/datastore_search?resource_id=a68209f0-8b97-47b1-a242-690fba685c48&limit=2000')
  .then((response) => {
    // logger.info('il-cities-geocoding::start() - gov response: ', response.data.result.records);
    var i =0;
    var cities = response.data.result.records;
    logger.info('il-cities-geocoding::start() - cities.length: ',cities.length);
    for(i=0; i<cities.length; i++){
      // logger.info('il-cities-geocoding::start() - :',cities[i]['שם_ישוב']);
        setTimeout(getLocation.bind(null, cities[i]['שם_ישוב']), i * 110);
    }
  });
}

start();
