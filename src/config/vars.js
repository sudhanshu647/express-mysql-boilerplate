const path = require('path');

require('dotenv-safe').config({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
  allowEmptyValues: true,
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  dashboardUrl: process.env.DASHBOARD_URL,
  apiUrl: process.env.API_URL,
  yourCompanyLogo: process.env.YOUR_COMPANY_LOGO,
  supportEmail: process.env.SUPPORT_EMAIL,
  // MY-SQL config
  mysqlConfig: {
    dBUserName: process.env.MYSQL_DB_USERNAME,
    dbPassword: process.env.MYSQL_DB_PASSWORD,
    dbName: process.env.MYSQL_DB_NAME,
    dbHost: process.env.MYSQL_DB_HOST,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  // AWS config
  awsAccessKeyId: process.env.YOUR_COMPANY_AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.YOUR_COMPANY_AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.YOUR_COMPANY_AWS_REGION,
  awsSESRegion: process.env.YOUR_COMPANY_AWS_SES_REGION,
  s3Bucket: process.env.S3_BUCKET,
};
