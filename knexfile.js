'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/twittermap_dev'
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/twittermap_test'
  },
  production: {
  client: 'pg',
  connection: process.env.DATABASE_URL
  }
};
