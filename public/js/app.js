'use strict';

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
}

initMap();