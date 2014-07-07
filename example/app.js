var http = require('http'),
    status = require('../index'),
	drone = require('ar-drone'),
	server, client;

client = drone.createClient();
server = http.createServer(function (req, res) {
	require('fs').createReadStream(__dirname + '/index.html').pipe(res);
});

status.on('change', function (data) {
	console.log(data);
});

status.listen(server, {
	udpControl: client._udpControl,
	udpNavdataStream: client._udpNavdatasStream
});
server.listen(5555);
