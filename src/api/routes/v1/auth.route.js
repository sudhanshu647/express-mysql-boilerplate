const express = require('express');
const { validate } = require('express-validation');
const controller = require('../../controllers/auth.controller');
const oAuthLogin = require('../../middlewares/auth').oAuth;
const {
  login,
  register,
  oAuth,
  refresh,
  sendPasswordReset,
  passwordReset,
} = require('../../validations/auth.validation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth management
 */

router.route('/register')
/**
 * @swagger
 * path:
 *  /auth/register:
 *    post:
 *      summary: Create a new user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginSignupReq'
 *      responses:
 *        "201":
 *          description: user created
 *        '400':
 *          description: Some parameters may contain invalid values.
 *        '409':
 *          description: User already registered.
 *        '5XX':
 *          description: Unexpected error.
 */
  .post(validate(register), controller.register);

router.route('/login')
/**
 * @swagger
 * path:
 *  /auth/login:
 *    post:
 *      summary: Login Get an access_token
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginSignupReq'
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/LoginSignupRes'
 *        '400':
 *          description: Some parameters may contain invalid values.
 *        '401':
 *          description: Incorrect email or password.
 *        '5XX':
 *          description: Unexpected error.
 */
  .post(validate(login), controller.login);

router.route('/refresh-token')
/**
* @swagger
* path:
*  /auth/refresh-token:
*    post:
*      summary: Refresh expired access_token
*      tags: [Auth]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*               type: object
*               required:
*                 - email
*                 - refresh_token
*               properties:
*                 email:
*                   type: string
*                   format: email
*                   description: Email for the user, needs to be unique.
*                 refresh_token:
*                   type: string
*               example:
*                 email: fake@email.com
*                 refresh_token: 72.e20de41b337d7875af02dee3f8ede9d53b2
*      responses:
*        "200":
*          description: A user schema
*          content:
*            application/json:
*              example:
*                  token_type: Bearer
*                  access_token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1OTE1MDk4ODcsImlhdC
*                         I6MTU5MTQyMzQ4Nywic3ViIjo3Mn0.yhRn0j66EKYvf7yDWAijPDmW95ucZMf7wh1grINPzrU
*                  refresh_token: 72.e20de41b337d7875af02dee3f8ede9d53b297dfbeb32dfe989b5f779f258179
*                         a3571260e97d1acab
*                  expires_in: 2020-06-07T06:04:47.494Z
*        '400':
*          description: Some parameters may contain invalid values.
*        '401':
*          description: Incorrect email or refresh_token.
*        '5XX':
*          description: Unexpected error.
*/
  .post(validate(refresh), controller.refresh);

router
  .route('/send-password-reset')
/**
* @swagger
* path:
*  /auth/send-password-reset:
*    post:
*      summary: Send password reset token to the user email.
*      tags: [Auth]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*               type: object
*               required:
*                 - email
*               properties:
*                 email:
*                   type: string
*               example:
*                 email: fakeuser@example.com
*      responses:
*        "200":
*          description: Email sent
*          content:
*            application/json:
*              example:
*                  message: token send successfully
*        '400':
*          description: Some parameters may contain invalid values.
*        '401':
*          description: Incorrect access_token.
*        '5XX':
*          description: Unexpected error.
*/
  .post(validate(sendPasswordReset), controller.sendPasswordReset);

router.route('/reset-password')
/**
 * @swagger
 * path:
 *  /auth/reset-password:
 *    post:
 *      summary: Reset password
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *               type: object
 *               required:
 *                 - email
 *                 - password
 *                 - reset_token
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 reset_token:
 *                   type: string
 *               example:
 *                 email: fake@example.com
 *                 password: userpassword
 *                 reset_token: 72.e20de41b337d7875af02dee3f8ede9d53b297dfbeb32dfe989b5f779f258179a
 *      responses:
 *        "200":
 *          description: User Password Updated
 *          content:
 *            application/json:
 *              example:
 *                  message: Password Updated!
 *        '400':
 *          description: Some parameters may contain invalid values.
 *        '5XX':
 *          description: Unexpected error.
 */
  .post(validate(passwordReset), controller.resetPassword);

router.route('/google')
/**
* @swagger
* path:
*  /auth/google:
*    post:
*      summary: Login with google. Creates a new user if it does not exist
*      tags: [Auth]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*               type: object
*               required:
*                 - access_token
*               properties:
*                 access_token:
*                   type: string
*               example:
*                 access_token: 72.e20de41b337d7875af02dee3f8ede9d53b297dfbeb32dfe989b5f779f258179a
*      responses:
*        "200":
*          description: A user schema
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/LoginSignupRes'
*        '400':
*          description: Some parameters may contain invalid values.
*        '401':
*          description: Incorrect access_token.
*        '5XX':
*          description: Unexpected error.
*/
  .post(validate(oAuth), oAuthLogin('google'), controller.oAuth);

router.route('/verify-email')
/**
* @swagger
* path:
*  /auth/verify-email:
*    get:
*      summary:
*      tags: [Auth]
*      description: Verify Email ID
*      parameters:
*        - name: confirmation_code
*          in: query
*          schema:
*            type: string
*          required: true
*          example: '1'
*      responses:
*        "200":
*          description: Email verified
*        '400':
*          description: Some parameters may contain invalid values.
*        '5XX':
*          description: Unexpected error.
*/
  .get(controller.verifyEmail);

module.exports = router;

// router.route('/facebook').post(validate(oAuth), oAuthLogin('facebook'), controller.oAuth);
