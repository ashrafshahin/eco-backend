const Product = require('../models/productModel');
const calculateSalePrice = require('../utils/calculateSalesPrice');
const { emptyFieldValidation } = require('../utils/validation');
const mongoose = require('mongoose');

const createProductController = async (req, res) => {
    try {
        const { title, price, category, discount } = req.body;

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
        };

        // custom SKU create korbe
        const sku = `Eco${new Date().getFullYear()}-${Date.now().toString().slice(-5)}-${Math.floor(100 + Math.random() * 900)}`;


        const existingSku = await Product.findOne({ sku });
        if (existingSku) {
            return res.status(409).json({ success: false, message: 'Product SKU can not be duplicated...' })
        };

        // images upload korar jonno...
        const formattedImages = req.files.map((file, index) => {
            return {
                url: `/uploads/products/${file.filename}`,
                isMain: index === 0 // default first image isMain...
            }
        })

        // Discount Price work... did this for form data format...
        
        let parsedDiscount = discount;

        if (typeof discount === "string") {
            try {
                parsedDiscount = JSON.parse(discount);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid discount format..."
                });
            };
        };

        // const salePrice = calculateSalePrice(price, discount);
        const salePrice = calculateSalePrice(Number(price), parsedDiscount);

        const newProduct = new Product({
            ...req.body,
            discountPrice: parsedDiscount, 
            sku,
            images: formattedImages,
            salePrice,
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
};

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
};

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
};

const updateProductController = async (req, res) => {
    try {
        const { id } = req.params
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found...'
            })
        };

        // update data... Discount related work... //
        const updateData = { ...req.body };

        let parsedDiscount = updateData.discount;

        if (typeof parsedDiscount === 'string') {
            try {
                parsedDiscount = JSON.parse(parsedDiscount);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid discount format..."
                });
            };
        };

        // নতুন value থাকলে সেটা ব্যবহার করবে, না থাকলে database - এর পুরনো value ব্যবহার করবে।
        const price = Number(updateData.price ?? existingProduct.price);
        const discount = parsedDiscount ?? existingProduct.discountPrice;

        updateData.discountPrice = discount;
        updateData.salePrice = calculateSalePrice(price, discount);
        
        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            {
                returnDocument: "after",
                runValidators: true,
            },
        );

        return res.status(200).json({
            success: true,
            message: 'Product updated successfully...',
            product: product
        })

    } catch (error) {
        console.log(error, 'Update Product related error...');
        return res.status(500).json({ success: false, message: 'Server error...' })
    }
};

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
};

const updateMainImageController = async (req, res) => {
    try {
        console.log(req.body, 'request e ki ase....');
        const { id } = req.params; // image er id dhora hoitese
        const { newMainImageId } = req.body;
        // find product step-1
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found...',
            })
        };
        // MongoDB invalid id check before sending it to Database...
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Product ID...',
            });
        };
        if (!mongoose.Types.ObjectId.isValid(newMainImageId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Image ID...',
            });
        };

        // all image false korte hobe step-2
        let targetImage = false;

        // all image false korte hobe step-2
        product.images.forEach((image) => {
            image.isMain = false

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
};


module.exports = { createProductController, getAllProductsController, getSingleProductController, updateProductController, deleteProductController, updateMainImageController }