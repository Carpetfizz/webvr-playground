var io = io();

initgp(input);

io.emit('editorjoin', {room: roomId});

function input(i) {
    io.emit('sendinput', {input: i});
}