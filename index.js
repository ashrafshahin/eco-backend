require('dotenv').config();
console.log('env file connected...')

const express = require('express');
const app = express();

const cors = require('cors')
const dbConfig = require('./src/config/dbConfig');

const { registrationController, loginController } = require('./src/controllers/authController');

//middleware
app.use(express.json());
app.use(cors())

// database config
dbConfig()

app.post('/registration', registrationController);
app.post('/login', loginController);

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server Running on port ${port} ...`);
    
});


