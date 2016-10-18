$(document).ready(() => {
  'use strict';

  var socket = io();

  socket.on('tweety', function(msg){
    // $('body').prepend($('<p>').text(msg));
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
          console.log(tweet);
          $body.append(`<div class="tweet"><p>${JSON.stringify(tweet.text)}</p><div>`);
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
