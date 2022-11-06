const { Router } = require('express');
const {
  getAllMovies,
  getAllMoviesDetails,
  addNewMovie,
  addFavouriteMovie,
  getAllFavoritesMovies,
} = require('../controllers/movie.controller');
const validateJWT = require('../middlewares/validate-jwt');
const { isAdminRole, hasARole } = require('../middlewares/validate-role');

const router = Router();

router.get('/', validateJWT, hasARole('USER'), getAllMovies);
router.get('/details', validateJWT, hasARole('USER'), getAllMoviesDetails);
router.post('/', validateJWT, hasARole('USER'), addNewMovie);
router.post(
  '/favorite/:code',
  validateJWT,
  hasARole('USER'),
  addFavouriteMovie
);
router.get('/favorite', validateJWT, hasARole('USER'), getAllFavoritesMovies);

module.exports = router;
