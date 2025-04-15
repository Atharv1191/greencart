
const express = require("express")
const authUser = require("../middelewere/authUser")
const { placeOrderCOD, getUserOrders, getAllOrders, placeOrderStripe } = require("../controllers/orderController");
const authSeller = require("../middelewere/authSeller");

const router = express.Router()

router.post('/cod',authUser,placeOrderCOD);
router.get('/user',authUser,getUserOrders);
router.get('/seller',authSeller,getAllOrders)
router.post('/stripe',authUser,placeOrderStripe)
module.exports = router