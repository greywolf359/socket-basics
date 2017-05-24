var PORT = process.env.PORT || 3000;
var express = require('express');
var moment = require('moment');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function(socket){
	console.log("user connected via socket.io");

	socket.on('joinRoom', (req)=>{
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: "System",
			text: req.name + " has joined",
			timeStamp: moment.valueOf()
		});
	});


	//when the event message is emited execute the following:
	socket.on('message', function(message){
		//get current time and attach it to message object then emit it by the message event to the client
		var time = moment().valueOf();
		message.time = moment.utc(time)
		console.log(message.time.local().format('hh:mm a') + ' message received from ' + message.name + ': ' + message.text);
		io.to(clientInfo[socket.id].room).emit("message", message); 
	})

		//socket.broadcast to everyone but sender
		//io.emit - sends to every single person including sender

	//sent to the client initially
	socket.emit('message', {
		name: 'System',
		time: moment().valueOf(),
		text: "welcome to chat application"
	})


})

http.listen(PORT,()=>{
	console.log('listening on port: ', PORT);
})
