# node-dronestatus

AR.Drone 2.0 status in the browser via WebSocket

## Requirements

You will need a browser that supports [WebSockets](http://caniuse.com/websockets).

## Installing

```bash
npm install dronestatus
```

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

## Message

The payload that is provided from the server provides a lot of data about the state of the drone. I will attempt to document this more fully at some point. In the meantime [example/message.json](https://github.com/mzabriskie/node-dronestatus/blob/master/example/message.json) provides an example of what the message looks like.

## License

MIT