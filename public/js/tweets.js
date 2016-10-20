$(document).ready(() => {
  'use strict';

  $('.float-box').delay(4000).fadeIn(1000);
  $('#title-box').delay(3000).fadeOut(1000);

  $('#map').click(() => {
    $('#search-menu').hide();
  });

  var testData = {
    max: 7,
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

  // Take this out if we can't figure out how to use it at specific coordinates
  function addCircle() {
      var $circle = $('<div class="circle"></div>');
      $circle.animate({
          'width': '300px',
          'height': '300px',
          'margin-top': '-150px',
          'margin-left': '-150px',
          'opacity': '0'
      }, 4000, () => {
        console.log('circle!');
      });
      $('body').append($circle);

      setTimeout(function __remove() {
          $circle.remove();
      }, 4000);
  }


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
        '.5': '#aaaaff',
        '.8': '#5555aa',
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

  $('#search-icon').click(() => {
    $('#search-menu').fadeIn();
  });

  $('#exit-tweet-box').click(() => {
    $('#tweet-box').fadeOut();
    $('#exit-tweet-box').fadeOut();
  });

  $('#search-form').submit((event) => {
    event.preventDefault();

    const searchTerm = $('#search-term').val().trim();

    $('#search-menu').fadeOut();
    $('#tweet-box-content').empty();

    $.getJSON(`/tweets/${searchTerm}`)
      .done((tweets) => {

        $('#search-term').val('');

        for (var i = 0; i < tweets.statuses.length; i++) {
          let tweet = tweets.statuses[i];

          $('#tweet-box-content').append(`<p>${tweet.text}</p>`);

          if (i < tweets.statuses.length - 1) {
            $('#tweet-box-content').append('<hr>');
          }

          if (tweet.coordinates){
            // console.log('Geo!');
            // console.log(tweet.coordinates);
            let coords = tweet.coordinates;
            testData.data.push({lat: coords[0], lng: coords[1], count: 1});
            // console.log(testData);
            heatmap.setData(testData);
          }

          else if (tweet.user.location){

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

        $('#tweet-box').fadeIn();
        $('#exit-tweet-box').fadeIn();
      })
      .fail(() => {
        console.log('Unable to retrieve tweets');
      });
    return false;
  });
});