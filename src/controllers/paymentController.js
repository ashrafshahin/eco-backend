const { axios } = require("axios");

const paymentController = async (req, res) => {
    try {
        const tran_id = `TXN-${Date.now()}-${Math.floor(
            Math.random() * 10000
        )}`;
        const paymentData = {
            store_id: "aamarpaytest",
            tran_id: tran_id,
            success_url: "http://www.merchantdomain.com/successpage.html",
            fail_url: "http://www.merchantdomain.com/failedpage.html",
            cancel_url: "http://www.merchantdomain.com/cancelpage.html",
            amount: "10.0",
            currency: "BDT",
            signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
            desc: "Merchant Registration Payment",
            cus_name: "Name",
            cus_email: "payer@merchantcustomer.com",
            cus_add1: "House B-158 Road 22",
            cus_add2: "Mohakhali DOHS",
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1206",
            cus_country: "Bangladesh",
            cus_phone: "+8801704",
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

        return res.status(200).json({
            success: true,
            data: response.data,
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