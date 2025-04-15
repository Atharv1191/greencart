
// //add Address

// const Address = require("../models/Address");

// const addAddress = async(req,res)=>{
//     try {
//         const {userId,address} = req.userId;
//         await Address.create({...address,userId})
//         return res.status(200).json({
//             success:true,
//             message:"Address Added Successfully",
//         })
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({
//             success:false,
//             message:error.message
//         })
        
//     }
// }

// //get Address
// const getAddress = async(req,res)=>{
//     try {
//         const {userId} = req.userId;
//         const addresses = await Address.find({userId})
//         return res.status(200).json({
//             success:true,
//             addresses,
//             message:"Address Added Successfully",
//         })
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({
//             success:false,
//             message:error.message
//         })
        
//     }
// }
// module.exports = {addAddress,getAddress}

const Address = require("../models/Address");

// Add Address
const addAddress = async (req, res) => {
    try {
        const { address } = req.body;
        await Address.create({ ...address, userId: req.userId });
        return res.status(200).json({
            success: true,
            message: "Address Added Successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Address
const getAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const addresses = await Address.find({ userId });
        return res.status(200).json({
            success: true,
            addresses,
            message: "Addresses Fetched Successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { addAddress, getAddress };
