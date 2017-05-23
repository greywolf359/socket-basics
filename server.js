var PORT = process.env.PORT || 3000;
var express = require('express');
var moment = require('moment');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname + '/public'));

var time = moment();

io.on('connection', function(socket){
	console.log("user connected via socket.io");
	socket.on('message', function(message){
		console.log(formatedTime + ' message received: ' + message.text);
		message.time = moment().valueOf();
		io.emit("message", message); 
	})

		//socket.broadcast to everyone but sender
		//io.emit - sends to every single person including sender

	socket.emit('message', {
		time: moment().valueOf(),
		text: "welcome to chat application"
	})
})

http.listen(PORT,()=>{
	console.log('listening on port: ', PORT);
})
