const Product = require('../models/Product');

const cloudinary = require('cloudinary').v2;

//add product
const addProduct = async(req,res)=>{
    try {
        let productData = JSON.parse(req.body.productData)
        const images = req.files

        let imagesUrl = await Promise.all(
            images.map(async(item)=>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )

        await Product.create({...productData,image:imagesUrl})
        return res.status(200).json({
            success:true,
            message:'Product added successfully'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }

}

//product-list
const productlist = async(req,res)=>{
    try {
        const products = await Product.find({})
        return res.status(200).json({
            success:true,
            products
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }   

}

//get single product
const productById = async(req,res)=>{
    try {
        const {id} = req.body;
        const product = await Product.findById(id)
        return res.status(200).json({
            success:true,
            product
        })
    } catch (error) {
        console.log(error)
       
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }

}

//change product in  stock
const changeStock = async(req,res)=>{
    try {
        const {id,inStock} = req.body
        const product = await Product.findByIdAndUpdate(id,{inStock},{new:true})
        return res.status(200).json({
            success:true,
            product,
            message:"Stock Updated"
            
        })
    } catch (error) {
        
        console.log(error)
       
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }

}
module.exports ={addProduct,productlist,productById,changeStock}