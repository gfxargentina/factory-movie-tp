const { Router } = require('express');
const {
  login,
  register,
  verifyEmail,
  logOut,
} = require('../controllers/auth.controller');
const path = require('path');
const validateJWT = require('../middlewares/validate-jwt');
const { isAdminRole, hasARole } = require('../middlewares/validate-role');

const router = Router();
/**
 * @openapi
 * components:
 *  schemas:
 *   Register:
 *    type: object
 *    properties:
 *     firstName:
 *      type: string
 *      description: User name
 *     lastName:
 *      type: string
 *      description: User last name
 *     email:
 *      type: string
 *      description: User email
 *     password:
 *      type: string
 *      description: User password
 *     address:
 *      type: string
 *      description: User address
 *    required:
 *     - firsName
 *     - lastName
 *     - email
 *     - password
 *     - address
 *    example:
 *     firstName: Skill
 *     lastName: Factory
 *     email: testy@email.com
 *     password: '12345678'
 *     address: avalith 2022
 *
 */

/**
 *@openapi
 * /auth/register:
 *  post:
 *    tags: [Register]
 *    summary: Register a new user
 *    description: Add a new user
 *    requestBody:
 *      description: Create a new user
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Register'
 *    responses:
 *      200:
 *        description: Successful operation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Register'
 */
router.post('/register', register);
router.get('/user/verify/:user_id/:uniqueString', verifyEmail);
router.get('/verified', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/verify.html'));
});

/**
 * @openapi
 * components:
 *  schemas:
 *   Login:
 *    type: object
 *    properties:
 *     email:
 *      type: string
 *      description: User email
 *     password:
 *      type: string
 *      description: User password *
 *    required:
 *     - email
 *     - pasword
 *    example:
 *     email: testy@email.com
 *     password: '12345678'
 *
 */

/**
 *@openapi
 * /auth/login:
 *  post:
 *    tags: [Login]
 *    summary: User Login
 *    description: User must login for realize actions
 *    requestBody:
 *      description: user login
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Login'
 *    responses:
 *      200:
 *        description: Successful operation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Login'
 */
router.post('/login', login);
router.get('/logout', validateJWT, hasARole('ADMIN', 'USER'), logOut);

module.exports = router;
