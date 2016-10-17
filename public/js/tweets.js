$(document).ready(() => {
  'use strict';

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
});
