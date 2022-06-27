import { WsClientBuilder } from 'WsClient';
import { ByteBuffer } from "java.nio.ByteBuffer";
import { Thread } from "java.lang.Thread";
import { Worker } from ":concurrent";

export class WebSocket {
	constructor() {
	}
}
export class WSClient extends WebSocket {
	constructor() {
		super();
		this._lasterror;
		this._ws = null;
		this.status = WSClient.Closed;
		WsClientBuilder.setTimeout(5000)// 设置超时时间（ms）
		.onOpen((ws)=>{
			ws.request(1);
			console.log('Open');
		})
		.onText((ws, data, last)=>{
			ws.request(1);
			console.log('Text', data, last);
		})
		.onClose((ws, statusCode, reason)=>{
			ws.request(1);
			console.log('Close', statusCode, reason);
		})
		.onBinary((ws, data, last)=>{
			ws.request(1);
			console.log('Binary', data, last);
		})
		.onPing((ws, message)=>{
			ws.request(1);
			console.log('Ping', message);
		})
		.onPong((ws, message)=>{
			ws.request(1);
			console.log('Pong', message);
		})
		.onError((ws, error)=>{
			ws.request(1);
			console.log('Error', error);
		});
	}

	/**
	 * 处于正常连接中
	 * @readonly
	 * @enum {number}
	 */
	static Open = 0;
	/**
	 * 正在断开连接
	 * @readonly
	 * @enum {number}
	 */
	static Closing = 1;
	/**
	 * 未连接
	 * @readonly
	 * @enum {number}
	 */
	static Closed = 2;

	/**
	 * 建立链接（同步）
	 * @param wsurl {String} ws链接 ws://ip:port
	 * @returns {boolean} 是否成功
	 */
	connect(wsurl) {
		try {
			this._ws = WsClientBuilder.setURI(wsurl)
			.buildAsync()// 返回Java Promise
			.waitAndGet();
			this._lasterror = null;
			console.log(this._ws)
			return true;
		} catch(err) {
			this._ws = null;
			this._lasterror = err;
			console.log(this._lasterror)
			return false;
		}
	}

	/**
	 * 建立链接（异步）
	 * @param wsurl {String} ws链接 ws://ip:port
	 * @param callback {Function} args1是否成功 args2错误信息
	 */
	connectAsync(wsurl, callback = (succ, err)=>{}) {
		WsClientBuilder.setURI(wsurl)
		.buildAsync()// 返回Java Promise
		.then(res => {
			this._ws = res;
			this._lasterror = null;
			callback(true);
		}, e => {
			this._ws = null;
			this._lasterror = e;
			callback(false, e);
		});
	}

	/**
	 * 监听事件
	 * @param event {String} 事件名onTextReceived,onError
	 * @param callback {Function} 回调
	 * @returns {boolean} 是否成功
	 */
	listen(event, callback) {
		switch (event) {
			case 'onTextReceived':
				WsClientBuilder.onText((ws, data, last)=>{
					ws.request(1);
					callback(data);
				});
				break;
			case 'onBinaryReceived':
				WsClientBuilder.onBinary((ws, data, last)=>{
					ws.request(1);
					callback(data);
				});
				break;
			case 'onLostConnection':
				WsClientBuilder.onClose((ws, statusCode, reason)=>{
					ws.request(1);
					callback(reason);
					this._lasterror = reason;
				});
				break;
			case 'onError':
				WsClientBuilder.onError((ws, error)=>{
					ws.request(1);
					callback(error);
					this._lasterror = error;
				});
				break;
			case 'onOpen':
				WsClientBuilder.onOpen((ws)=>{
					ws.request(1);
					callback();
				});
				break;
			default:
				console.log('Event name error: '+event);
				return false;
		}
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
export class WSServer extends WebSocket {
	constructor() {
		super();
	}
}
