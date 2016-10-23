$(document).ready(() => {
  'use strict';

  let isLoggedIn = false;

  $.getJSON('/token')
    .done((loggedin) => {
      if (loggedin) {
        isLoggedIn = true;
      }
    })
    .fail((err) => {
      console.error(err);
    });

  $('#search-menu').delay(1000).fadeIn(1000);
  $('.pop-out-icon').delay(1000).fadeIn(1000);
  $('#title-box').delay(1000).fadeOut(1000);

  $('#map').click(() => {
    $('.pop-out-box').hide();
    $('.pop-out-icon').show();
  });

  $('#exit-tweet-box').click(() => {
    $('#tweet-box').hide();
    $('.pop-out-icon').show();
  });

  $('#twitter-icon').click(() => {
    $('.pop-out-box').hide();
    $('#return-tweet-box').hide();
    $('#tweet-box').fadeIn();

    if (isLoggedIn) {
      $('.add-favorite').attr('style', 'opacity:1;');
    } else {
      $('.add-favorite').attr('style', 'opacity:0.3;');
      $('.add-favorite').html('<i class="material-icons">star_border</i>');
    }
  });

  //Toggle search-result view
  $('#search-icon').click(() => {
    $('.pop-out-box').hide();
    $('.pop-out-icon').show();
    $('#search-menu').fadeIn();
  });

  // Toggle open log-in/sign-up view
  $('#user-box').click(() => {
    $('.pop-out-box').hide();
    $('.pop-out-icon').show();

    if (isLoggedIn) {
      getUserFavorites();
      $('#profile-menu')
        .attr('display', 'inline')
        .fadeIn(1000);
    } else {
      $('#signin-menu')
        .attr('display', 'inline')
        .fadeIn(1000);
    }
  });

  // Delete favorite from user account
  $('#profile-menu').on('click', '.delete', (event) => {
    event.preventDefault();
    let row = event.target.parentElement.parentElement.parentElement;
    let favoriteId = row.getAttribute('favoriteId');
    $(row).fadeOut();
    row.remove();

    const options = {
      contentType: 'application/json',
      data: JSON.stringify({favoriteId: favoriteId}),
      dataType: 'json',
      type: 'delete',
      url: '/favorites'
    };

    $.ajax(options)
      .done(() => {
        Materialize.toast(`Favorite deleted`, 2000);
      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 2000);
      });
  });

  // Heatmap options
  var testData = {
    max: 7,
    data: []
  };

  // Map styling
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

  // More heatmap styling
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

  // Streaming
  var socket = io();

  socket.on('tweety', function(msg){
    if (msg[4] !== null){
      let coords = [msg[4], msg[5]];
      testData.data.push({lat: coords[0], lng: coords[1], count: 1});

      heatmap.setData(testData);
    }
  });

  // Search form and search results
  $('#search-form').submit((event) => {
    event.preventDefault();

    const searchTerm = $('#search-term').val().trim();

    $('.pop-out-box').fadeOut();
    $('#return-tweet-box').hide();
    $('#tweet-box-content').empty();
    $('#tweet-box').fadeIn();

    $.getJSON(`/tweets/${searchTerm}`)
      .done((tweets) => {

        // Create row in searches table
        const options = {
          contentType: 'application/json',
          data: JSON.stringify({searchTerm: searchTerm}),
          dataType: 'json',
          type: 'POST',
          url: '/searches'
        };

        $.ajax(options)
          .done(() => {
            // Create row in searches_users
            const options2 = {
              contentType: 'application/json',
              type: 'POST',
              url: '/searches_users'
            };

            $.ajax(options2)
              .done(() => {
                console.log('Searches_users added');
              })
              .fail(($xhr) => {
                console.log($xhr.responseText);
              });
          })
          .fail(($xhr) => {
            Materialize.toast($xhr.responseText);
          });

        //Empty search form
        $('#search-term').val('');

        // Display tweets in search results
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

        if (isLoggedIn) {
          $('.add-favorite').attr('style', 'opacity:1;');
        } else {
          $('.add-favorite').attr('style', 'opacity:0.3;');
          $('.add-favorite').html('<i class="material-icons">star_border</i>');
        }

        // When user clicks on favorite button, enter favorite in favorites and favorites_users tables
        $('.add-favorite').click((event) => {
          $.getJSON('/token')
            .done((loggedin) => {
              if (loggedin) {
                $(event.target).text('star');

                //Create row in favorites table
                const newFavorite = {tweet: $($(event.target).parent().prev().children()[0]).text(), searchTerm: searchTerm};
                const options = {
                  contentType: 'application/json',
                  data: JSON.stringify(newFavorite),
                  dataType: 'json',
                  type: 'POST',
                  url: '/favorites'
                };

                $.ajax(options)
                  .done(() => {
                    Materialize.toast('Favorite added.', 3000);

                    // Create row in favorites_users table
                    const options2 = {
                      contentType: 'application/json',
                      data: JSON.stringify(newFavorite),
                      dataType: 'json',
                      type: 'POST',
                      url: '/favorites_users'
                    };

                    $.ajax(options2)
                      .done(() => {
                        console.log('Favorite_User added.');
                      })
                      .fail(($xhr) => {
                        console.log($xhr.responseText);
                      });
                  });
              }

              else {
                Materialize.toast('Log in or create an account.', 3000);
              }
            })
            .fail((err) => {
              Materialize.toast('Unable to log out. Please try again.', 3000);
              console.log(err);
            });
        });
      })
      .fail(() => {
        console.log('Unable to retrieve tweets');
      });
    return false;
  });

  // Login form
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

    // Log in; get token
    const options = {
      contentType: 'application/json',
      data: JSON.stringify({ email, password }),
      dataType: 'json',
      type: 'POST',
      url: '/token'
    };

    $.ajax(options)
      .done(() => {
        $('.pop-out-box').hide();
        Materialize.toast('Thanks for logging in. You can now favorite tweets.', 4000);
        isLoggedIn = true;
      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText);
      });
  });

  // Logout
  $('#logout').submit((event) => {
    event.preventDefault();

    const options = {
      dataType: 'json',
      type: 'DELETE',
      url: '/token'
    };

    $.ajax(options)
      .done(() => {
        $('.pop-out-box').hide();
        isLoggedIn = false;
        Materialize.toast('You are logged out.', 3000);
      })
      .fail(() => {
        Materialize.toast('Unable to log out. Please try again.', 3000);
      });
  });

  // Sign up and add user to users table
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
        $('.pop-out-box').hide();

        const options2 = {
          contentType: 'application/json',
          data: JSON.stringify({ email, password }),
          dataType: 'json',
          type: 'POST',
          url: '/token'
        };

        $.ajax(options2)
          .done(() => {
            Materialize.toast(`Thanks for signing up, ${username}. You're now logged in. You can now add tweets to your favorites.`, 4000);
            isLoggedIn = true;
          })
          .fail(($xhr) => {
            console.log($xhr.responseText);
          });
      })
      .fail(($xhr) => {
        console.log($xhr.responseText);
      });
  });


  // Display user's favorites
  const getUserFavorites = function () {
    $('.favoritesBox').remove();
    const options = {
      contentType: 'application/json',
      dataType: 'json',
      type: 'get',
      url: '/favorites/ucheck/'
    };

    $.ajax(options)
      .done((contents) => {
        let div = document.createElement('div');
        div.className='userfavorites-box favoritesBox row';
        div.innerHTML = `<p>Tweets you favorited:</p>`;
        let table = document.createElement('table');
        table.className = 'userFavorites bordered highlight';
        table.innerHTML = `<col class="column-one"><col class="column-two"><col class="column-three"><thead class=><tr><th>Search</th><th>Tweet</th><th>Delete</th></tr></thead><tbody id="uf-tbody"></tbody>`;
        div.appendChild(table);
        document.getElementById('profile-menu-data').appendChild(div);
        for (let i = 0; i < contents.length; i++){
          let trow = document.createElement('tr');
          trow.className = `user-row`;
          trow.setAttribute(`searchId`, `${contents[i].search_id}`);
          trow.setAttribute(`favoriteId`, `${contents[i].favorite_id}`);
          trow.innerHTML = `<td><p>${contents[i].search_term}</td><td>${contents[i].tweet}</td><td><a class="delete" href=""><i class="small material-icons red-text accent-4">clear</i></a></td>`;
          document.getElementById('uf-tbody').appendChild(trow);
        }

        // Display other users' favorites
        const options2 = {
          contentType: 'application/json',
          dataType: 'json',
          type: 'get',
          url: '/favorites/notucheck/'
        };

        $.ajax(options2)
          .done((contents) => {
            let div = document.createElement('div');
            div.className='otherUserfavorites-box favoritesBox row';
            div.innerHTML = `<p>Other users' favorites:</p>`;
            let table = document.createElement('table');
            table.className = 'otherUserFavorites bordered highlight';
            table.innerHTML = `<col class="column-one"><col class="column-two"><col class="column-three"><thead class=><tr><th>Search</th><th>Tweet</th></tr></thead><tbody id="nuf-tbody"></tbody>`;
            div.appendChild(table);
            document.getElementById('profile-menu-data').appendChild(div);

            for (let i = 0; i < contents.length; i++){
              let trow = document.createElement('tr');
              trow.innerHTML = `<td><p>${contents[i].search_term}</td><td>${contents[i].tweet}</td><td>`;
              document.getElementById('nuf-tbody').appendChild(trow);
            }
          })
          .fail(($xhr) => {
            console.log($xhr.responseText);
          });
      })
      .fail(($xhr) => {
        console.log($xhr.responseText);
        console.log('Failure');
      });
  };

});
