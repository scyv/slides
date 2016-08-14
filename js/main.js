var socket = io();
var isMaster = false;
socket.on('slideChange', function(msg) {
    Reveal.slide(msg.h, msg.v, 0);
});

socket.on('slideCommand', function(msg) {
    switch (msg) {
        case 'up':
            Reveal.up();
            break;
        case 'down':
            Reveal.down();
            break;
        case 'left':
            Reveal.prev();
            break;
        case 'right':
            Reveal.next();
            break;
    }
});

socket.on('masterChanged', function(msg) {
    if (msg === socket.id) {
        isMaster = true;
        alert('You are master now');
    } else if (isMaster) {
        isMaster = false;
        alert('You lost master control');
    }
});

Reveal.addEventListener('slidechanged', function(event) {
    socket.emit('message', { cmd: 'slideChange', h: event.indexh, v: event.indexv });
});

document.addEventListener("keypress", function(e) {
    if (e.keyCode === 77) {
        socket.emit('message', {
            cmd: 'master',
            masterPassword: prompt('Masterpassword:')
        });
    }
});