const axios = require('axios');
const Cart = require('../models/cartModel');

const paymentController = async (req, res) => {
    try {
        const { userId, amount, cus_name, cus_email, cus_add1, cus_add2, cus_city, cus_state, cus_postcode, cus_phone } = req.body;
        
        const cart = await Cart.find({ user: userId }).populate('product');
        
        let totalPrice = 0

        cart.map((item) => {
            totalPrice += item.totalPrice
        });
        console.log(totalPrice);

        
        // transaction ID generate for Development...
        const tran_id = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        
        if (!amount || !cus_name || !cus_email || !cus_phone) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing..."
            });
        };
        const paymentData = {
            store_id: process.env.AAMARPAY_STORE_ID,
            tran_id: tran_id,
            success_url: `${process.env.SERVER_URL}/api/payment/success`,
            fail_url: `${process.env.SERVER_URL}/api/payment/fail`,
            cancel_url: `${process.env.SERVER_URL}/api/payment/cancel`,
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

        console.log(response.data);

        return res.status(200).json({
            success: true,
            data: response.data,
            userId,
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