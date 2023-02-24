import { DBSessionMap } from "./database/DBSession.js";

export function main() {
    console.log("LLSE-Lib start");
}

export function close() {
    DBSessionMap.forEach((v) => {//统一关闭数据库
        v.close();
    });
    console.log("LLSE-Lib close");
}

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

/**
 * 异步输出（无返回值）
 * @param {any} args 待输出的变量或者函数，可以多个参数。
 */
export const fastLog = async function (...args) {
    console.log(...args);
}

export { data } from './utils/data.js';
export { Format } from './utils/Format.js';
export { PermType } from './utils/PermType.js';
export { OriginType } from './command/OriginType.js';
export { ParamType } from './command/ParamType.js';
export { system } from './utils/system.js';
export { logger } from './utils/logger.js';
export { money } from './money/money.js';
export { ll } from './core/ll.js';
export { mc } from './core/mc.js';
export { File } from './file/File.js';
export { WSClient } from './network/WebSocket.js';
export { HttpServer, network } from './network/HttpServer.js';
export { NBT } from './nbt/NBT.js';
export { NbtByte } from './nbt/NbtByte.js';
export { NbtByteArray } from './nbt/NbtByteArray.js';
export { NbtCompound } from './nbt/NbtCompound.js';
export { NbtDouble } from './nbt/NbtDouble.js';
export { NbtEnd } from './nbt/NbtEnd.js';
export { NbtFloat } from './nbt/NbtFloat.js';
export { NbtInt } from './nbt/NbtInt.js';
export { NbtList } from './nbt/NbtList.js';
export { NbtLong } from './nbt/NbtLong.js';
export { NbtShort } from './nbt/NbtShort.js';
export { NbtString } from './nbt/NbtString.js';
export { JsonConfigFile } from './config/JsonConfigFile.js';
export { IniConfigFile } from './config/IniConfigFile.js';
export { i18n } from './utils/i18n.js';
export { BinaryStream } from './object/BinaryStream.js';
