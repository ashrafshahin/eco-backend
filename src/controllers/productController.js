const Product = require('../models/productModel');
const calculateSalePrice = require('../utils/calculateSalePrice');
const { emptyFieldValidation } = require('../utils/validation');
const mongoose = require('mongoose');
const Category = require('../models/categoryModel');

const createProductController = async (req, res) => {
    try {
        const { title, price, category, discount, tags, stock, discountType, discountStartDate, discountEndDate, isMain } = req.body;

        // empty field check kora
        emptyFieldValidation(res, title, price, category, discount, tags, stock, discountType, discountStartDate, discountEndDate, isMain);

        // multer deys kono image upload hoise kina ... 
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one image..."
            });
        };

        // isMain image select korar jonno...
        let images = [];
        req.files.map((item, index) => {
            images.push({
                url: item.path,
                isMain: isMain == index,
            });
        });

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

        // stock check kora..Stock 1 er kom hole error message delam...

        if (!stock || stock < 1) {
            return res.status(400).json({
                success: false,
                message: 'Stock must be greater than 0...',
            });
        };

        // Flat Discount, price er boro / minus figure hoye gele check korbe...
        if (discountType === 'flat') {
            if (price <= discount || discount < 0) {
                return res.status(400).json({
                success: false,
                message: 'Flat Discount must not be greater than the product price...',
            });
            }
        };

        // Percentage Discount, price er boro / minus figure hoye gele check korbe...
        if (discountType === 'percentage') {
            if (discount >= 100 || discount < 0 ) {
                return res.status(400).json({
                success: false,
                message: 'Percentage Discount must not be greater than the product price...',
            });
            };
        };

        if (price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Product price must be greater than 0...',
            });
        };

        // Discount Date related work... discountStartDate, discountEndDate check korbe...
        
        const startDate = new Date(discountStartDate);
        const endDate = new Date(discountEndDate);

        // const currentDate = new Date();
        // currentDate.setHours(0, 0, 0, 0);

        // const start = new Date(startDate);
        // start.setHours(0, 0, 0, 0);

        // const end = new Date(endDate);
        // end.setHours(0, 0, 0, 0);
        
        if (new Date().setHours(0, 0, 0, 0) > startDate.setHours(0, 0, 0, 0)) {
            return res.status(400).json({
                success: false,
                message: 'Start date must not be in the past..., startDate currentDate er age hobe na...',
            });
        };

        if (new Date().setHours(0, 0, 0, 0) > endDate.setHours(0, 0, 0, 0)) {
            return res.status(400).json({
                success: false,
                message: 'End date must not be in the past..., endDate currentDate er age hobe na...',
            });
        };

        // End date cannot be before start date
        if (endDate.setHours(0, 0, 0, 0) < startDate.setHours(0, 0, 0, 0)) {
            return res.status(400).json({
                success: false,
                message: 'End date must be greater than or equal to start date...',
            });
        }

        const newProduct = new Product({
            ...req.body,
            tags: tags.split(','),
            sku: sku,
            images: images,
            
        });

        await newProduct.save()
        return res.status(201).json({
            success: true,
            message: 'New Product Uploaded successfully...',
            product: newProduct,

        });

    } catch (error) {
        console.log(error, 'New Product upload related error...');
        return res.status(500).json({ success: false, message: ' New Product Create / upload Server error...' })
    }
};

const createProductCategory = async (req, res) => {
    console.log("req.body ki ase :", req.body);
    try {
        const { catTitle, slug } = req.body;
        if (!catTitle) {
            return res.status(400).json({
                success: false,
                message: "Product category name is required..."
            });
        };

        const category = new Category({
            catTitle: catTitle,
            slug: slug,
        });

        await category.save();

        return res.status(201).json({
            success: true,
            message: 'Product Category cteated...',
            category: category,

        });
        
        
    } catch (error) {
        console.log(error, 'Product Category create related error...');
        return res.status(500).json({
            success: false,
            message: 'Product Category create Server error...'
        });
    }
};

const getProductCategory = async (req, res) => {
    try {
        const category = await Category.find({});
        return res.status(200).json({
            success: true,
            message: 'All products Categories...',
            category: category,
        });
        
    } catch (error) {
        console.log(error, 'Get CAtegory of Products related error...');
        return res.status(500).json({
            success: false,
            message: ' Get CAtegory of Products Server error...'
        });
    };
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


module.exports = { createProductController, getAllProductsController, getSingleProductController, updateProductController, deleteProductController, updateMainImageController, createProductCategory, getProductCategory }