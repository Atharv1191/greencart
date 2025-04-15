
// const jwt = require('jsonwebtoken')
// const authUser = async(req,res,next)=>{

//     const {token} = req.cookies;
//     console.log("Token found:", token);
//     console.log("JWT_SECRET:", process.env.JWT_SECRET);
//     if(!token){
//         return res.status(401).json({
//             success:false,
//             message:"Not Authorized"
//         })
//     }
//     try {
//         const tokenDecode = jwt.verify(token,process.env.JWT_SECRET)
//         if(tokenDecode.id){
//             req.userId = tokenDecode.id;

//         }else{
//             return res.status(401).json({
//                 success:false,
//                 message:"Not Authorized"
//             })
//         }
//         next();  
//     } catch (error) {
//         console.log("JWT Verify Error:", error.name, error.message);
        
//         return res.status(401).json({
//             success:false,
//             message: error.name === "TokenExpiredError"
//             ? "Token expired"
//             : "Invalid token",

//         })
        
//     }

// }
// module.exports = authUser;
const jwt = require('jsonwebtoken');

const authUser = async (req, res, next) => {
    // Extract token from cookies
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized, No Token Provided"
        });
    }

    try {
        // Verify the token using JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If the token has a valid ID, attach it to the request object
        if (decoded.id) {
            req.userId = decoded.id;
        } else {
            return res.status(401).json({
                success: false,
                message: "Not Authorized, Invalid Token"
            });
        }

        // Continue with the next middleware or route handler
        next();
    } catch (error) {
        console.log(error);

        // Handle token verification errors (e.g., expired token)
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

module.exports = authUser;
