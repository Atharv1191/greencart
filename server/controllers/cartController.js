
const User = require("../models/User");
//update User CartData
const updateCart = async(req,res)=>{
    try {
        const {userId,cartItems} = req.body;
        await User.findByIdAndUpdate(userId,{cartItems})
        return res.status(200).json({
            success:true,
            message:"Cart updated successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}
module.exports = {updateCart}