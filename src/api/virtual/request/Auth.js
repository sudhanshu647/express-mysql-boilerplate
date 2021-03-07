/**
 * @swagger
 *  components:
 *    schemas:
 *      LoginSignupReq:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *          password:
 *             type: string
 *        example:
 *           email: fake@email.com
 *           password: user_password
 */
