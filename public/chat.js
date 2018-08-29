
$(function(){
   	//make connection
	var socket = io.connect('http://localhost:3000')
	socket.emit('new_user')
	
	//buttons and inputs
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var chatters = $("#chatters")
	var feedback = $("#feedback")
	
	
	//Emit message
	send_message.click(function(){
		//limit += 1
		socket.emit('new_message', {message : message.val()})
	})

	//Listen on new_message
	socket.on("new_message", (data) => {
		
		var objDiv = document.getElementById("chatroom");
			objDiv.scrollTop = objDiv.scrollHeight;
			
		feedback.html('');
		message.val('');
		chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")

	})
	
	socket.on("new_user", (data) => {
		//need to figure out how to overwrite these everytime a new userList is supplied.
		for (var i = 0; i < data.userList.length; i++){
			chatters.append("<p class='usernames'>" + data.userList[i] + "</p>")
		}
	})
	
	socket.on("refresh_list", (data) => {
		document.getElementById("chatters").innerHTML = '';
	})

	//Emit a username
	send_username.click(function(){
		socket.emit('change_username', {username : username.val()})
		
	})

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
});






