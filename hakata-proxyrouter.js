var express = require('express');
var httpProxy = require('http-proxy');
var sugar = require('sugar');
var morgan = require('morgan');

var config = require('./config')

var app = express();
var proxy = httpProxy.createProxyServer();

var proxyRouter = function (req, res, next) {
	for (var path in config.route) {
		if (config.route.hasOwnProperty(path)) {
			if (req.url.startsWith('/' + path + '/')) {
				req.url = req.url.slice(path.length + 1);
				proxy.web(req, res, {
					target: config.route[path]
				});
				return;
			}
		}
	}

	next();
};

app.use(morgan('combined'));
app.use(proxyRouter);
app.use(express.static('static'));

app.get('/', function (req, res) {
	res.send('It works!');
});

var server = app.listen(config.port, function() {
	console.log('Listening on port %d', server.address().port);
});
