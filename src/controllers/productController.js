const Product = require('../models/productModel');
const { emptyFieldValidation } = require('../utils/validation');

const createProductController = async (req, res) => {
    try {
        const { title, price, category } = req.body;

        // empty field check kora
        emptyFieldValidation(res, title, price, category);

        // multer deys kono image upload hoise kina ... 
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one image..."
            });
        }

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

        // images upload korar jonno...
        const formattedImages = req.files.map((file, index) => {
            return {
                url: `/uploads/products/${file.filename}`,
                isMain: index === 0 // default first image isMain...
            }
        })

        const newProduct = new Product({
            ...req.body,
            sku: sku,
            images: formattedImages,
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

const getAllProductsController = async (req, res) => {
    try {
        const product = await Product.find({})
        return res.status(200).json({
            success: true,
            message: 'All products...',
            product: product
        })

    } catch (error) {
        console.log(error, 'Get All Products related error...');
        return res.status(500).json({ success: false, message: 'Server error...' })
    }
}

const getSingleProductController = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found...' })
        }
        return res.status(200).json({
            success: true,
            message: `Product details: ${product.title}, ${product.sku}`,
            product: product
        })


    } catch (error) {
        console.log(error, 'Get single Product related error...');
        return res.status(500).json({ success: false, message: 'Server error...' })
    }
}

const updateProductController = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found...' })
        }
        return res.status(200).json({
            success: true,
            message: 'Product updated successfully...',
            product: product
        })

    } catch (error) {
        console.log(error, 'Update Product related error...');
        return res.status(500).json({ success: false, message: 'Server error...' })
    }
}

const deleteProductController = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findByIdAndDelete(id)
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found...' })
        }
        return res.status(200).json({
            success: true,
            message: 'Product Deleted successfully...',

        })

    } catch (error) {
        console.log(error, 'Delete Product related error...');
        return res.status(500).json({ success: false, message: 'Server error...' })
    }
}

const updateMainImageController = async (req, res) => {
    try {
        const { productId, newMainImageId } = req.body;
        // find product step-1
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found...',
            })
        };
        // all image false korte hobe step-2
        let targetImage = false;

            // all image false korte hobe step-2
        product.images.forEach((image) => {
            if (image.isMain === true) {
                image.isMain = false
            }

            // new target image true korbe step-3
            if (image._id.toString() === newMainImageId) {
                image.isMain = true
                targetImage = true
            }
        });

        // targetImage ase kina check...
        if (!targetImage) {
            return res.status(404).json({
                success: false,
                message: "Target image ID not found"
            });
        };

        await product.save()

        return res.status(200).json({
            success: true,
            message: "Main image updated successfully...",
            images: product.images
        })

    } catch (error) {
        console.log(error, 'Update Main Image related error...');
        return res.status(500).json({ success: false, message: 'Server error...' })
    }
}


module.exports = { createProductController, getAllProductsController, getSingleProductController, updateProductController, deleteProductController, updateMainImageController }