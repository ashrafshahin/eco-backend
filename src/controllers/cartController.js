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

const cartProductIncreDecreController = async (req, res) => {
    try {
        // let plus;
        // let minus;
        const { productId, userId } = req.params;
        const { type } = req.body;

        const cartItem = await Cart.findOne({ user: userId, product: productId });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart...",
            });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart...",
            });
        };

        if (type === 'plus') {
            cartItem.quantity += 1
            cartItem.totalPrice += product.price
            await cartItem.save()
        } else {
            cartItem.quantity -= 1
            cartItem.totalPrice -= product.price
            await cartItem.save()
        }

        return res.status(200).json({
            success: true,
            message: 'Cart updated successfully...',
            cart: cartItem,
        });


    } catch (error) {
        console.error('Cart Increment Decrement related error...,', error);
        return res.status(500).json({
            success: false,
            message: 'Cart Increment Decrement related Server Error... '
        });
    }
};

// cart e product ase kina? jodi thake delete korchi... //

const cartProductDeleteController = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const cartItem = await Cart.findOne({ user: userId, product: productId });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart...",
            });
        }

        await Cart.findByIdAndDelete(cartItem._id);

        res.status(200).json({
            success: true,
            message: 'Cart Product Deleted successfully...',
        })


    } catch (error) {
        console.error('Cart product delete related error...,', error);
        return res.status(500).json({
            success: false,
            message: 'Cart product delete related Server Error... '
        });
    }
};

const getCartProductController = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.find({ user: userId }).populate('product').populate('user');

        let totalPrice = 0;

        cart.map((item) => {
            totalPrice += item.totalPrice
        });

        res.status(200).json({
            success: true,
            message: 'All products on Cart...',
            user: userId,
            cart,
            totalPrice,
        });

    } catch (error) {
        console.error('Get Cart products related error...,', error);
        return res.status(500).json({
            success: false,
            message: 'Get Cart products related Server Error... '
        });
    }
}


module.exports = { createCartController, cartProductIncreDecreController, cartProductDeleteController, getCartProductController }