
//get data from user using query string
var name = getQueryVariable('name')  || 'anonymous';
var room = getQueryVariable('room');

console.log(name + " wants to join " + room);

var socket = io();

$('h1[class=room-title]').text(room);
$('h3[class=user-name]').text(`You are signed in as ${name}`);

//event listener that fires when when user connects successfully
socket.on('connect', ()=>{
	console.log("connected to socket.io server");
	//emits the joinRoom event that server.js listens for
	socket.emit('joinRoom', {
		name: name,
		room: room
	})
});

//listens for the message event that server.js emits and displays it to the user
socket.on("message",function(message){
	var timeStamp = moment.utc(message.time);
	var $messages = $('.messages');
	var $message = $('<li class = "list-group-item"></li>');
	$message.append(`<p><strong> ${message.name} ${timeStamp.local().format('hh:mm a')}</strong></p>`)
	$message.append(`<p>${message.text}</p>`);
	$messages.append($message);
	
})

//handles submitting of new message from user
var $form = $('#message-form');
var $message = $form.find('input[name=message]');
//jquery listens for a submit event and puts the user data into an object and passes it off to socket using a message event
$form.on('submit', (event)=>{
	event.preventDefault();
	socket.emit('message', {
		name: name,
		text: $message.val()
	})
	$message.val('');
});