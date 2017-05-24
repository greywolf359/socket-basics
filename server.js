var PORT = process.env.PORT || 3000;
var express = require('express');
var moment = require('moment');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname + '/public'));

var clientInfo = {};

//sends current users to provided socket

function sendCurrentUsers(socket){
	var info = clientInfo[socket.id];
	var users = [];

	if(typeof info === 'undefined'){
		return;
	}

	//returns an array of all attributes in an object
	Object.keys(clientInfo).forEach((socketId)=>{
		var userInfo = clientInfo[socketId];
		if (info.room === userInfo.room){
			users.push(userInfo.name);
		}
	})

	socket.emit('message', {
		name: "System:",
		text: 'currentUsers: ' + users.join(', '),
		timeStamp: moment().valueOf()
	})
}

//listens for a connection from a client
io.on('connection', function(socket){
	console.log("user connected via socket.io");
	
	
	socket.on('disconnect', ()=>{
		var userData = clientInfo[socket.id];
		if( typeof userData !== 'undefined'){
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left',
				timeStamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	})

	//listens for the joinRoom event
	socket.on('joinRoom', (req)=>{
		//packages an object passed on the clients info {name, room} received from app.js on client
		clientInfo[socket.id] = req;
		//socket creates the room if it doesnt exist and adds the user to it
		socket.join(req.room);
		//broadcasts a message to the room that the user has joined using the message event
		socket.broadcast.to(req.room).emit('message', {
			name: "System",
			text: req.name + " has joined",
			timeStamp: moment.valueOf()
		});
	});


	//when the event message event is emited execute the following:
	socket.on('message', function(message){

		//intercept chat commands from user
		if(message.text.toLowerCase() === '@currentusers'){
			sendCurrentUsers(socket);
		}else{
			//get current time and attach it to message object then emit it by the message event to the client
			var time = moment().valueOf();
			message.time = moment.utc(time)
			console.log(message.time.local().format('hh:mm a') + ' message received from ' + message.name + ': ' + message.text);
			//sends the users message to the appropriate room
			io.to(clientInfo[socket.id].room).emit("message", message); 
		}


		
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
