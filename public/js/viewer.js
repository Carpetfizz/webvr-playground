var io = io();
var roomId = document.location.href.substring(document.location.href.lastIndexOf( '/' )+1);


io.emit('viewerjoin', {room: roomId});

io.on('gameinput', function(input){
    console.log(input);
});