
const express = require("express");
const authUser = require("../middelewere/authUser");
const { addAddress, getAddress } = require("../controllers/addressController");

const router = express.Router();

router.post('/add',authUser,addAddress);
router.get('/get',authUser,getAddress)
module.exports = router;