(function (window, document) {
	'use strict';

	var socket,
		events = require('events'),
		util = require('util');

	function NS(options) {
		options = options || {};

		var hostname = options.hostname || document.location.hostname,
			port = options.port || document.location.port,
			url = 'ws://' + hostname + ':' + port + '/dronestatus',
			self = this;

		socket = new WebSocket(url);
		socket.onmessage = function (message) {
			self.emit('change', message);
		};
	}

	util.inherits(NS, events.EventEmitter);

	window.NodecopterStatus = NS;
})(window, document);
