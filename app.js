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

io.on('connection', (socket) => {
	
	console.log('New user connected')
	
	//upon new user, creates a random number pair and then generates a random username
	var firstQualif = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
	var secondQualif = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
	socket.username = createUsername(firstQualif, secondQualif);
	socket.limit = 0
	socket.limit_max = 3
	socket.limit_timer_on = false;
	
    //listen on change_username
    socket.on('change_username', (data) => {
		//remove whitespace and check if empty. no empty usernames fellas!
		if (data.username.replace(/\s/g, '').length != 0){
			socket.username = data.username
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
			socket.emit('new_message', {message : 'Please do not spam. (Only you can see this message)', username : socket.username});
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