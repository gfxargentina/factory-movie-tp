const { Router } = require('express');
const {
  getMovieById,
  getAllMovies,
  getAllMoviesDetails,
  addNewMovie,
  addFavouriteMovie,
  getAllFavoritesMovies,
  deleteMovie,
} = require('../controllers/movie.controller');
const validateJWT = require('../middlewares/validate-jwt');
const { isAdminRole, hasARole } = require('../middlewares/validate-role');

const router = Router();

router.get('/:id', validateJWT, hasARole('USER'), getMovieById);
router.get('/', getAllMovies);
router.get('/details', validateJWT, hasARole('USER'), getAllMoviesDetails);
router.post('/', validateJWT, hasARole('USER'), addNewMovie);
router.post(
  '/favorite/:code',
  validateJWT,
  hasARole('USER'),
  addFavouriteMovie
);
router.get('/favorite', validateJWT, hasARole('USER'), getAllFavoritesMovies);
router.delete('/:code', validateJWT, isAdminRole, deleteMovie);

module.exports = router;
