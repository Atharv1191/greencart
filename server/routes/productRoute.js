
const express = require("express");
const upload = require("../configs/multer");
const authSeller = require("../middelewere/authSeller");
const { addProduct, productlist, productById, changeStock } = require("../controllers/productController");

const router = express.Router();

router.post('/add', upload.array(["images"]), authSeller, addProduct);

router.get('/list',productlist)
router.get('/id',productById)
router.post('/stock',authSeller,changeStock)
module.exports = router;