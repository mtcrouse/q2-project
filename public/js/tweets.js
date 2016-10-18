$(document).ready(() => {
  'use strict';


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

        for (let tweet of tweets.statuses) {
          // $body.append(`<div class="tweet"><p>${JSON.stringify(tweet.text)}</p><div>`);
          // $body.append(`<div class="tweet"><p>${JSON.stringify(tweet)}</p><div>`);
          // $body.append(`<div class="tweet"><p>${tweet.user.location}</p><div>`);
          if (tweet.user.location){
            let theaddress = tweet.user.location
            // $body.append(`<div class="tweet"><p>${theaddress}</p><div>`)
            theaddress = theaddress.split('');
       
            theaddress = theaddress.map(function(val){
              if (val === ' '){
                return '+'
              } else {
                return val
              }
            });

            theaddress = theaddress.join('');
            // $body.append(`<div class="tweet"><p>${theaddress}</p><div>`)

            let $xhr = $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?address=${theaddress}&key=-----------------`);
            $xhr.done(function(xhrdata) {
              console.log(xhrdata);
              $('body').append(`<div class="tweet"><p>${xhrdata.results[0].formatted_address}</p><div>`)
              let address = xhrdata.results[0].formatted_address;
              $('body').append(`<div class="tweet"><p>${xhrdata.results[0].geometry.location.lat}</p><div>`)
              let lat = xhrdata.results[0].geometry.location.lat;
              $('body').append(`<div class="tweet"><p>${xhrdata.results[0].geometry.location.lng}</p><div>`)
              let lng = xhrdata.results[0].geometry.location.lng;
              // var marker = new google.maps.Marker({
              //   map: map,
              //   position: { lat: lat, lng: lng },
              //   title: address
              // });
              heatmap.setMap(null)
              heatmapData.push(new google.maps.LatLng(lat, lng));
              console.log(heatmapData);
              heatmap = new google.maps.visualization.HeatmapLayer({
                data: heatmappoints,
                map: map
              });
            })

      }
      }
      })
      .fail(() => {
        console.log('Unable to retrieve tweets');
      });


    return false;
  });

  $('#stream-form').submit((event) => {
    event.preventDefault();

    $('.tweet').remove();

    $.getJSON('/tweets/stream')
      .done((tweets) => {
        // const $body = $('body');
        // console.log(tweets);
        //
        // for (let tweet of tweets.statuses) {
        //   console.log(tweet);
        //   $body.append(`<div class="tweet"><p>${JSON.stringify(tweet.text)}</p><div>`);
        // }
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

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40, lng: -90},
    zoom: 4,
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
        {
          featureType: 'all',
          stylers: [
            { hue: '#00ff00' },
            {  saturation: 50 }
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
            { color: '#63BDDB' }
          ]
        }
      ]

  });

  // heatmappoints = new google.maps.MVCArray(pointArray);

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    map: map
  });
  heatmap.setMap(map);
};

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

