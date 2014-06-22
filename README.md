# node-dronestatus

AR.Drone 2.0 status in the browser via WebSocket

## Installing

```bash
npm install dronestatus
```

## Requirements

You will need a browser that supports [WebSockets](http://caniuse.com/websockets).

## Using

In node you simply need to attach `dronestatus` to your server:

```js
require('dronestatus').listen(server);
```

In your HTML include the client script, then add a listener to handle status change from the drone:

```html
<script src="/dronestatus/nodecopter-client.js"></script>
<script>
	new NodecopterStatus().on('change', function (message) {
		console.log(JSON.parse(message.data));
	});
</script>
```

You can find a more detailed example under `examples/`.


## License

MIT