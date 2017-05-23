var socket = io();

socket.on('connect', ()=>{
	console.log("connected to socket.io server");
});

socket.on("message",function(message){
	console.log('new message:');
	console.log(message);
})

//handles submitting of new message

var $form = $('#message-form');
$form.on('submit', (event)=>{
	event.preventDefault();
	socket.emit('message', {
		text: $form.find('input[name=message]').val()
	})
	$form.find('input[name=message]').val('');
});