var express = require('express');
var app = express();

const log = function(req, message) {
	if ( ! message) {
		message = "";
	}
	console.log(req.method+"   "+req.protocol + '://' + req.get('host') + req.originalUrl+"   "+ message);	
};

app.get('/', function (req, res) {
	log(req);
	res.send('Hello Friend');
});

app.get('*', function(req, res) {
	log(req, "Undefined endpoint");
	res.status(404).send('Undefined endpoint');
});

var server = app.listen(8888, function () {
	console.log('Hello World!');
})

