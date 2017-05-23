var socket = io();

socket.on('connect', ()=>{
	console.log("connected to socket.io server");
});

socket.on("message",function(message){
	console.log('message ', message.text)
	
	$('.messages').append(`<p>${message.text}</p>`)
})

//handles submitting of new message

var $form = $('#message-form');
var $message = $form.find('input[name=message]');
$form.on('submit', (event)=>{
	event.preventDefault();
	socket.emit('message', {
		text: $message.val()
	})
	$message.val('');
});