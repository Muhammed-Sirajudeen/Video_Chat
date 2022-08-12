const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs')
const server = https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'Muhammed'
}, app)
const { Server } = require("socket.io");
const io = new Server(server,{cors:{origin:"*"}});



//it still saved me
app.use(express.static("public"))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
    socket.on("first_transaction",(msg)=>{
    	console.log(msg)
  	
  	socket.broadcast.emit("second_transaction",msg)
  	//this sends the message to everyone in the namespace except  the sender
  })



  socket.on("third_transaction",(msg)=>{
  	console.log(msg);
  	socket.broadcast.emit("fourth_transaction",msg);

  })



});
server.listen(3000,()=>{
	console.log("created");
})



