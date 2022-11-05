const { Router } = require('express');
const {
  getAllUserRentals,
  allUserMovies,
} = require('../controllers/user.controller');
const validateJWT = require('../middlewares/validate-jwt');
const { isAdminRole, hasARole } = require('../middlewares/validate-role');

const router = Router();

router.get('/', validateJWT, hasARole('USER'), getAllUserRentals);
router.get('/rentals', validateJWT, hasARole('USER'), allUserMovies);

module.exports = router;
