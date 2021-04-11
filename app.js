const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const useragent = require('express-useragent');
const requestIp = require('request-ip');

require('dotenv').config();

const app = express();

app.use(useragent.express())
app.use(requestIp.mw())
app.use(express.urlencoded({ extended: true, limit: '15mb' }))
app.use(express.json())
app.use(fileUpload());
app.use(cors());


app.get('/', (req, res) => {
    return res.status(404).send({
        'error': 'resource not found!'
    });
})

app.listen(3015, () => {
    console.log('Server started on port 3015');
})