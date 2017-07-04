var express =require('express');
var session = require('express-session');
var bodyparser = require('body-parser');
var ejs = require('ejs');

var users = [{id:'abc',pwd:"1234"},{id:'def',pwd:"5678"}];

var app=express();
app.set("views",__dirname+'/views');
app.set('view engine','ejs');

app.use(bodyparser.urlencoded({extended:false}));
app.use(session({secret:'my login page.'}));


app.get('/logined.html',function(req,res){
	console.log(req.session.user);
	if(req.session.user)
	{
		//res.sendFile(__dirname+'/public/logined.html');
		res.render('logined',req.session.user);
	}
	
	else
	{
		res.redirect('/login.html#fail');
	}
	
	
});
app.get("/",function(req,res){
		res.redirect('/login.html');
});

app.get("/login.html",function(req,res){

	if(req.session.user)
		res.redirect('/logined.html');
	else
		res.sendFile(__dirname+'/public/login.html');

});


app.use(express.static(__dirname + '/public'));

app.post('/login',function(req,res){
	
	
		
	var id = req.body.id;
	var pwd = req.body.pwd;
	
	console.log(id,pwd);
	
	for(var i=0;i<users.length;i++)
	{
		console.log(users[i]);

		if(users[i].id===id && users[i].pwd===pwd)
		{
	
			req.session.user = users[i];
			break;
		}
	}
	res.redirect('/logined.html');
});

app.get('/logout',function(req,res){
		req.session.destroy(function(){
			res.redirect('/');
		});
		
});




app.listen(8080,function(){
	
	console.log('login server on 8080');
});