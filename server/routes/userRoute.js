const express = require("express")
const { register,login,isAuth,logout } = require("../controllers/userController");
const authUser = require("../middelewere/authUser");

const router = express.Router()


router.post('/register',register)
router.post('/login',login);
router.get('/is-Auth',authUser,isAuth);
router.get('/logout',authUser,logout)
module.exports = router;