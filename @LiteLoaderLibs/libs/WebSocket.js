//import { URI } from 'java.net.URI';
import { HttpClient } from 'java.net.http.HttpClient';
//import { WebSocket as JWebSocket } from 'java.net.http.WebSocket';
class WebSocket {
	constructor(wsurl) {
		this._originUrl = wsurl;
	}
}
export class WSClient extends WebSocket {
	constructor(wsurl) {
		super(wsurl);
		var client = HttpClient.newHttpClient();
        this._ws = client.newWebSocketBuilder()
			.buildAsync(URI.create(wsurl), this);
		this._events = {};
	}
	onOpen(webSocket) {
		//print('打开链接');
	}
	onPing(webSocket, msg) {
		print('Ping: '+msg);
		if (this._events['onPing']) {
			this._events['onPing'].apply(this, arguments);
		}
	}
	onPong(webSocket, msg) {
		print('Pong: '+msg);
		if (this._events['onPong']) {
			this._events['onPong'].apply(this, arguments);
		}
	}
	onText(webSocket, data, isLast) {
		print(data);
		if (this._events['onTextReceived']) {
			this._events['onTextReceived'].apply(this, arguments);
		}
	}
	onBinary(webSocket, data, isLast) {
		print(data);
		if (this._events['onBinaryReceived']) {
			this._events['onBinaryReceived'].apply(this, arguments);
		}
	}
	onClose(webSocket, statusCode, reason) {
		print(reason);
		if (this._events['onLostConnection']) {
			this._events['onLostConnection'].apply(this, arguments);
		}
	}
	onError(webSocket, error) {
		print(e);
		if (this._events['onError']) {
			this._events['onError'].apply(this, arguments);
		}
	}
	listen(event, callback) {
		this._events[event] = callback;
	}
}
class WSServer extends WebSocket {
	constructor() {
		super();
	}
}
