var express = require('express');
var app = express();

var port = 23230;
var counter = 0;

app.get('/', function(req, res) {
    res.send('pong');
    counter++;
//    console.log('got new ping');
//    console.log('counter: ' + counter);
});

app.get('/counter/', function(req, res) {
    res.send(counter + '');
});

app.listen(port, function() {
    console.log('Ping-server listening on port ' + port);
});
