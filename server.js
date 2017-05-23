var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname + '/public'));


io.on('connection', function(socket){
	console.log("user connected via socket.io");
	socket.on('message', function(message){
		console.log('message received: ' + message.text);
		socket.broadcast.emit("message", message.text);
		console.log("executed after broadcast...."); 
	})

		//broadcast to everyone but sender
		//io.emit - sends to every single person including sender

	socket.emit('message', {
		text: "welcome to chat application"
	})
})

http.listen(PORT,()=>{
	console.log('listening on port: ', PORT);
})
