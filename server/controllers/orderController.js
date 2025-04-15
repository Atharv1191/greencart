const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User")
require('dotenv').config();  // Ensure this is at the top of your entry file, like server.js

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Place Order - COD (Cash on Delivery)
const placeOrderCOD = async (req, res) => {
    try {
        const userId = req.userId;
        console.log(userId)
        const { items, address } = req.body;

        if (!userId || !address || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Missing or invalid data (userId, items, or address)"
            });
        }

        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found with ID: ${item.product}`
                });
            }
            amount += product.offerPrice * item.quantity;
        }

        amount += Math.floor(amount * 0.02); // 2% tax

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD"
        });

        return res.status(200).json({
            success: true,
            message: "Order placed successfully"
        });

    } catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Place Order - Stripe (Online Payment)
const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.userId;
        console.log(userId)
        const { items, address } = req.body;
        const { origin } = req.headers;

        if (!userId || !address || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Missing or invalid data (userId, items, or address)"
            });
        }

        let productData = [];
        let amount = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found with ID: ${item.product}`
                });
            }
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity
            });
            amount += product.offerPrice * item.quantity;
        }

        amount += Math.floor(amount * 0.02); // 2% tax

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online"
        });

        const line_items = productData.map((item) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name
                },
                unit_amount: Math.floor((item.price * 1.02) * 100)


            },
            quantity: item.quantity
        }));

        // Creating the checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],  // Ensure 'card' is added to payment methods
            line_items,
            mode: 'payment',
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId
            }
        });

        return res.status(200).json({
            success: true,
            sessionUrl: session.url
        });

    } catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Stripe Webhooks to verify Payments 

const StripeWebhooks = async(request,response)=>{
    const stripeInstance = stripe;
    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return response.status(400).send(`webhook error: ${error.message}`);
        
    }
    //handle the event
    switch (event.type) {
        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            //getting session metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent:paymentIntentId,
            });

            const {orderId,userId} = session.data[0].metadata;
            //Mark  payment as paid

            await Order.findByIdAndUpdate(orderId,{isPaid:true})
            //clear cart data of user
            await User.findByIdAndUpdate(userId,{cartItems:{}})
            break;
        }
         case "payment_intent.payment_failed":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            //getting session metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent:paymentIntentId,
            });

            const {orderId} = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId);
            break;
         } 

        default:
            console.error(`unhandaled event type ${event.type}` )
            break;
    }
response.json({
    received:true
})
}

// Get Orders by User ID
const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        console.log(userId)
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authorized",
            });
        }

        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate({
            path: 'items.product', // Populate the product details (including image)
            select: 'name category offerPrice image' // You can specify which fields to populate (name, category, offerPrice, image)
        })
       
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Orders for Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address")
          .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    placeOrderCOD,
    placeOrderStripe,
    getUserOrders,
    getAllOrders,
    StripeWebhooks
};