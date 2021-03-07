const nodemailer = require('nodemailer');
const Email = require('email-templates');
const aws = require('aws-sdk');
const {
  yourCompanyLogo,
  supportEmail,
  awsSecretAccessKey,
  awsAccessKeyId,
  awsSESRegion,
  dashboardUrl,
  apiUrl,
} = require('../../../config/vars');

// configure AWS SDK
aws.config.update({
  secretAccessKey: awsSecretAccessKey,
  accessKeyId: awsAccessKeyId,
  region: awsSESRegion,
});

// create Nodemailer SES transporter
const transporter = nodemailer.createTransport({
  SES: new aws.SES({
    apiVersion: '2010-12-01',
  }),
});

// verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.log('error with email connection', error);
  }
});

exports.sendPasswordReset = async (passwordResetObject) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: supportEmail,
    },
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: 'passwordReset',
      message: {
        to: passwordResetObject.user_email,
      },
      locals: {
        yourCompanyLogo,
        productName: 'Your company',
        // passwordResetUrl should be a URL to your app that displays a view where they
        // can enter a new password along with passing the resetToken in the params
        passwordResetUrl: `${dashboardUrl}/new-password/view?reset_token=${passwordResetObject.reset_token}`,
      },
    })
    .catch((error) => console.log('error sending password reset email', error));
};

exports.sendPasswordChangeEmail = async (user) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: `Your company Support <${supportEmail}>`,
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: 'passwordChange',
      message: {
        to: user.email,
      },
      locals: {
        yourCompanyLogo,
        productName: 'Your company',
        name: user.name,
      },
    })
    .catch(() => console.log('error sending change password email'));
};

exports.verifyEmail = async (user) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: `Your company Support <${supportEmail}>`,
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: 'verifyEmail',
      message: {
        to: user.email,
      },
      locals: {
        yourCompanyLogo,
        productName: 'Your company',
        confirmationCodeUrl: `${apiUrl}/v1/auth/verify-email?confirmation_code=${user.confirmation_code}`,
      },
    })
    .catch(() => console.log('error sending verify email'));
};
