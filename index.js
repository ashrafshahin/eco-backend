// require('node:dns').setServers(['1.1.1.1','8.8.8.8'])

require('dotenv').config();
console.log('env file connected...')

const express = require('express');
const app = express();

const cors = require('cors')
const dbConfig = require('./src/config/dbConfig');

// image er path...
const { upload } = require('././src/middlewares/multerMiddleware')
const path = require('path')
app.use('/upload/products', express.static(path.join(__dirname, 'upload/products)')));

const { registrationController, loginController, forgotPasswordController, resetPasswordController, resendVerificationEmailController, verifyEmailController } = require('./src/controllers/authController');
const { registrationLimiter, loginLimiter, forgotPasswordLimiter, resetPasswordLimiter, resendVerificationEmailLimiter, varificationEmailLimiter } = require('./src/utils/limiter');
const { deleteDataController, updateUserDataController, getAllUsersController, singleUserDataController, getAllDeleteUsersController, getAllActiveUsersController } = require('./src/controllers/userController');
const { createProductController, getAllProductsController, getSingleProductController, updateProductController, deleteProductController, updateMainImageController } = require('./src/controllers/productController');
const { createCartController, cartProductIncreDecreController, cartProductDeleteController, getCartProductController } = require('./src/controllers/cartController');
const { paymentController } = require('./src/controllers/paymentController');

//middleware
app.use(express.json());
app.use(cors())

// database config
dbConfig()

// Auth management...
app.post('/registration', registrationLimiter, registrationController);
app.post('/login', loginLimiter, loginController);
app.post('/forgot-password', forgotPasswordLimiter, forgotPasswordController);
app.post('/reset-password/:token', resetPasswordLimiter, resetPasswordController);
app.post('/resend-verification', resendVerificationEmailLimiter, resendVerificationEmailController);
app.post('/verify-email/:token', varificationEmailLimiter, verifyEmailController)

// Standard RESTful API Design... Product create...
app.post('/create-product', upload.array('images', 5), createProductController);
app.put('/update-product/:id', upload.array('images', 5), updateProductController);
app.patch('/update-main-image/:id', updateMainImageController);

app.get('/get-all-products', getAllProductsController)
app.get('/get-single-product/:id', getSingleProductController)
app.delete('/delete-product/:id', deleteProductController);

// Cart management
app.post('/create-cart/:userId', createCartController);
app.post('/update-cart/:userId/:productId', cartProductIncreDecreController);
app.delete('/delete-cart-product/:userId/:productId', cartProductDeleteController);
app.get('/cart/:userId', getCartProductController)



// Order management...
app.post('/payment', paymentController)
app.get('/get-order', )

// User management...
app.get('/getallusers', getAllUsersController )
app.get('/getsingleuser/:id', singleUserDataController)

// get data
app.delete('/deleteuser/:id', deleteDataController)
app.get('/alldeletedusers', getAllDeleteUsersController)
app.get('/allactiveusers', getAllActiveUsersController)

// update 
app.post('/updateuser/:id', updateUserDataController)

// Vendor management...

// payment Integration...


const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server Running on port ${port} ...`);

});


