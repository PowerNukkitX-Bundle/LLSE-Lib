import { URI } from 'java.net.URI';
import { HttpClient } from 'java.net.http.HttpClient';
import { ByteBuffer } from "java.nio.ByteBuffer";
//import { WebSocket as JWebSocket } from 'java.net.http.WebSocket';
class WebSocket {
	constructor() {
	}
}
export class WSClient extends WebSocket {
	constructor() {
		super();
		this._events = {};
		this._lasterror
	}
	/**
	 * 建立链接（同步）
	 * @todo 由于异步传染性无法正常返回布尔值（多线程也许能够解决这个问题）
	 * @param wsurl {String} ws链接 ws://ip:port
	 * @returns {boolean} 是否成功
	 */
	connect(wsurl) {
		this.connectAsync(wsurl, (succ)=>{return succ});
		return true;
	}
	/**
	 * 建立链接（异步）
	 * @param wsurl {String} ws链接 ws://ip:port
	 * @param callback {Function} args1是否成功 args2错误信息
	 */
	connectAsync(wsurl, callback = (succ, err)=>{}) {
		new Promise((resolve, reject) => { 
			HttpClient.newHttpClient().newWebSocketBuilder()
			.buildAsync(URI.create(wsurl), this)
			.whenComplete((webSocket, throable) => {
				if (Boolean(throable)) {
					reject(throable);
				} else {
					resolve(webSocket);
				}
			});
		}).then(res => {
			this._ws = res;
			callback(true);
		}).catch(e => {
			this._ws = null;
			this._lasterror = e;
			callback(false, e);
		});
	}
	/**
	 * 是否打开链接
	 */
	onOpen(webSocket) {
		if (this._events['onOpen']) {
			this._events['onOpen'].apply(this, arguments);
		}
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
		print(1)
		print(data);
		if (this._events['onTextReceived']) {
			this._events['onTextReceived'].apply(this, arguments);
		}
	}
	onBinary(webSocket, data, isLast) {
		print(2)
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
		print(error);
		if (this._events['onError']) {
			this._events['onError'].apply(this, arguments);
		}
	}
	/**
	 * 监听事件
	 * @param event {String} 事件名onTextReceived,onError
	 * @param callback {Function} 回调
	 * @returns {boolean} 是否成功
	 */
	listen(event, callback) {
		this._events[event] = callback;
		return true;
	}
	/**
	 * 关闭连接
	 * @returns {boolean} 是否成功
	 */
	close() {
		this._ws.sendClose(1000, 'close');
		return true;
	}
	/**
	 * 强制关闭连接
	 * @returns {boolean} 是否成功
	 */
	shutdown() {
		this._ws.abort();
		return true;
	}
	/**
	 * 错误代码
	 * @returns {number} 错误代码，1000代表正常
	 */
	errorCode() {
		return this._ws.NORMAL_CLOSURE;
	}
	/**
	 * 发送数据
	 * @todo 似乎ws有最大长度限制，大数据包需要分片。
	 * @param msg {ByteBuffer|CharSequence} 数据内容
	 * @returns {boolean} 是否成功
	 */
	send(msg) {
		if (msg instanceof ByteBuffer) {
			this._ws.sendBinary(msg, true);
		} else {
			this._ws.sendText(msg, true);
		}
		return true;
	}
}
class WSServer extends WebSocket {
	constructor() {
		super();
	}
}
