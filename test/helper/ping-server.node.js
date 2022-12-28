const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const port = 23230;
let counter = 0;

app.get('/', function (req, res) {
    console.log('recieved ping');
    res.send('pong');
    counter++;
    console.log('got new ping');
    console.log('counter: ' + counter);
});

app.get('/counter/', function (req, res) {
    res.send(counter + '');
});

app.get('/json/', function (req, res) {
    res.send(JSON.stringify({
        counter
    }));
});

app.listen(port, function () {
    console.log('Ping-server listening on port ' + port);
});
