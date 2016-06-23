var socket = io();

socket.on('slideChange', function(msg){
    Reveal.slide(msg.h, msg.v, 0);
});

socket.on('slideCommand', function (msg) {
    switch (msg) {
        case 'up': Reveal.up(); break;
        case 'down': Reveal.down(); break;
        case 'left': Reveal.prev(); break;
        case 'right': Reveal.next(); break;
   }
});

Reveal.addEventListener( 'slidechanged', function( event ) {
    socket.emit('message', {cmd: 'slideChange', h: event.indexh, v: event.indexv});
});
