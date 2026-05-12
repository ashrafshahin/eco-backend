// require('node:dns').setServers(['1.1.1.1','8.8.8.8'])

require('dotenv').config();
console.log('env file connected...')

const express = require('express');
const app = express();

const cors = require('cors')
const dbConfig = require('./src/config/dbConfig');

const { registrationController, loginController, forgotPasswordController, resetPasswordController, resendVerificationEmailController, verifyEmailController } = require('./src/controllers/authController');
const { registrationLimiter, loginLimiter, forgotPasswordLimiter, resetPasswordLimiter, resendVerificationEmailLimiter, varificationEmailLimiter } = require('./src/utils/limiter');

//middleware
app.use(express.json());
app.use(cors())

// database config
dbConfig()

app.post('/registration', registrationLimiter, registrationController);
app.post('/login', loginLimiter, loginController);
app.post('/forgotpassword', forgotPasswordLimiter, forgotPasswordController);
app.post('/resetpassword/:token', resetPasswordLimiter, resetPasswordController);
app.post('/resendverificationemail', resendVerificationEmailLimiter, resendVerificationEmailController);
app.post('/verifyemail/:token', varificationEmailLimiter, verifyEmailController)



const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server Running on port ${port} ...`);

});


