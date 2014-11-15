var express = require('express');
var httpProxy = require('http-proxy');
var sugar = require('sugar');
var morgan = require('morgan');

var config = require('./config')

var app = express();
var proxy = httpProxy.createProxyServer();

var proxyRouter = function (req, res, next) {
	// determine hostname

	var routes;

	if (config.route.hasOwnProperty(req.hostname)) {
		routes = config.route[req.hostname];
	} else if (config.route.hasOwnProperty('_any')) {
		routes = config.route._any;
	} else {
		return next();
	}

	// determine route

	var route;

	for (var path in routes) if (routes.hasOwnProperty(path)) {
		if (path !== '/' && req.url.startsWith(path + '/')) {
			req.url = req.url.slice(path.length);
			route = routes[path];
			break;
		}
	}

	if (!route && routes['/']) {
		route = routes['/'];
	}

	if (!route) return next();

	// proxy

	if (route.type === 'proxy') {
		proxy.web(req, res, {
			target: route.target,
		}, function (error) {
			next(error);
		});
	} else if (route.type === 'static') {
		express.static(route.target, route.options)(req, res, next)
	} else if (route.type === 'redirect') {
		res.redirect(route.target);
	} else {
		return next();
	}
};

app.use(morgan(':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" ":req[Host]"'));
app.use(proxyRouter);

// not found
app.use(function (req, res) {
	res.status(404);
	res.send('Requested URL ' + req.originalUrl + ' is not found among hakata-proxyrouter sorry ;(');
});

// error
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.send('Destination of hakata-proxyrouter seems to be down now. Please report this error to me anyway...');
});

var server = app.listen(config.listen, function() {
	console.log('Listening on port %d', server.address().port);
});
