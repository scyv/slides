var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('./config.js');

app.use('/js', express.static(__dirname + '/js/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/revealjs', express.static(__dirname + '/node_modules/reveal.js/'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/slides/:slides', function(req, res) {
    res.sendFile(__dirname + '/' + req.params.slides + '/index.html');
});

app.get('/remote/', function(req, res) {
    res.sendFile(__dirname + '/remote.html');
});

http.listen(config.port, function() {
    console.log('listening on *:' + config.port);
});

var masterId = null;

var newMaster = function(newMasterId) {
    masterId = newMasterId;
    console.log('master is now ' + masterId);
    io.emit('masterChanged', masterId);
};

io.on('connection', function(socket) {
    var clientId = socket.client.id;
    if (!masterId) {
        newMaster(clientId);
    }
    console.log('client connected: ' + clientId);
    socket.on('message', function(msg) {
        if (masterId === clientId) {
            if (msg.cmd === 'slideChange') {
                console.log(msg);
                io.emit('slideChange', msg);
            } else if (msg.cmd === 'remote') {
                io.emit('slideCommand', msg.direction);
            }
        } else if (msg.cmd === 'master') {
            if (msg.masterPassword === config.masterPassword) {
                newMaster(clientId);
            }
        }
    });
    socket.on('disconnect', function() {
        console.log('client disconnected: ' + clientId);
    });
});