(function (window, document) {
	'use strict';

	var socket;

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

	NS.prototype.addListener = function (type, listener) {
		var r = registry(this)[type];
		if (typeof r === 'undefined') {
			r = this._events[type] = [];
		}
		r.push(listener);
		return this;
	};

	NS.prototype.on = NS.prototype.addListener;

	NS.prototype.removeListener = function (type, listener) {
		var r = registry(this)[type];
		if (Array.isArray(r)) {
			var i = r.indexOf(listener);
			if (i > -1) {
				r.splice(i, 1);
				if (r.length === 0) {
					delete this._events[type];
				}
			}
		}
		return this;
	};

	NS.prototype.removeAllListeners = function (type) {
		delete this._events[type];
		return this;
	};

	NS.prototype.emit = function (type) {
		var r = registry(this)[type];
		if (typeof r !== 'undefined') {
			var args = [].slice.call(arguments).splice(1);
			for (var i=0, l=r.length; i<l; i++) {
				r[i].apply(null, args);
			}
		}
	};

	function registry(e) {
		if (typeof e._events === 'undefined') {
			e._events = {};
		}
		return e._events;
	}

	window.NodecopterStatus = NS;
})(window, document);
