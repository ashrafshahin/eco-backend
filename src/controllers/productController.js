const Product = require('../models/productModel');
const { emptyFieldValidation } = require('../utils/validation');

const createProductController = async (req, res) => {
    try {
        const { title, price, category } = req.body;

        emptyFieldValidation(res, title, price, category);


        const existingTitle = await Product.findOne({ title });
        if (existingTitle) {
            return res.status(409).json({ success: false, message: 'Product can not be duplicated...' })
        }

        // custom SKU create korbe
        const sku = `Eco${new Date().getFullYear()}-${Date.now().toString().slice(-5)}-${Math.floor(100 + Math.random() * 900)}`;


        const existingSku = await Product.findOne({ sku });
        if (existingSku) {
            return res.status(409).json({ success: false, message: 'Product SKU can not be duplicated...' })
        }

        const newProduct = new Product({
            ...req.body,
            sku: sku
        })

        await newProduct.save()
        return res.status(201).json({
            success: true,
            message: 'New Product Uploaded successfully...',
            product: newProduct,
            
        })
        
    } catch (error) {
        console.log(error, 'New Product upload related error...');
        return res.status(500).json({ success: false, message: 'Server error...' })
    }
}


module.exports = {createProductController}