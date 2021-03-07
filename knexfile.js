const { mysqlConfig } = require('./src/config/vars');

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: mysqlConfig.dbHost,
      database: mysqlConfig.dbName,
      user: mysqlConfig.dBUserName,
      password: mysqlConfig.dbPassword,
    },
    migrations: {
      directory: 'src/api/migrations',
    },
    seeds: {
      directory: 'src/api/seeders',
    },
  },

  staging: {
    client: 'mysql2',
    connection: {
      host: '',
      database: '',
      user: '',
      password: '',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: 'src/api/migrations',
    },
    seeds: {
      directory: 'src/api/seeders',
    },
  },

  production: {
    client: 'mysql2',
    connection: {
      host: mysqlConfig.dbHost,
      database: mysqlConfig.dbName,
      user: mysqlConfig.dBUserName,
      password: mysqlConfig.dbPassword,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: 'src/api/migrations',
    },
    seeds: {
      directory: 'src/api/seeders',
    },
  },
};
