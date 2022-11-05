const { Router } = require('express');
const movieRent = require('../controllers/rental.controller');
const validateJWT = require('../middlewares/validate-jwt');
const { isAdminRole, hasARole } = require('../middlewares/validate-role');

const router = Router();

router.post('/:code', validateJWT, hasARole('USER'), movieRent);

module.exports = router;
