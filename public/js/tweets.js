$(document).ready(() => {
  'use strict';

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

  // var socket = io();
  //
  // socket.on('tweety', function(msg){
  //   console.log(msg);
  // });

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
            $body.append(`<div class="tweet"><p>${tweet}</p><div>`);
          }

      console.log(testData);
      heatmap.setData(testData);
      })
      .fail(() => {
        console.log('Unable to retrieve tweets');
      });

    $('#search-form').val('San Francisco');
    return false;
  });

  const heatmapData = [];

  let heatmap = new HeatmapOverlay(map,
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

});
