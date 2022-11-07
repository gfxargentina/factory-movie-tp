const { Router } = require('express');
const {
  login,
  register,
  verifyEmail,
} = require('../controllers/auth.controller');
const path = require('path');

const router = Router();

router.post('/register', register);
router.get('/user/verify/:user_id/:uniqueString', verifyEmail);
router.get('/verified', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/verify.html'));
});
router.post('/login', login);

module.exports = router;
