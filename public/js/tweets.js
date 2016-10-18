  map = new google.maps.Map(document.getElementById('map'), {
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

$(document).ready(() => {
  'use strict';


  var socket = io();

  socket.on('tweety', function(msg){
    console.log(msg);
  });

  
  $('#mapbutton').click((event) =>{
    initMap()
  });

  $('#search-form').submit((event) => {
    event.preventDefault();

    $('.tweet').remove();

    const searchTerm = $('#search-term').val().trim();

    $.getJSON(`/tweets/${searchTerm}`)
      .done((tweets) => {
        const $body = $('body');

        $('#search-term').val('');

        // $body.append(tweets);
            $body.append(`<div class="tweet"><p>${tweets}</p><div>`);

        for (let tweet of tweets.statuses) {
          // $body.append(`<div class="tweet"><p>${tweet.user.location}</p><div>`);
          // if (tweet.coordinates !== null) {
            $body.append(`<div class="tweet"><p>${tweet}</p><div>`);
            // $body.append(`<div class="tweet"><p>${tweet.coordinates.lat}</p><div>`);
            // $body.append(`<div class="tweet"><p>${tweet.coordinates.lng}</p><div>`);
            // console.log(coordinates);
          }
          // if (tweet.user.location){
          //   let theaddress = tweet.user.location
          //   theaddress = theaddress.split('');
       
          //   theaddress = theaddress.map(function(val){
          //     if (val === ' '){
          //       return '+'
          //     } else {
          //       return val
          //     }
          //   });
          //   theaddress = theaddress.join('');
          //   let $xhr = $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?address=${theaddress}&key=AIzaSyD9Eqb-zTPSDLCscIVgyP2RvYL3Y4GfxUk`);
          //   $xhr.done(function(xhrdata) {
          //     console.log(xhrdata);
          //     if (xhrdata !== undefined && xhrdata.results[0].formatted_address !== undefined){
          //       let address = xhrdata.results[0].formatted_address;
          //       let lat = xhrdata.results[0].geometry.location.lat;
          //       let lng = xhrdata.results[0].geometry.location.lng;
          //       let newData = {lat: lat, lng: lng, count: 1}
          //       let loc = testData.data.indexOf(newData);
          //       if (loc !== -1) {
          //         console.log('it\'s there')
          //         testData.data[loc].count++;
          //         console.log(testData.data[loc].count);
          //       } else{
          //         testData.data.push({lat: lat, lng: lng, count: 1});
          //       }
          //     }
              // $('body').append(`<div class="tweet"><p>${xhrdata.results[0].geometry.location.lng}</p><div>`)
              // var marker = new google.maps.Marker({
              //   map: map,
              //   position: { lat: lat, lng: lng },
              //   title: address
              // });
              // heatmap.setMap(null)
              // // console.log(heatmapData);
              // heatmap = new google.maps.visualization.HeatmapLayer({
              //   data: heatmapData,
              //   map: map
              // });
      console.log(testData);
      heatmap.setData(testData);
      })
      .fail(() => {
        console.log('Unable to retrieve tweets');
      });

    $('#search-form').val('San Francisco');
    return false;
  });

  $('#stream-form').submit((event) => {
    event.preventDefault();

    $('.tweet').remove();

    $.getJSON('/tweets/stream')
      .done((tweets) => {
        console.log(tweets);
      })
      .fail(() => {
        console.log('Unable to retrieve tweets');
      });
  });
});


  const heatmapData = [];

  var map;

function initMap() {



  // heatmappoints = new google.maps.MVCArray(pointArray);

//   heatmap = new google.maps.visualization.HeatmapLayer({
//     data: heatmapData,
//     map: map
//   });
//   heatmap.setMap(map);
};

heatmap = new HeatmapOverlay(map, 
  {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    "radius": .1,
    "maxOpacity": 1, 
    // scales the radius based on map zoom
    "scaleRadius": true, 
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries 
    //   (there will always be a red spot with useLocalExtremas true)
    "useLocalExtrema": false,
    // which field name in your data represents the latitude - default "lat"
    latField: 'lat',
    // which field name in your data represents the longitude - default "lng"
    lngField: 'lng',
    // which field name in your data represents the data value - default "value"
    valueField: 'count'
  }
);

var testData = {
  max: 1,
  data: []
};

heatmap.setData(testData);


// var geocoder = new google.maps.Geocoder();

// function geocodeAddress(geocoder, resultsMap, theaddress) {
//   var address = theaddress.value;
//   geocoder.geocode({'address': address}, function(results, status) {
//     if (status === 'OK') {
//       resultsMap.setCenter(results[0].geometry.location);
//       var marker = new google.maps.Marker({
//         map: resultsMap,
//         position: results[0].geometry.location
//       });
//     } else {
//       $('body').append(`<div class="tweet">Geocode of ${theaddress }was not successful for the following reason: ' + status`);
//     }
//   });
// }


// function geocodeAddress(geocoder, resultsMap) {
//   var address = document.getElementById('address').value;
//   geocoder.geocode({'address': address}, function(results, status) {
//     if (status === 'OK') {
//       resultsMap.setCenter(results[0].geometry.location);
//       var marker = new google.maps.Marker({
//         map: resultsMap,
//         position: results[0].geometry.location
//       });
//     } else {
//       alert('Geocode was not successful for the following reason: ' + status);
//     }
//   });
// }

