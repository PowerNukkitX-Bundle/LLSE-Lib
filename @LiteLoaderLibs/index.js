export function main() {
    console.log("LiteLoader-Libs start");
}

export function close() {
    print("LiteLoader-Libs close");
}

/**
 * @deprecated since version LLSE-v0.0.7
 */
export const log = function () {
    console.log.apply(this, arguments);
}

export const colorLog = function (color, ...args) {
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
    var arr = args.map(x => front + x);
    console.log.apply(this, arr);
}
export { data } from './utils/data.js';
export { Format } from './utils/Format.js';
export { PermType } from './utils/PermType.js';
export { system } from './utils/system.js';
export { logger } from './utils/logger.js';
export { money } from './money/money.js';
export { ll } from './core/ll.js';
export { mc } from './core/mc.js';
export { File } from './file/File.js';
export { WSClient } from './network/WebSocket.js';
export { HttpServer, network } from './network/HttpServer.js';
export { NBT } from './nbt/NBT.js';
export { JsonConfigFile } from './config/JsonConfigFile.js';
export { IniConfigFile } from './config/IniConfigFile.js';
