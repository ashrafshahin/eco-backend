const axios = require('axios');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const calculateSalePrice = require('../utils/calculateSalePrice');

// aitai orderController...
const paymentController = async (req, res) => {
    try {
        const { userId, amount, cus_name, cus_email, cus_add1, cus_add2, cus_city, cus_state, cus_postcode, cus_phone } = req.body;

        const cart = await Cart.find({ user: userId }).populate('product');
        
        if (!cart || cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty...'
            });
        };

        let totalPrice = 0
        let product = []

        // cart e emon product ase jaite stock e nai...
        for (const item of cart) {
            if (!item.product) {
                return res.status(404).json({
                    success: false,
                    message: 'A product in your cart no longer exists...',
                });
            };
            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for ${item.product.title}...`,
                });
            };
        

        const effectiveUnitPrice = calculateSalePrice(item.product.price, item.product.discountPrice);
        const itemTotal = effectiveUnitPrice * item.quantity;

            product.push({
                title: item.product.title,
                price: item.product.price,
                sku: item.product.sku,
                description: item.product.description,
                stock: item.product.stock,
                images: item.product.images,
                category: item.product.category,
                status: item.product.status,
                quantity: item.quantity,

                discountPrice: effectiveUnitPrice,
                totalPrice: itemTotal,
                
            });

            totalPrice += itemTotal;

        };
        // console.log(product);
        // console.log(itemTotal);

        // === payment gateway work starts ==== //

        // transaction ID generate for Development...
        const tran_id = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        if (!amount || !cus_name || !cus_email || !cus_phone) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing..."
            });
        };
        // now guaranteed discount-accurate, in total price...
        const paymentData = {
            store_id: process.env.AAMARPAY_STORE_ID,
            tran_id: tran_id,
            success_url: `${process.env.SERVER_URL_SUCCESS}/api/payment/success`,
            fail_url: `${process.env.SERVER_URL_FAIL}/api/payment/fail`,
            cancel_url: `${process.env.SERVER_URL_CANCEL}/api/payment/cancel`,
            amount: totalPrice,
            currency: "BDT",
            signature_key: process.env.AAMARPAY_SIGNATURE_KEY,
            desc: "Merchant Registration Payment",
            cus_name: cus_name,
            cus_email: cus_email,
            cus_add1: cus_add1,
            cus_add2: cus_add2,
            cus_city: cus_city,
            cus_state: cus_state,
            cus_postcode: cus_postcode,
            cus_country: "Bangladesh",
            cus_phone: cus_phone,
            type: "json",
        };

        const response = await axios.post(
            "https://sandbox.aamarpay.com/jsonpost.php",
            paymentData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.data.result) {
            return res.status(400).json({
                success: false,
                message: "Payment initialization failed...",
                data: response.data
            });
        };
        // console.log(response.data);

        // === payment gateway work ends ==== //

        // Order save work... Saving to MongoDB...starts
        const order = await Order.create({
            user: userId,
            products: product,
            cartSubTotal: totalPrice,
            tranId: tran_id,
        });
        
        console.log(order);
        
        // Order save work... Saving to MongoDB...//ends

        return res.status(200).json({
            success: true,
            data: response.data,
            userId,
            product,
            cartSubTotal: totalPrice
        });


    } catch (error) {
        console.error(error.response?.data || error.message);

        return res.status(500).json({
            success: false,
            message: "Payment initialization failed",
            error: error.response?.data || error.message,
        });
    }
};

module.exports = { paymentController };