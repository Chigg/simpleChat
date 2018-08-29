const express = require('express')
const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => {
	res.render('index')
})

//Listen on port 3000
server = app.listen(3000)

const io = require("socket.io")(server)
var userList = [];
var user_dict = {};

io.on('connection', (socket) => {
	
	console.log('New user connected')
	
	//upon new user, creates a random number pair and then generates a random username
	var firstQualif = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
	var secondQualif = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
	socket.username = createUsername(firstQualif, secondQualif);
	socket.limit = 0
	socket.limit_max = 3
	socket.limit_timer_on = false;
	
		
	socket.on('new_user', (data) => {
		userList.push(socket.username);
		user_dict[socket.username] = userList.length-1;
		
		io.sockets.emit('new_user', {userList : userList});
		io.sockets.emit('new_message', {message : socket.username + " has joined.", username : "Host"});
	})
	
    //listen on change_username
    socket.on('change_username', (data) => {
		//remove whitespace and check if empty. no empty usernames fellas!
		if (data.username.replace(/\s/g, '').length != 0){
			var old_name = socket.username
			socket.username = data.username
			
			//lookup ID and replace old name with new name
			//where ID is position in userList, replace in userList
			var name_index = user_dict[old_name];
			userList[name_index] = socket.username;
			user_dict[socket.username] = name_index;
			
			//IDs for a user's past usernames are stored in dict. 
			//need to be wiped when socket leaves
		
			//update userList by removing old_name from userList
			//emit new event with updated userList
			io.sockets.emit('new_user', {userList: userList});
			
			io.sockets.emit('new_message', {message : old_name + " has changed their name to " + socket.username, username : "Host", limit : data.limit});
		}
    })

    //listen on new_message
    socket.on('new_message', (data) => {
		
		socket.limit += 1
        //broadcast the new message
		if (socket.limit < socket.limit_max && data.message.length < 280){
			io.sockets.emit('new_message', {message : data.message, username : socket.username, limit : data.limit});
			socket.limit_timer_on = false;			
		}
		else{
			//implemented a switch so that the cooldown can't be hit multiple times
			if (socket.limit_timer_on == false){
				socket.limit_timer_on = true;
				setTimeout(resetLimit, 3000);
			}
			socket.emit('new_message', {message : 'Please do not spam. (Only you can see this message)', username : "Host"});
		}
    })
    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })
	
	function resetLimit (){
		socket.limit = 0;
	}
})
	


function createUsername(firstQualif, secondQualif){
	var animal = {
		1: "Chimp",
		2: "Giraffe",
		3: "Pineapple",
		4: "Elephant",
		5: "Dog",
		6: "Zebra",
		7: "Claire",
		8: "Lion",
		9: "CandleStick",
		10: "Sloth",
		11: "Bird",
		12: "Horse",
		13: "Seal",
		14: "Shark",
		15: "Snake",
		16: "Badger",
		17: "Hare",
		18: "Can",
		19: "Chair",
		20: "Bug"
	};
	
	var color = {
		1: "Red",
		2: "Green",
		3: "Purple",
		4: "Beige",
		5: "Mauve",
		6: "Chartreuse",
		7: "Maroon",
		8: "Orange",
		9: "Blue",
		10: "Navy",
		11: "Gold",
		12: "Pink",
		13: "Silly",
		14: "White",
		15: "Grey",
		16: "Lemon",
		17: "Tan",
		18: "Yellow",
		19: "Wine",
		20: "Amber"
	};
	
	return(color[firstQualif]+animal[secondQualif]);
}