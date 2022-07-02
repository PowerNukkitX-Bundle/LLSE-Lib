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

export var colorLog = function(color, ...args) {
	var front = '';
	switch (color) {
		case 'sky_blue':
		case 'blue':
			front = '§b';
			break;
		case 'green':
			front = '§a';
			break;
		case 'red':
			front = '§c';
			break;
		case 'yellow':
			front = '§e';
			break;
		case 'pink':
			front = '§d';
			break;
		case 'dk_blue':
			front = '§1';
			break;
		case 'dk_green':
			front = '§2';
			break;
		case 'dk_red':
			front = '§4';
			break;
		case 'dk_yellow':
			front = '§6';
			break;
		case 'bt_blue':
			front = '§3';
			break;
		case 'purple':
			front = '§5';
			break;
		case 'white':
			front = '§f';
			break;
		case 'gray':
			front = '§7';
			break;
	}
	var arr = args.map(x => front+x);
	console.log.apply(this, arr);
}

export { Format } from './utils/Format.js';
export { PermType } from './utils/PermType.js';
export { system } from './utils/system.js';
export { logger } from './utils/logger.js';
export { ll } from './libs/ll.js';
export { mc } from './libs/mc.js';
export { File } from './libs/File.js';
export { WSClient } from './libs/WebSocket.js';
export { NBT } from './nbt/NBT.js';
export { JsonConfigFile };