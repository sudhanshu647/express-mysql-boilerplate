/**
 * @swagger
 *  components:
 *    schemas:
 *      LoginSignupRes:
 *        type: object
 *        properties:
 *          token:
 *            type: object
 *            properties:
 *               token_type:
 *                 type: string
 *                 description: Access Token's type
 *               access_token:
 *                 type: string
 *                 description: Authorization Token
 *               refresh_token:
 *                 type: string
 *                 description: Token to get a new access_token after expiration time
 *               expires_in:
 *                 type: date
 *                 description: Access Token's expiration time in miliseconds
 *          user:
 *            type: object
 *            properties:
 *               id:
 *                 type: integer
 *                 description: User's id
 *               name:
 *                 type: string
 *                 description: User's name
 *               email:
 *                  type: string
 *                  description: User's email
 *               created_at:
 *                  type: date
 *                  description: Timestamp
 *        example:
 *          token:
 *            token_type: Bearer
 *            access_token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1OTE1MDk4ODcsImlhdC
 *                         I6MTU5MTQyMzQ4Nywic3ViIjo3Mn0.yhRn0j66EKYvf7yDWAijPDmW95ucZMf7wh1grINPzrU
 *            refresh_token: 72.e20de41b337d7875af02dee3f8ede9d53b297dfbeb32dfe989b5f779f258179a
 *                           3571260e97d1acab
 *            expires_in: 2020-06-07T06:04:47.494Z
 *          user:
 *            id: 101
 *            name: developer
 *            email: fake@email.com
 *            created_at: 2020-06-05T06:04:47.494Z
 */
