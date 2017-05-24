var name = getQueryVariable('name')  || 'anonymous';
var room = getQueryVariable('room');

console.log(name + " wants to join " + room);

var socket = io();

socket.on('connect', ()=>{
	console.log("connected to socket.io server");
});

socket.on("message",function(message){
	var timeStamp = moment.utc(message.time);
	var $message = $('.messages');
	$message.append(`<p><strong> ${message.name} ${timeStamp.local().format('hh:mm a')}</strong></p>`)
	$message.append(`<p>${message.text}</p>`)
	
})

//handles submitting of new message

var $form = $('#message-form');
var $message = $form.find('input[name=message]');
$form.on('submit', (event)=>{
	event.preventDefault();
	socket.emit('message', {
		name: name,
		text: $message.val()
	})
	$message.val('');
});