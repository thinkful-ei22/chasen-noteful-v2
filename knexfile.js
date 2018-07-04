'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'noteful-app',
      user: 'dev',
      password:'123321'
    },
    debug: true, // http://knexjs.org/#Installation-debug
    pool: { min: 1, max: 2 }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
