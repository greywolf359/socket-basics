var socket = io();

socket.on('connect', ()=>{
	console.log("connected to socket.io server");
})