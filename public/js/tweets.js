$(document).ready(() => {
  'use strict';

  var testData = {
    max: 5,
    data: []
  };

  let map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40, lng: -90},
    zoom: 4,
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
      {
        featureType: 'all',
        stylers: [
          { hue: '#22aaaa' },
        ]
      },
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [
          { visibility: 'off'}
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          { visibility: 'off'}
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
          { color: '#63BDDB' },
          {saturation: 20}
        ]
      }
    ]
  });


  const heatmap = new HeatmapOverlay(map, 
    {
      'radius': .5,
      'maxOpacity': 1, 
      'scaleRadius': true, 
      'useLocalExtrema': false,
      latField: 'lat',
      lngField: 'lng',
      valueField: 'count',
      gradient: {
        '.5': 'blue',
        '.8': 'green',
        '.95': 'red'
      }
    });

  var socket = io();

  socket.on('tweety', function(msg){
    if (msg.geo){
      // console.log(msg.geo);
      let coords = msg.geo;
      testData.data.push({lat: coords.coordinates[0], lng: coords.coordinates[1], count: 1});
      // console.log(testData);
      heatmap.setData(testData);
    } 

    else if (msg.user.location) {
      let theaddress = msg.user.location;
      theaddress = theaddress.split('');
      theaddress = theaddress.map(function(val){
        if (val === ' '){
          return '+';
        } else {
          return val;
        }
      });
      theaddress = theaddress.join('');
      let $xhr = $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?address=${theaddress}&key=----------------`);
      $xhr.done(function(xhrdata) {
        if (xhrdata !== undefined && xhrdata.results[0].formatted_address !== undefined) {
          let lat = xhrdata.results[0].geometry.location.lat;
          let lng = xhrdata.results[0].geometry.location.lng;
          let newData = {lat: lat, lng: lng, count: 1};
          let loc = testData.data.indexOf(newData);
          // console.log(`Loc is ${loc}`);
          testData.data.push({lat: lat, lng: lng, count: 1});
          heatmap.setData(testData);
        }
      });
    }
  });


  $('#search-form').submit((event) => {
    event.preventDefault();

    $('.tweet').remove();

    const searchTerm = $('#search-term').val().trim();

    $.getJSON(`/tweets/${searchTerm}`)
      .done((tweets) => {
        // console.log(tweets);
        // const $body = $('body');

        $('#search-term').val('');

        for (var i = 0; i < tweets.statuses.length; i++) {
          let tweet = tweets.statuses[i];

          if (tweet.coordinates){
            // console.log('Geo!');
            // console.log(tweet.coordinates);
            let coords = tweet.coordinates;
            testData.data.push({lat: coords[0], lng: coords[1], count: 1});
            // console.log(testData);
            heatmap.setData(testData);
          }

          else if (tweet.user.location){
            // $body.append(`<div class='tweet'><p>${tweet.user.location}</p><div>`);
            // $body.append(`<div class='tweet'><p>${JSON.stringify(tweet)}</p><div>`);

            let theaddress = tweet.user.location;
            theaddress = theaddress.split('');
            theaddress = theaddress.map(function(val){
              if (val === ' '){
                return '+';
              } else {
                return val;
              }
            });
            theaddress = theaddress.join('');
            let $xhr = $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?address=${theaddress}&key=------------------`);
            $xhr.done(function(xhrdata) {
              if (xhrdata.results.length > 0){
                // let address = xhrdata.results[0].formatted_address;
                let lat = xhrdata.results[0].geometry.location.lat;
                let lng = xhrdata.results[0].geometry.location.lng;
                // let newData = {lat: lat, lng: lng, count: 1}
                // let loc = testData.data.indexOf(newData);
                testData.data.push({lat: lat, lng: lng, count: 1});
                heatmap.setData(testData);
              }
            });
          }
        }
      })
      .fail(() => {
        console.log('Unable to retrieve tweets');
      });
    return false;
  });
});