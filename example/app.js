var http = require('http'),
    status = require('../index');

var server = http.createServer(function (req, res) {
	require('fs').createReadStream(__dirname + '/index.html').pipe(res);
});

status.on('change', function (data) {
	console.log(data);
});

status.listen(server);
server.listen(5555);
