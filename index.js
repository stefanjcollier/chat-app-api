const express = require('express');

const app = express();

// Integrate cookies
const cookieParser = require('cookie-parser')
app.use(cookieParser())


app.locals.chats = {
	'stefan' : { 'joe':[
			{
				'sender': 'stefan',
				'message':'Hiya',
				'timestamp': '2017-12-01T13:00:00Z',
			},
			{
				'sender': 'joe',
				'message': 'Hey how are you?',
				'timestamp': '2017-12-01T14:00:00Z',
			},
			]  
		},
	'joe'    : { 'stefan': [
			{
				'sender': 'stefan',
				'timestamp': '2017-12-01T13:00:00Z',
			},
			{
				'sender': 'joe',
				'message': 'Hey how are you?',
				'timestamp': '2017-12-01T14:00:00Z',
			},
			]  
		 },
	'rewaz'  : {}

}

/*
 * A nice little standard logger 
 */
const log = function(req, message) {
	if ( ! message) {
		message = "";
	}
	console.log(req.method+"   "+req.protocol + '://' + req.get('host') + req.originalUrl+"   "+ message);	
};

// ======================[ Login Endpoints ]===================================
/*
 * A method to help you manually check who is logged in
 */
app.get('/', (req, res) => {
	log(req);
  	res.send(`Current user is ${req.cookies.user}`);
})

/*
 * ‘Log in’ as xyz when visiting /login/xyz
 */
app.get('/login/:user', (req, res) => {
	log(req)
	res.cookie('user', req.params.user)
	res.send(`Logged in as ${req.params.user}`)
})

// ======================[ Chat Endpoints ]===================================
/*
 * Get all the chats for a the user ':me'
 */
app.get('/chats/', function(req,res) {
	const me = req.cookies.user
	var chats = app.locals.chats[me];
	if ( ! chats) {
		chats = {}
	}
	log(req, JSON.stringify(Object.keys(chats)) )
	res.send(chats)
});



// ======================[ Boilerplate  ]===================================
/*
 * Fallback method to indicate that something has gone wrong
 */
app.get('*', function(req, res) {
	log(req, "Undefined endpoint");
	res.status(404).send('Undefined endpoint');
});


var server = app.listen(8888, function () {
	console.log('Hello World!');
})

