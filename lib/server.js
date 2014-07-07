var events = require('events'),
	status = new events.EventEmitter();

status.listen = function listen(server, options) {
	var ws = require('ws'),
		path = require('path'),
		drone = require('ar-drone'),
		browserify = require('browserify')();

	options = options || {};

	// Create server if port number was provided
	if (typeof server === 'number') {
		var port = server;
		server = require('http').createServer();
		server.listen(port);
	}

	// Serve static files
	var url = '/dronestatus/nodecopter-client.js',
		listeners = server.listeners('request').slice(0);

	browserify.add(path.join(__dirname, 'client.js'));

	server.removeAllListeners('request');
	server.on('request', function (req, res) {
		if (req.url.indexOf(url) === 0) {
			res.setHeader('Content-Type', 'application/javascript');
			browserify.bundle().pipe(res);
		} else {
			for (var i=0, l=listeners.length; i<l; i++) {
				listeners[i].call(server, req, res);
			}
		}
	});

	// Connect to drone and listen to navdata
	var control = options.udpControl || new drone.Client.UdpControl(options),
		navdata = options.udpNavdataStream || new drone.Client.UdpNavdataStream(options);

	control.ctrl(5, 0);
	control.config('general:navdata_demo', 'TRUE');
	control.flush();

	navdata.resume();
	navdata.on('error', function (err) {
		console.log('[dronestatus] There was an error: %s', err.message);
		navdata.destroy();
	});

	// Setup web-socket
	var wss = new ws.Server({server: server, path: '/dronestatus'}),
		_ws = null;
	wss.on('connection', function (ws) {
		console.log('[dronestatus] WebSocket connection established');

		_ws = ws;

		ws.once('close', function () {
			console.log('[dronestatus] WebSocket connection lost');
			_ws = null;
		});
	});

	// Handle data
	navdata.on('data', function (data) {
		status.emit('change', data);

		// Send over web-socket if connected
		if (_ws !== null) {
			_ws.send(JSON.stringify(data));
		}
	});
};

module.exports = status;
