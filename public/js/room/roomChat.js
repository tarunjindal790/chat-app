$(document).ready(function(){
	//possible since we included socketio in roomChat.ejs
	var socket=io();
	var room=$('#roomName').val();
	var sender=$('#sender').val();
	//checks connection on client side
	socket.on('connect',function(){
		console.log("User connected",room);
		var params={
			room:room
		}
		socket.emit('join',params,function(){
			console.log("User has joined ");
		})

	})



	//from server 
	socket.on('newMessage',function(data){
		console.log(data);
		var template=$('#message-template').html();
		var message=Mustache.render(template,{
			text:data.text,
			sender:data.from,

		});

		$('#messages').append(message);
	})


	$('#message-form').on('submit',function(e){
		e.preventDefault();
		var msg=$('#msg').val();
		socket.emit('createMessage',{
			text:msg,
			room:room,
			sender:sender
		},function(){
			$('#msg').val('');
		})
	})


});