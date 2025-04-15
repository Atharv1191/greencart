
const express = require("express")
const { sellerLogin, isSellerAuth, SellerLogout } = require("../controllers/sellerController");
const authSeller = require("../middelewere/authSeller");

const router = express.Router()

router.post('/login',sellerLogin);
router.get('/is-auth',authSeller,isSellerAuth);
router.get('/logout',SellerLogout)

module.exports = router;

