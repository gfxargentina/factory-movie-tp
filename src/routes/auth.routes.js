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

router.post('/register', register);
router.get('/user/verify/:user_id/:uniqueString', verifyEmail);
router.get('/verified', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/verify.html'));
});
router.post('/login', login);
router.get('/logout', validateJWT, hasARole('ADMIN', 'USER'), logOut);

module.exports = router;
