const express = require('express');
const router = express.Router();

const { loadSignUp,
  loadLogin,
  registerValidation,
  userRegistration,
  login,
  loginCheck } = require('../controllers/userController');
const { stopLogin } = require('../middlewares/auth');




router.get('/', stopLogin, loadSignUp);

router.get("/login", stopLogin, loadLogin)

router.post("/register", registerValidation, userRegistration);
router.post('/loginuser', loginCheck, login);


module.exports = router;