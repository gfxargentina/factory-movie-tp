const { Router } = require('express');
const {
  getAllUserRentals,
  allUserMovies,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');
const validateJWT = require('../middlewares/validate-jwt');
const { isAdminRole, hasARole } = require('../middlewares/validate-role');

const router = Router();

router.get('/', validateJWT, hasARole('ADMIN', 'USER'), getAllUserRentals);
router.get('/rentals', validateJWT, hasARole('ADMIN', 'USER'), allUserMovies);
router.put('/:id', validateJWT, hasARole('ADMIN', 'USER'), updateUser);
router.delete('/:id', validateJWT, isAdminRole, deleteUser);

module.exports = router;
