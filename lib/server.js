module.exports.listen = function listen(server, options) {
	'use strict';

	var ws = require('ws'),
		drone = require('ar-drone'),
		path = __dirname + '/client.js';

	options = options || {};

	// Create server if port number was provided
	if (typeof server === 'number') {
		var port = server;
		server = require('http').createServer();
		server.listen(port);
	}

	// Serve static files
	var url = '/dronestatus/nodecopter-status.js',
		listeners = server.listeners('request').slice(0);

	server.removeAllListeners('request');
	server.on('request', function (req, res) {
		if (req.url.indexOf(url) === 0) {
			res.setHeader('Content-Type', 'application/javascript');

			var read = require('fs').createReadStream(path);
			read.pipe(res);
		} else {
			for (var i=0, l=listeners.length; i<l; i++) {
				listeners[i].call(server, req, res);
			}
		}
	});

	// Connect to drone and listen to navdata
	var control = new drone.Client.UdpControl(options),
		navdata = new drone.Client.UdpNavdataStream(options);

	control.ctrl(5, 0);
	control.config('general:navdata_demo', 'TRUE');
	control.flush();

	navdata.resume();
	navdata.on('error', function (err) {
		console.log('There was an error: %s', err.message);
		navdata.destroy();
	});

	// Setup web-socket
	var wss = new ws.Server({server: server, path: '/dronestatus'});
	wss.on('connection', function (ws) {
		console.log('WebSocket connection established');

		function listener (data) {
			console.log(data);
			ws.send(JSON.stringify(data));
		}

		navdata.on('data', listener);

		ws.once('close', function () {
			navdata.removeListener('data', listener);
		});
	});
};
