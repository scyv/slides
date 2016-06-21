var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/revealjs', express.static(__dirname + '/node_modules/reveal.js/'));


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var masterId = null;

io.on('connection', function (socket) {
    var clientId = socket.client.id;
    if (!masterId) {
        masterId = clientId;
        console.log('master is ' + masterId);
    }
    console.log('client connected: ' + clientId);
    socket.on('message', function (msg) {
        if (masterId === clientId) {
            console.log(msg);
            io.emit('message', msg);
        }
    });
    socket.on('disconnect', function () {
        console.log('client disconnected: ' + clientId);
    });
});

