import { JsonConfigFile } from './libs/JsonConfigFile.js';

export function main() {
	console.log("LiteLoader-Libs start");
}

export function close() {
	print("LiteLoader-Libs close");
}

/**
 * @deprecated since version LLSE-v0.0.7
 */
export var data = {
	/**
	 * @see JsonConfigFile
	 * @todo 实现ini配置文件
	 */
	openConfig: function (path, type, defaultContext){
		if (type === 'json') {
			return new JsonConfigFile(path, defaultContext);
		} else if (type === 'ini') {
			return false;
		} else {
			return false;
		}
	}
}

/**
 * @deprecated since version LLSE-v0.0.7
 */
export var log = function() {
	console.log.apply(this, arguments);
}

export { Format } from './utils/Format.js';
export { PermType } from './utils/PermType.js';
export { system } from './utils/system.js';
export { ll } from './libs/ll.js';
export { mc } from './libs/mc.js';
export { File } from './libs/File.js';
export { WSClient } from './libs/WebSocket.js';
export { NBT } from './nbt/NBT.js';
export { JsonConfigFile };
