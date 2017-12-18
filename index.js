const express = require('express');

const app = express();

// Integrate cookies
const cookieParser = require('cookie-parser')
app.use(cookieParser())


// ======================[ Default Data ]===================================
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
				'sender': 'joe',
				'message': 'Hey how are you?',
				'timestamp': '2017-12-01T14:00:00Z',
			},
			{
				'sender': 'stefan',
				'message':'Hiya',
				'timestamp': '2017-12-01T13:00:00Z',
			},
		   ], 
		   'rewaz': [
		    	{
				'sender': 'joe',
				'message':'Hey how are you finding the challenge?',
				'timestamp': '2017-12-02T08:10:00Z',
			},
			{
				'sender': 'rewaz',
				'message': 'It is great, react js is rather nice.',
				'timestamp': '2017-12-02T08:30:00Z',
			},
		    	{
				'sender': 'joe',
				'message':'I agree, react will take over the world one day.',
				'timestamp': '2017-12-03T01:10:00Z',
			},
			
		    ]
		 },
	'rewaz'  : {  'joe': [
		    	{
				'sender': 'joe',
				'message':'Hey how are you finding the challenge?',
				'timestamp': '2017-12-02T08:10:00Z',
			},
			{
				'sender': 'rewaz',
				'message': 'It is great, react js is rather nice.',
				'timestamp': '2017-12-02T08:30:00Z',
			},
		    	{
				'sender': 'joe',
				'message':'I agree, react will take over the world one day.',
				'timestamp': '2017-12-03T01:10:00Z',
			},
			
		    ]
 		}
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

function compare_on_timestamp(a,b) {
  if (a.timestamp < b.timestamp)
    return -1;
  if (a.timestamp > b.timestamp)
    return 1;
  return 0;
}



/*
 * Get all the chats for a the logged in user, showing ONLY THE LATEST  message from each chat
 */
app.get('/chats/', function(req,res) {
	const me = req.cookies.user
	const chats = app.locals.chats[me];
	let shallow_chats = {}

	if ( ! chats) {
		shallow_chats = {}
	} else {
		Object.keys(chats).forEach(function(buddy) {
  			var chat = chats[buddy].sort(compare_on_timestamp);
			shallow_chats[buddy] = chat[0]
		});

	}
	log(req, JSON.stringify(Object.keys(shallow_chats)) )
	res.send(shallow_chats)
});

/*
 * Get the ENTIRE conversation between the logged in user and their :buddy
 */
app.get('/chats/:buddy', function(req,res) {
	const me = req.cookies.user
	const buddy = req.params.buddy
	var chat = app.locals.chats[me][buddy];
	if ( ! chat) {
		chat = [] 
	}
	log(req, JSON.stringify("Messages:"+chat.length) )
	res.send(chat)
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

