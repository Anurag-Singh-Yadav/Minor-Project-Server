const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Middleware
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Set the maximum request body size to 50MB
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cookieParser());

const BASE_URL = process.env.BASE_URL || '/';
const PORT = process.env.PORT || 4000 ;

require('./config/database').dbConnect();

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.use('/get-results' , require('./routers/getResults'));

app.use('/updates' , require('./routers/updates'));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

app.get('/', (req, res) => {
    
});
