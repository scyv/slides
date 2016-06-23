var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use('/js', express.static(__dirname + '/js/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/revealjs', express.static(__dirname + '/node_modules/reveal.js/'));


app.get('/slides/:slides', function(req, res){
    res.sendFile(__dirname + '/' + req.params.slides + '/index.html');
});

app.get('/remote/', function(req, res){
    res.sendFile(__dirname + '/remote.html');
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
        if (msg.cmd == 'slideChange' && masterId === clientId) {
            console.log(msg);
            io.emit('slideChange', msg);
        } else if (msg.cmd == 'master') {
            masterId = clientId;
            console.log('master is now ' + clientId);
        } else if (msg.cmd == 'remote') {
            io.emit('slideCommand', msg.direction);
        }
    });
    socket.on('disconnect', function () {
        console.log('client disconnected: ' + clientId);
    });
});

