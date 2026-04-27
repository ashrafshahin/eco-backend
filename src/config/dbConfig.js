const mongoose = require('mongoose');

const dbConfig = () => {
    try {
        mongoose.connect(process.env.DATABASE_URL).then(() => {
            console.log('ecoBazaar database connected...');
        });
    } catch (error) {
        console.log('connection error');
        
    }

}

module.exports = dbConfig