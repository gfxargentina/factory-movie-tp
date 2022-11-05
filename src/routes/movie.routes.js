const { Router } = require('express');
const { getAllMovies } = require('../controllers/movie.controller');
const validateJWT = require('../middlewares/validate-jwt');
const { isAdminRole, hasARole } = require('../middlewares/validate-role');

const router = Router();

router.get('/', validateJWT, hasARole('USER'), getAllMovies);

module.exports = router;
