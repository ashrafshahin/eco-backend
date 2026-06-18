const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

const createCartController = async (req, res) => {
    try {
        const { productId } = req.body;
        const { userId } = req.params;

        // Product exists?
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found...'
            });
        };

        // User exists?
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found...'
            });
        };

        // Update Cart or Create New Cart for choosen User..
        const existingProductsOnCart = await Cart.findOne({ user: userId, product: productId });
       
        let cart;
        
        // user sathe product jodi mele jai unit and price barbe...
        if (existingProductsOnCart) {
            
            // akta product add holo...
            existingProductsOnCart.quantity += 1;
            
            // akta product er price total price er sathe add holo...
            existingProductsOnCart.totalPrice += existingProduct.price;
            
            await existingProductsOnCart.save()

            cart = existingProductsOnCart;

        } else {
            const newCart = new Cart({
                user: userId,
                product: productId,
                quantity: 1,
                totalPrice: existingProduct.price,
                
            });
            await newCart.save();

            cart = newCart;
        };


        return res.status(200).json({
            success: true,
            message: 'Product successfully added on cart... ',
            cart
        });

    } catch (error) {
        console.log('Cart create related error...,', error);
        return res.status(500).json({
            success: false,
            message: 'Cart create related Server Error... '
        });
    }
};


module.exports = {createCartController, }