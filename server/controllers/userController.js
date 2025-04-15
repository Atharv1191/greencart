

//register User

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const register = async(req,res)=>{
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"Missing details"
            })
        }
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        const hashesPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            email,
            password:hashesPassword
        })
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production', //use secure cookie in production
            sameSite:process.env.NODE_ENV === 'production'?'none':'strict',
            maxAge:7*24*60*1000

        })
        return res.status(201).json({
            success:true,
            user:{email:user.email,name:user.name}
        })
           
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }

}

// Login User

const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Email and password are required"
            })
        }
        const user = await User.findOne({email})
        if(!email){
            return res.status(400).json({
                success:false,
                message:"Invalid email or password"
            })
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid email or password"
            })
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production', //use secure cookie in production
            sameSite:process.env.NODE_ENV === 'production'?'none':'strict',
            maxAge:7*24*60*1000

        })
        return res.status(201).json({
            success:true,
            user:{email:user.email,name:user.name}
        })
        
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}

// check Auth

const isAuth = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//logout user

const logout = async(req,res)=>{
    try {
        res.clearCookie('token',{
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
module.exports = {register,login,isAuth,logout}