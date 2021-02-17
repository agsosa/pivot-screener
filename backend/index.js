const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Endpoints
app.get('/', (req, res) => {
    res.send('OK');
});

app.get('/api/test', (req, res) => {
    res.send('OK');
    //res.json(data);
});

app.listen(port, () => console.log(`Backend listening on port ${port}`))