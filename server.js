var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var shortid = require('shortid');
var Bitly = require('bitly');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('assets/models'));
app.set('views', __dirname + '/views');

var rooms = [];
var bitly = new Bitly('e7d67277347e7c7b79b591cafa422a22e9a380fb');

//renders editor and creates a room
app.get('/', function (req, res) {
	// var room = shortid.generate();
	var room = "x"
	// console.log('https://'+req.headers.host+'/viewer/'+room);
	var debugURL = "https://localhost/viewer/"+room;
	// bitly.shorten('https://'+req.headers.host+'/viewer/'+room). then(function(response){
	// 	console.log(response);
	// 	res.render('editor', {room: room, roomURL: response.data.url});
	// }, function(error){
	// 	throw error;
	// });
	res.render('editor', {room: room, roomURL: debugURL});
	rooms.push(room);
});

//renders the VR
app.get('/viewer/:roomId', function (req, res){
	res.render('viewer', {room: req.params.roomId});
});

//renders the gamepad
// app.get('/gamepad/:roomId', function (req, res){
// 	res.render('gamepad', {room: req.params.roomId});
// });


var port = process.env.PORT || 3000;
server.listen(port, function(req, res){
	console.log("Listening on "+port);
});


//TODO EDIT
io.on('connection', function (socket) {


	/* 	GET /editor
			- Generate ROOM ID and render it on the page
			- EDITOR joins socket room with ROOM ID
			- EDITOR displays roomURl
			- EDITOR sends gamepad data to VIEWER

		GET /viewer/:roomId
			- VIEWER joins socket room with ROOM ID
			- When button is pressed, EDITOR sends Scene to VIEWER
			- VIEWER recieves gamepad data from EDITOR
	*/

	socket.on('viewerjoin', function(data){
		socket.room = data.room;
		socket.join(socket.room);

		console.log("Viewer joined: "+socket.room);
	});

	socket.on('editorjoin', function(data){
		socket.room = data.room;
		socket.join(socket.room);

		console.log("Editor joined: "+socket.room);
	});

	socket.on('sendscene', function(data) {
		socket.broadcast.to(socket.room).emit('sceneready', data.scene);
		console.log("Sent scene from editor to: "+socket.room);
	});

	socket.on('sendinput', function(data) {
		socket.broadcast.to(socket.room).emit('gameinput', data.input);
	});



/*
- GET /viewer
- Generate ROOM ID and render it on page
- VIEWER joins socket room with ROOM ID

- GET /lightsaber
- Input ROOM ID from VIEWER
- LIGHTSABER joins socket room with ROOM ID
	- SERVER tells VIEWER and LIGHTSABER to begincalibration
- LIGHTSABER tells SERVER that calibrationcomplete
	- SERVER tells VIEWER that calibrationcomplete
- VIEWER tells SERVER that viewerready
	- SERVER tells LIGHTSABER that viewerready
- LIGHTSABER tells SERVER sendmotion with data
	- SERVER tells VIEWER motionupdate with data
*/

	// socket.on('viewerjoin', function(data){
	// 	socket.room = data.room;
	// 	socket.join(socket.room);

	// 	console.log("Viewer joined: "+socket.room);
	// });



	// socket.on('setupcomplete', function(data){
	// 	socket.broadcast.to(socket.room).emit('setupcomplete');

	// 	console.log("WebVR setup complete: "+socket.room);
	// });

	// socket.on('viewready', function(data){
	// 	socket.broadcast.to(socket.room).emit('viewready');

	// 	console.log("View ready: "+socket.room);
	// });

	// //TODO
	// socket.on('sendData', function(data){
	// 	socket.broadcast.to(socket.room).emit('dataParser',data);
	// });


});
