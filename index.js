const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('app created...')
});

app.listen(5000, () => {
    console.log('Server Connected to port 5000 ...');
    
});


