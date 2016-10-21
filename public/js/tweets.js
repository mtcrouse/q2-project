$(document).ready(() => {
  'use strict';

  let giantArray = [];

  $('.float-box').delay(4000).fadeIn(1000);
  $('#title-box').delay(3000).fadeOut(1000);

  $('#map').click(() => {
    $('#search-menu').hide();
  });

  var testData = {
    max: 3,
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
  // function addCircle() {
  //     var $circle = $('<div class="circle"></div>');
  //     $circle.animate({
  //         'width': '300px',
  //         'height': '300px',
  //         'margin-top': '-150px',
  //         'margin-left': '-150px',
  //         'opacity': '0'
  //     }, 4000, () => {
  //       console.log('circle!');
  //     });
  //     $('body').append($circle);
  //
  //     setTimeout(function __remove() {
  //         $circle.remove();
  //     }, 4000);
  // }


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
        '.8': 'yellow',
        '.95': 'red'
      }
    });

  var socket = io();

  socket.on('tweety', function(msg){
    if (msg[4] !== null){
      let coords = [msg[4], msg[5]];
      testData.data.push({lat: coords[0], lng: coords[1], count: 1});
      giantArray.push(msg[0]);

      heatmap.setData(testData);
    }
    console.log(msg);
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

    let atLeastOneTweet = false;

    const searchTerm = $('#search-term').val().trim();

    $('#search-menu').fadeOut();
    $('#tweet-box-content').empty();

    for (let tweet of giantArray) {
      if (tweet.includes(searchTerm.toLowerCase())) {
        $('#tweet-box-content').append(`<p>${tweet}</p>`);
        atLeastOneTweet = true;
      }
    }

    if (atLeastOneTweet === false) {
      $('#tweet-box-content').append(`<p>No matching tweets found! Try again in a few minutes.</p>`);
    }

    $('#tweet-box').fadeIn();
    $('#exit-tweet-box').fadeIn();

    // $.getJSON(`/tweets/${searchTerm}`)
    //   .done((tweets) => {
    //
    //     $('#search-term').val('');
    //
    //     for (let i = 0; i < tweets.statuses.length; i++) {
    //       let tweet = tweets.statuses[i];
    //
    //       $('#tweet-box-content').append(`<p>${tweet.text}</p>`);
    //
    //       if (i < tweets.statuses.length - 1) {
    //         $('#tweet-box-content').append('<hr>');
    //       }
    //     }
    //
    //     $('#tweet-box').fadeIn();
    //     $('#exit-tweet-box').fadeIn();
    //   })
    //   .fail(() => {
    //     console.log('Unable to retrieve tweets');
    //   });
    return false;
  });
});
