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

router.get('/:id', validateJWT, hasARole('ADMIN', 'USER'), getMovieById);
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
  hasARole('USER'),
  addFavouriteMovie
);
router.get(
  '/favorite',
  validateJWT,
  hasARole('ADMIN', 'USER'),
  getAllFavoritesMovies
);

router.put('/stock/:code', validateJWT, isAdminRole, updateMovieStock);

router.delete('/:code', validateJWT, isAdminRole, deleteMovie);

module.exports = router;
