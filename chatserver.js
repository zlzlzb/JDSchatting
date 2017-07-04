var http = require('http');
var express = require('express');
var socketio = require('socket.io')
var session = require('express-session');
var bodyparser = require('body-parser');

var ejs=require('ejs');

var app = express();
var server = http.createServer(app);
var io = socketio(server);
app.set('views',__dirname+'/views');
app.set('view engine','ejs');

var users=[];

app.use(bodyparser.urlencoded({extended:false}));
app.use(session({secret:'my login page.'}));


app.get('/', function(req, res){

	if(req.session.user)
		res.redirect('/chat.html');
	
	else
		res.redirect('/login.html');
});

app.post('/login',function(req,res){

        var id = req.body.id;
//	for(var i=0;usersi

	//Todo dup userid check

        req.session.user = id;
	res.redirect('/chat.html');

});
app.get('/logout',function(req,res){
	
	users.pop(req.session.user);	
	req.session.destroy(function(){
		res.redirect('/');
	});
});

app.get("/login.html",function(req,res){

        if(req.session.user)
                res.redirect('/chat.html');
        else
		LoadPublicPage(res,'/login.html');

});


app.get("/chat.html",function(req,res){
	console.log(req.session.user);
	if(req.session.user)
		res.render('chat',{id:req.session.user});


	else
		res.redirect('/login.html');
});


server.listen(3000, function(){
	console.log('server running port:3000...');
});

io.on('connection', function(socket){
	console.log('connected.' + socket.id);
	
	socket.on('login',function(data){
		users.push(data.id);
		io.emit('user',{user : data.id });
		io.emit('users',{userlist:users});
		io.emit('msg',{text : data.id +' has connected.'} );
	});

	socket.on('msg', function(data){
		io.emit('msg', {text: data.id + ':' + data.text});
	});
	socket.on('logout', function(data){
		io.emit('msg', {text : data.id + ' has disconnected.' });
		console.log('disconnected ' + data.id);
		io.emit('users',{userlist:users});
	});
});
function LoadPublicPage(res,page)
{
	res.sendFile(__dirname+'/public'+page);
}
