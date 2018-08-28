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
var ratelimit = 0

io.on('connection', (socket) => {
	
	console.log('New user connected')
	
	//upon new user, creates a random number pair and then generates a random username
	var firstQualif = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
	var secondQualif = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
	socket.username = createUsername(firstQualif, secondQualif);

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
    })

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
		if (data.limit < 3) {
			io.sockets.emit('new_message', {message : data.message, username : socket.username});
			
		}
		else{
			socket.emit('new_message', {message : 'Please do not spam. (You are the only one that can see this message)', username : socket.username});
		}
    })

    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })
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