
const  express = require('express');
const authUser = require('../middelewere/authUser');
const { updateCart } = require('../controllers/cartController');


const router = express.Router();

router.post('/update',authUser,updateCart)

module.exports =  router;