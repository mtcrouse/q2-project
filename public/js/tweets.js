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

  var socket = io();

  socket.on('tweety', function(msg){
    console.log(msg);
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
            $body.append(`<div class="tweet"><p>${tweet.text}</p><div>`);
          }

      })
      .fail(() => {
        console.log('Unable to retrieve tweets');
      });

    return false;
  });



});
