var http = require('http');
var express = require('express');
var socketio = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketio(server);

var users=[];

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/chat.html');
});

server.listen(3000, function(){
	console.log('server running port:3000...');
});

io.on('connection', function(socket){
	console.log('connected.' + socket.id);
	socket.on('login', function(data){
		io.emit('msg',{text : data.id +' has connected.'} );
		console.log('connected ' + data.id);
		users.push(data.id);
		io.emit('users',{userlist:users});
	});
	socket.on('msg', function(data){
		io.emit('msg', {text: data.id + ':' + data.text});
	});
	socket.on('logout', function(data){
		io.emit('msg', {text : data.id + ' has disconnected.' });
		console.log('disconnected ' + data.id);
		users.pop(data.id);
		io.emit('users',{userlist:users});
	});
});

