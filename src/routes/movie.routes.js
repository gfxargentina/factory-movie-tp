const { Router } = require('express');
const {
  getMovieById,
  getAllMovies,
  getAllMoviesDetails,
  addNewMovie,
  addFavouriteMovie,
  getAllFavoritesMovies,
  deleteMovie,
  updateMovieStock,
} = require('../controllers/movie.controller');
const validateJWT = require('../middlewares/validate-jwt');
const { isAdminRole, hasARole } = require('../middlewares/validate-role');

const router = Router();

/**
 * @openapi
 * components:
 *  schemas:
 *   Movie:
 *    type: object
 *    properties:
 *     title:
 *      type: string
 *      description: movie title
 *     release_date:
 *      type: string
 *      description: movie premiere
 *
 */

/**
 *@openapi
 * /movie:
 *  get:
 *    tags: [GetAllMovies]
 *    summary: Get All movies
 *    description: show all the movies for rent
 *    responses:
 *      200:
 *        description: Successful operation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Movie'
 */

router.get('/', getAllMovies);
router.get(
  '/details',
  validateJWT,
  hasARole('ADMIN', 'USER'),
  getAllMoviesDetails
);
router.post('/', validateJWT, hasARole('ADMIN', 'USER'), addNewMovie);
router.post(
  '/favorite/:code',
  validateJWT,
  hasARole('ADMIN', 'USER'),
  addFavouriteMovie
);

/**
 * @openapi
 * components:
 *  securitySchemes:
 *   bearerAuth:            # arbitrary name for the security scheme
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 *  schemas:
 *   FavoriteMovies:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      description: movie id
 *     movie_code:
 *      type: string
 *      description: movie premiere
 *     UserId:
 *      type: integer
 *     review:
 *      type: string
 *      description: user movie review
 *
 *
 */

/**
 *@openapi
 * /movie/favorite:
 *  get:
 *    tags: [GetAllFavoritesMovies]
 *    summary: Get All Favorites Movies
 *    description: show all the favorites movies
 *    responses:
 *      200:
 *        description: Successful operation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/FavoriteMovies'
 *    security:
 *     - bearerAuth: []
 */
router.get(
  '/favorite',
  validateJWT,
  hasARole('ADMIN', 'USER'),
  getAllFavoritesMovies
);

router.get('/:id', validateJWT, hasARole('ADMIN', 'USER'), getMovieById);

router.put('/stock/:code', validateJWT, isAdminRole, updateMovieStock);

router.delete('/:code', validateJWT, isAdminRole, deleteMovie);

module.exports = router;
