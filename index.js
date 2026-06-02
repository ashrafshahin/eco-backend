// require('node:dns').setServers(['1.1.1.1','8.8.8.8'])

require('dotenv').config();
console.log('env file connected...')

const express = require('express');
const app = express();

const cors = require('cors')
const dbConfig = require('./src/config/dbConfig');

const { registrationController, loginController, forgotPasswordController, resetPasswordController, resendVerificationEmailController, verifyEmailController } = require('./src/controllers/authController');
const { registrationLimiter, loginLimiter, forgotPasswordLimiter, resetPasswordLimiter, resendVerificationEmailLimiter, varificationEmailLimiter } = require('./src/utils/limiter');
const { deleteDataController, updateUserDataController, getAllUsersController, singleUserDataController } = require('./src/controllers/userController');
const { createProductController, getAllProductsController, getSingleProductController, updateProductController, deleteProductController } = require('./src/controllers/productController');

//middleware
app.use(express.json());
app.use(cors())

// database config
dbConfig()

// Auth management...
app.post('/registration', registrationLimiter, registrationController);
app.post('/login', loginLimiter, loginController);
app.post('/forgotpassword', forgotPasswordLimiter, forgotPasswordController);
app.post('/resetpassword/:token', resetPasswordLimiter, resetPasswordController);
app.post('/resendverificationemail', resendVerificationEmailLimiter, resendVerificationEmailController);
app.post('/verifyemail/:token', varificationEmailLimiter, verifyEmailController)

// Product create...
app.post('/create-product', createProductController);
app.get('/get-all-products', getAllProductsController)
app.get('/get-single-product/:id', getSingleProductController)
app.post('/update-product/:id', updateProductController);
app.delete('/delete-product/:id', deleteProductController);


// Order management...

// User management...
app.get('/getallusers', getAllUsersController )
app.get('/getsingleuser/:id', singleUserDataController)

// get data
app.delete('/deleteuser/:id', deleteDataController)

// update 
app.post('/updateuser/:id', updateUserDataController)

// Vendor management...

// payment Integration...


const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server Running on port ${port} ...`);

});


