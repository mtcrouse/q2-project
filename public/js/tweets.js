$(document).ready(() => {
  'use strict';

  let giantArray = [];

  $('.float-box').delay(1000).fadeIn(1000);
  $('#title-box').delay(1000).fadeOut(1000);

  $('#map').click(() => {
    $('#search-menu').hide();
    $('#signin-menu').hide();
    $('#profile-menu').hide();
    $('.token-toggle').hide();
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
    $('.token-toggle').hide();
  });

$('#user-box').click(() => {
    $('#search-menu').hide();
    $.getJSON(`/token`)
      .done((loggedin) => {
        if (loggedin) {
          $('#profile-menu')
            .attr('display', 'inline')
            .fadeIn(1000)
          }

        else {
          $('#signin-menu')
            .attr('display', 'inline')
            .fadeIn(1000);
      }
    })
    .fail((err) => {
      Materialize.toast('Unable to log out. Please try again.', 3000);
      Materialize.toast(err);
    })
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

  $('#signin-menu').hide();
  $('#profile-menu').hide();

  $('#loginForm').submit((event) => {
    event.preventDefault();

    const email = $('#email').val().trim();
    const password = $('#password').val();

    if (!email) {
      return Materialize.toast('Email must not be blank', 3000);
    }

    if (!password) {
      return Materialize.toast('Password must not be blank', 3000);
    }

    const options = {
      contentType: 'application/json',
      data: JSON.stringify({ email, password }),
      dataType: 'json',
      type: 'POST',
      url: '/token'
    };

    $.ajax(options)
      .done(() => {
        $('#signin-menu').hide();
      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 3000);
      });
  });


  $('#logout').submit((event) => {
    event.preventDefault();

    const options = {
      dataType: 'json',
      type: 'DELETE',
      url: '/token'
    };

    $.ajax(options)
      .done(() => {
        $('#profile-menu').hide();
      })
      .fail(() => {
        Materialize.toast('Unable to log out. Please try again.', 3000);
      });
  });

    $('#signUpForm').submit((event) => {
    event.preventDefault();

    const username = $('#username').val().trim();
    const email = $('#email-signup').val().trim();
    const password = $('#password-signup').val();

    if (!username) {
      return Materialize.toast('Username name must not be blank', 3000);
    }

    if (!email) {
      return Materialize.toast('Email must not be blank', 3000);
    }

    if (email.indexOf('@') < 0) {
      return Materialize.toast('Email must be valid', 3000);
    }

    if (!password || password.length < 8) {
      return Materialize.toast(
        'Password must be at least 8 characters long',
        3000
      );
    }

    const options = {
      contentType: 'application/json',
      data: JSON.stringify({ username, email, password }),
      dataType: 'json',
      type: 'POST',
      url: '/users'
    };

    $.ajax(options)
      .done(() => {
        $('#signin-menu').hide();

        const options2 = {
          contentType: 'application/json',
          data: JSON.stringify({ email, password }),
          dataType: 'json',
          type: 'POST',
          url: '/token'
        };

        $.ajax(options2)
          .done(() => {
          })
          .fail(($xhr) => {
            Materialize.toast($xhr.responseText, 3000);
          });
      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 3000);
      });
  });
});
