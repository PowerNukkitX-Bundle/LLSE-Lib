export function main() {
	console.log("LiteLoader-Libs start");
}

export function close() {
	print("LiteLoader-Libs close");
}

export { ll } from './libs/ll.js'
export { mc } from './libs/mc.js'
export { File } from './libs/File.js'
export { WSClient } from './libs/WebSocket.js'
export { JsonConfigFile } from './libs/JsonConfigFile.js'
