$(document).ready(() => {
  'use strict';
 
 const removeUserFavorites = function () {
    $('.favoritesBox').remove();
 }

  $('#search-menu').delay(1000).fadeIn(1000);
  $('#user-box').delay(1000).fadeIn(1000);
  $('#title-box').delay(1000).fadeOut(1000);

  $('#map').click(() => {
    $('#search-menu').hide();
    $('#signin-menu').hide();
    $('#profile-menu').hide();
    $('#search-icon').show();
    $('.token-toggle').hide();
    $('#tweet-box').fadeOut();
    $('#exit-tweet-box').fadeOut();
    $('#twitter-icon').fadeIn();
    $('#return-tweet-box').fadeIn();
  });

  // Heatmap options
  var testData = {
    max: 7,
    data: []
  };

  // Map options>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Map style
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

  // More heatmap options >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Heatmap style
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

  // Streaming >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Streaming
  socket.on('tweety', function(msg){
    if (msg[4] !== null){
      let coords = [msg[4], msg[5]];
      testData.data.push({lat: coords[0], lng: coords[1], count: 1});

      heatmap.setData(testData);
    }
    console.log(msg);
  });

  //Toggle search div >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Toggle search icon
  $('#search-icon').click(() => { 
    removeUserFavorites();
    $('#search-menu').fadeIn();
    $('#search-icon').fadeOut();
    $('.token-toggle').hide();
    $('#twitter-icon').show();
    $('#return-tweet-box').show();
    $('#tweet-box').fadeOut();
    $('#exit-tweet-box').fadeOut();
    $
  });

  // Toggle open log-in/sign-up div>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Toggle log-in/sign-up div
  $('#user-box').click(() => {
      getUserFavorites();
      $('#tweet-box').hide();
      $('#exit-tweet-box').hide();
      $('#search-menu').hide();
      $('#twitter-icon').show();
      $('#return-tweet-box').show();
      $('#search-icon').show();

      $.getJSON('/token')
        .done((loggedin) => {
          if (loggedin) {
            // Load profile>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Load profile info
            $('#profile-menu')
              .attr('display', 'inline')
              .fadeIn(1000);
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

  // Close tweet box on click >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Close tweet box on click
  $('#exit-tweet-box').click(() => {
    removeUserFavorites();
    $('#tweet-box').fadeOut();
    $('#exit-tweet-box').fadeOut();
    $('#return-tweet-box').fadeIn();
    $('#twitter-icon').fadeIn();
  });

  $('#twitter-icon').click(() => {
    removeUserFavorites();
    $('#twitter-icon').hide();
    $('#return-tweet-box').hide();
    $('#tweet-box').fadeIn();
    $('#exit-tweet-box').fadeIn();
    $('#profile-menu').hide();
    $('#signin-menu').hide();
    $('#search-menu').hide();
  });

  // Search form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Search form
  $('#search-form').submit((event) => {
    removeUserFavorites();
    event.preventDefault();

    let atLeastOneTweet = false;

    const searchTerm = $('#search-term').val().trim();

    $('#search-menu').fadeOut();
    $('#search-icon').fadeIn();
    $('#twitter-icon').hide();
    $('#return-tweet-box').hide();
    $('#tweet-box-content').empty();
    $('#tweet-box').fadeIn();
    $('#exit-tweet-box').fadeIn();

    $.getJSON(`/tweets/${searchTerm}`)
      .done((tweets) => {
        // Create row in searches row>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Create searches row
          const options = {
            contentType: 'application/json',
            data: JSON.stringify({searchTerm: searchTerm}),
            dataType: 'json',
            type: 'POST',
            url: '/searches'
          }

          $.ajax(options)
            .done(() => {
              console.log('Search added', 3000);
              // Create row in searches_users >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Create searches_users row
              const options2 = {
                contentType: 'application/json',
                type: 'POST',
                url: '/searches_users'
              }

              $.ajax(options2)
                .done(() => {
                  console.log('Searches_users added', 3000)
                })
                .fail(($xhr) => {
                  console.log($xhr.responseText, 3000);
                });
            })
            .fail(($xhr) => {
              Materialize.toast($xhr.responseText, 3000);
            });


        $('#search-term').val('');

        // Display tweets>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Display tweets
        for (let i = 0; i < tweets.statuses.length; i++) {
          let tweet = tweets.statuses[i];

          let $div = $(`<div class='sidebox-tweet row'></div>`);
          let $div2 = $(`<div class='tweet-div col l10'></div>`);
          $div2.append(`<p>${tweet.text}</p>`);
          let $button = $(`<span class="add-favorite star-right"><i class="material-icons">star_border</i></span>`);
          $div.append($div2);
          $div.append($button);
          $('#tweet-box-content').append($div);

          if (i < tweets.statuses.length - 1) {
            $('#tweet-box-content').append('<hr>');
          }
        }

        $('.add-favorite').click((event) => {
          console.log('1 trying to add favorite');
          $.getJSON(`/token`)
            .done((loggedin) => {
              console.log('2 done and adding favorite');
              if (loggedin) {
                console.log('3 done and adding favorite')
                $(event.target).text('star');
                // console.log(`$($(event.target).parent().prev().children()[0]).text() is ${$($(event.target).parent().prev().children()[0]).text()}`);

                //Create row in favorites >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Create row in favorites
                const newFavorite = {tweet: $($(event.target).parent().prev().children()[0]).text(), searchTerm: searchTerm};
                console.log(`newFavorite is ${JSON.stringify(newFavorite)}`)
                const options = {
                  contentType: 'application/json',
                  data: JSON.stringify(newFavorite),
                  dataType: 'json',
                  type: 'POST',
                  url: '/favorites'
                }

                $.ajax(options)
                  .done(() => {
                    Materialize.toast('Favorite added.', 3000);

                    // Create row in favorites_users >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Create row in favorites_users
                    const options2 = {
                      contentType: 'application/json',
                      data: JSON.stringify(newFavorite),
                      dataType: 'json',
                      type: 'POST',
                      url: '/favorites_users'
                    }

                    $.ajax(options2)
                      .done(() => {
                        console.log('Favorite_User added.', 3000);
                      })
                      .fail(($xhr) => {
                        console.log($xhr.responseText, 3000);
                      });
                  })
              }

              else {
                $('.add-favorite-disabler').addClass('disabled');
                Materialize.toast('Log in or create an account.', 3000);
              }
            })
            .fail((err) => {
              Materialize.toast('Unable to log out. Please try again.', 3000);
              console.log(err);
            })
          });

        $('#tweet-box').fadeIn();
        $('#exit-tweet-box').fadeIn();
      })
      .fail(() => {
        console.log('Unable to retrieve tweets');
      });
    return false;
  });

  // Needed(?)
  $('#signin-menu').hide();
  $('#profile-menu').hide();

  // Login-form handling>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Login-form handling
  $('#loginForm').submit((event) => {
    removeUserFavorites();
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
        $('.add-favorite').attr('style', 'opacity:1;');
        Materialize.toast('Thanks for logging in. You can now favorite tweets.', 7000);
      })
      .fail(($xhr) => {
        console.log($xhr.responseText, 3000);
      });
  });

  // Logout >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Log out
  $('#logout').submit((event) => {
    removeUserFavorites();
    event.preventDefault();

    const options = {
      dataType: 'json',
      type: 'DELETE',
      url: '/token'
    };

    $.ajax(options)
      .done(() => {
        $('#profile-menu').hide();
        $('.add-favorite').attr('style', 'opacity:0.3;');
        $('.add-favorite').html('<i class="material-icons">star_border</i>');
        removeUserFavorites();
      })
      .fail(() => {
        Materialize.toast('Unable to log out. Please try again.', 3000);
      });
  });

  // Sign up >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Sign up
  $('#signUpForm').submit((event) => {
    removeUserFavorites();
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
            $('.add-favorite').attr('style', 'opacity:1;');
            Materialize.toast(`Thanks for signing up, ${username}. You're now logged in. You can now add tweets to your favorites.`, 6000);
          })
          .fail(($xhr) => {
            console.log($xhr.responseText, 3000);
          });
      })
      .fail(($xhr) => {
        console.log($xhr.responseText, 3000);
      });
  });


  // Populate profile w/ user favorites >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> User Favorites
  const getUserFavorites = function () {
    removeUserFavorites();
    const options = {
      contentType: 'application/json',
      dataType: 'json',
      type: 'get',
      url: '/favorites/ucheck/'
    };

    $.ajax(options)
      .done((contents) => {
        // $('.add-favorite').attr('style', 'opacity:1;');
        // content = JSON.stringify(contents);
          let div = document.createElement('div')
          div.className='userfavorites-box favoritesBox row';
          div.innerHTML = `<p>Tweets you favorited:`
          let table = document.createElement('table');
          table.className = 'userFavorites bordered highlight';
          table.innerHTML = `<col class="column-one"><col class="column-two"><col class="column-three"><thead class=><tr><th>Search</th><th>Tweet</th><th>Delete</th></tr></thead><tbody id="uf-tbody"></tbody>`;
          div.appendChild(table);
          document.getElementById('profile-menu').appendChild(div);
        for (let i = 0; i < contents.length; i++){
          let trow = document.createElement('tr')
          trow.className = `user-row data-searchId=${contents[i].search_id} data-favoriteId=${contents[i].favorite_id}`
          trow.innerHTML = `<td><p>${contents[i].search_term}</td><td>${contents[i].tweet}</td><td><a class="delete" href=""><i class="small material-icons red-text accent-4">clear</i></a></td>`
          document.getElementById('uf-tbody').appendChild(trow);
        }
        // }
      })
      .fail(($xhr) => {
        console.log($xhr.responseText);
        console.log('Failure');
      });

    // Other users' favorites >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Other users' favorites
    const options2 = {
      contentType: 'application/json',
      dataType: 'json',
      type: 'get',
      url: '/favorites/notucheck/'
    };  

    $.ajax(options2)
      .done((contents) => {
        // $('.add-favorite').attr('style', 'opacity:1;');
        console.log(JSON.stringify(contents));
          let div = document.createElement('div')
          div.className='otherUserfavorites-box favoritesBox row';
          div.innerHTML = `<p>Tweets you favorited:`
          let table = document.createElement('table');
          table.className = 'otherUserFavorites bordered highlight';
          table.innerHTML = `<col class="column-one"><col class="column-two"><col class="column-three"><thead class=><tr><th>Search</th><th>Tweet</th></tr></thead><tbody id="nuf-tbody"></tbody>`;
          div.appendChild(table);
          document.getElementById('profile-menu').appendChild(div);
        for (let i = 0; i < contents.length; i++){
          let trow = document.createElement('tr')
          trow.innerHTML = `<td><p>${contents[i].search_term}</td><td>${contents[i].tweet}</td><td>`
          document.getElementById('nuf-tbody').appendChild(trow);
        }
        // }
      })
      .fail(($xhr) => {
        console.log($xhr.responseText, 3000);
      });
  }

});