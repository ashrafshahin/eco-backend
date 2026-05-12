// require('node:dns').setServers(['1.1.1.1','8.8.8.8'])

require('dotenv').config();
console.log('env file connected...')

const express = require('express');
const app = express();

const cors = require('cors')
const dbConfig = require('./src/config/dbConfig');

const { registrationController, loginController, forgotPasswordController, resetPasswordController, resendVerificationEmailController, verifyEmailController } = require('./src/controllers/authController');

//middleware
app.use(express.json());
app.use(cors())

// database config
dbConfig()

app.post('/registration', registrationController);
app.post('/login', loginController);
app.post('/forgotpassword', forgotPasswordController);
app.post('/resetpassword/:token', resetPasswordController);
app.post('/resendverificationemail', resendVerificationEmailController);
app.post('/verifyemail/:token', verifyEmailController)



const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server Running on port ${port} ...`);

});


