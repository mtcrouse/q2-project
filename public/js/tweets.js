$(document).ready(() => {
  'use strict';

var testData = {
  max: 1,
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
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    "radius": 1,
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

  var socket = io();

  socket.on('tweety', function(msg){
    console.log(msg);
    // const searchTerm = $('#search-term').val().trim();

    // $.getJSON(`/tweets/${searchTerm}`)
    //   .done((tweets) => {
    //     const $body = $('body');

    //     $('#search-term').val('');

    //     for (let tweet of tweets.statuses) {
    //         if (tweet.geo !== null){
    //           $body.append(`<div class="tweet"><p>${tweet.geo.coordinates}</p><div>`);
    //           let coords = tweet.geo.coordinates;
    //           testData.data.push({lat: coords[0], lng: coords[1], count: 1});
    //           console.log(testData);
    //         }
    //       }
    // heatmap.setData(testData);
    //   })
    //   .fail(() => {
    //     console.log('Unable to retrieve tweets');
    //   });
  });

  $('#search-form').submit((event) => {
    event.preventDefault();

    $('.tweet').remove();

    const searchTerm = $('#search-term').val().trim();

    $.getJSON(`/tweets/${searchTerm}`)
      .done((tweets) => {
        const $body = $('body');

        $('#search-term').val('');

        for (let tweet of tweets.statuses) {
            if (tweet.geo !== null){
              $body.append(`<div class="tweet"><p>${tweet.geo.coordinates}</p><div>`);
              let coords = tweet.geo.coordinates;
              testData.data.push({lat: coords[0], lng: coords[1], count: 1});
              console.log(testData);
            }
          }
    heatmap.setData(testData);
      })
      .fail(() => {
        console.log('Unable to retrieve tweets');
      });

    return false;
  });
});




//   $('#search-form').submit((event) => {
//     event.preventDefault();

//     $('.tweet').remove();

//     const searchTerm = $('#search-term').val();

//     $.getJSON(`/tweets/${searchTerm}`)
//       .done((tweets) => {
//         const $body = $('body');

//         $body.append(tweets);
//         $body.append(`<div class="tweet"><p>${tweets}</p><div>`);

//         for (let tweet of tweets.statuses) {
//           if (tweet.coordinates !== null) {
//             $body.append(`<div class="tweet"><p>${tweet}</p><div>`);
//             $body.append(`<div class="tweet"><p>${tweet.coordinates.lat}</p><div>`);
//             $body.append(`<div class="tweet"><p>${tweet.coordinates.lng}</p><div>`);
//             console.log(coordinates);
//           }
//           if (tweet.user.location){
//             let theaddress = tweet.user.location
//             theaddress = theaddress.split('');
       
//             theaddress = theaddress.map(function(val){
//               if (val === ' '){
//                 return '+'
//               } else {
//                 return val
//               }
//             });
//             theaddress = theaddress.join('');
//             let $xhr = $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?address=${theaddress}&key=AIzaSyD9Eqb-zTPSDLCscIVgyP2RvYL3Y4GfxUk`);
//             $xhr.done(function(xhrdata) {
//               console.log(xhrdata);
//               if (xhrdata !== undefined && xhrdata.results[0].formatted_address !== undefined){
//                 let address = xhrdata.results[0].formatted_address;
//                 let lat = xhrdata.results[0].geometry.location.lat;
//                 let lng = xhrdata.results[0].geometry.location.lng;
//                 let newData = {lat: lat, lng: lng, count: 1}
//                 let loc = testData.data.indexOf(newData);
//                 if (loc !== -1) {
//                   console.log('it\'s there')
//                   testData.data[loc].count++;
//                   console.log(testData.data[loc].count);
//                 } else{
//                   testData.data.push({lat: lat, lng: lng, count: 1});
//                 }
//               }
//             })
//           }
//       console.log(testData);
//       heatmap.setData(testData);
//       }
//     })
//       .fail(() => {
//         console.log('Unable to retrieve tweets');
//       });

//     return false
// });