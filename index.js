const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Middleware
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

const BASE_URL = process.env.BASE_URL || '/';
const PORT = process.env.PORT || 7000 ;

require('./config/database').dbConnect();

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.use('/get-results' , require('./routers/getResults'));

app.use('/update-details' , require('./routers/updates'));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('<h1>InterviewExpress</h1>');
});
