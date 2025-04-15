
const jwt = require("jsonwebtoken")
//seller Login

const sellerLogin =async(req,res)=>{
    try {
        const {email,password} = req.body;

    if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
        const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('sellerToken',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production', //use secure cookie in production
            sameSite:process.env.NODE_ENV === 'production'?'none':'strict',
            maxAge:7*24*60*1000

        })
        return res.json({
            success:true,
            message:'Seller logged in successfully',
        })
    }else{
        return res.status(400).json({
            success:false,
            message:'Invalid email or password',
        })
    
    }
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })

        
    }
}
//seller is Auth

const isSellerAuth = async (req, res) => {
    try {
    
        return res.status(200).json({
            success: true
            
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//seller logout

const SellerLogout = async(req,res)=>{
    try {
        res.clearCookie('sellerToken',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production'?'none':'strict',
        });
        return res.status(200).json({
            success:true,
            message:'Logged out successfully'
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
module.exports ={sellerLogin,isSellerAuth,SellerLogout}