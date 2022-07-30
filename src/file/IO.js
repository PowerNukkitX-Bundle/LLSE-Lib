// noinspection NpmUsedModulesInstalled,JSUnresolvedFunction,JSValidateJSDoc,JSUnresolvedVariable,JSUnusedGlobalSymbols

import { Files } from "java.nio.file.Files";
import { StandardCharsets } from "java.nio.charset.StandardCharsets";
import { String as JString } from "java.lang.String";
import { ByteBuffer } from "java.nio.ByteBuffer";
import { RandomAccessFile } from "java.io.RandomAccessFile";

const CharArray = Java.type("char[]");
const ByteArray = Java.type("byte[]");
const debugMode = true;

/**
 * @abstract 这是一个基于RandomAccessFile的低效IO实现
 * @todo 修改为基于NIO并行高效读取
 */
/**
 * @external java.io.InputStream
 */
/**
 * @external java.io.FileInputStream
 */
/**
 * @external java.io.File
 */
/**
 * @external java.io.RandomAccessFile
 */
/**
 * @external java.io.BufferedReader
 */
/**
 * @external java.nio.file.Path
 */

/**
 * RandomAccessFile缓存
 * @type {Map<java.nio.file.Path, java.io.RandomAccessFile>}
 */
export const rafCache = new Map();

/**
 * 错误对象缓存
 * @type {Map<java.nio.file.Path, Error>}
 */
const errCache = new Map();

/**
 * 获取存在的RandomAccessFile
 * @param path {java.nio.file.Path}
 * @returns {java.io.RandomAccessFile|null}
 */
export function getRAF(path) {
    return rafCache.get(path.toString());
}

/**
 * 新建一个RandomAccessFile
 * @param path {java.nio.file.Path}
 * @param mode {string} r => 以只读方式打开指定文件; rw => 以读取、写入方式打开指定文件。如果该文件不存在，则尝试创建文件; rws => 以读取、写入方式打开指定文件。相对于rw模式，还要求对文件的内容或元数据的每个更新都同步写入到底层存储设备; rwd => 与rws类似，只是仅对文件的内容同步更新到磁盘，而不修改文件的元数据
 * @returns {boolean}
 */
export function createRAF(path, mode = 'rw') {
    try {
        const raf = new RandomAccessFile(path.toFile(), mode);
        rafCache.set(path.toString(), raf);
        return true;
    } catch (e) {
        if (debugMode) console.error('createRAF: ' + e);
        return false;
    }
}

/**
 * 当IO库作为Job并行运行时的入口时此函数被调用
 * @param action {number} 操作代码
 * @param path {java.nio.file.Path} 路径对象
 * @param data {string|number|undefined} 操作的数据
 * @param extra {string|number|undefined} 操作的数据
 * @returns {string|SharedArrayBuffer|boolean|null} 操作结果
 */
export function main(action, path, data, extra) {
    switch (action) {
        case -2:
            return getRAF(path);
        case -1:
            return createRAF(path, data);
        case 0: //read text async
            return readText(path, data);
        case 1:
            return readLine(path);
        case 2:
            return readAllText(path);
        case 3:
            return readBuffer(path, data);
        case 4:
            return readAllBuffer(path);
        case 5:
            return writeText(path, data);
        case 6:
            return writeBuffer(path, data);
        case 7:
            return writeLine(path, data);
        case 8:
            return seekTo(path, data, extra);
        case 9:
            return resize(path, data);
        case 10:
            return getPointerPos(path);
        case 11:
            return getSize(path);
        case 12:
            return close(path);
        case 13:
            return getPreviousErr(path);
    }
}

/**
 * 读取指定数量字符的文本
 * @param path {java.nio.file.Path}
 * @param cnt {number}
 * @returns {string|null} 成功返回字符串，失败返回null
 */
export function readText(path, cnt) {
    try {
        const chars = new CharArray(cnt);
        const raf = getRAF(path);
        for (let i = 0; i < cnt; i++) {
            chars[i] = raf.readChar();
        }
        return new JString(chars);
    } catch (e) {
        if (debugMode) console.error('readText: ' + e);
        errCache.set(path.toString(), e);
        return null;
    }
}

/**
 * 读取指定数量字节的数据
 * @param path {java.nio.file.Path}
 * @param cnt {number}
 * @returns {SharedArrayBuffer|null} 成功返回Buffer，失败返回null
 */
export function readBuffer(path, cnt) {
    try {
        const bytes = new ByteArray(cnt);
        const raf = getRAF(path);
        raf.read(bytes);
        return new SharedArrayBuffer(ByteBuffer.wrap(bytes));
    } catch (e) {
        if (debugMode) console.error('readBuffer: ' + e);
        errCache.set(path.toString(), e);
        return null;
    }
}

/**
 * 读取一行文本
 * @param path {java.nio.file.Path}
 * @returns {string|null} 成功返回字符串，失败返回null
 */
export function readLine(path) {
    try {
        return getRAF(path).readLine();
    } catch (e) {
        if (debugMode) console.error('readLine: ' + e);
        errCache.set(path.toString(), e);
        return null;
    }
}

/**
 * 读取全部文本
 * @param path {java.nio.file.Path}
 * @returns {string|null} 成功返回字符串，失败返回null
 */
export function readAllText(path) {
    try {
        return Files.readString(path, StandardCharsets.UTF_8);
    } catch (e) {
        if (debugMode) console.error('readAllText: ' + e);
        errCache.set(path.toString(), e);
        return null;
    }
}

/**
 * 读取全部数据
 * @param path {java.nio.file.Path}
 * @returns {SharedArrayBuffer|null} 成功返回Buffer，失败返回null
 */
export function readAllBuffer(path) {
    try {
        return new SharedArrayBuffer(ByteBuffer.wrap(Files.readAllBytes(path)));
    } catch (e) {
        if (debugMode) console.error('readAllBuffer: ' + e);
        errCache.set(path.toString(), e);
        return null;
    }
}

/**
 * 将字符串写入文件
 * @todo JString.getBytes('UTF-8') 无法使用
 * @param path {java.nio.file.Path}
 * @param str {string}
 * @returns {boolean}
 */
export function writeText(path, str) {
    try {
        getRAF(path).write(Java.to(strToUtf8Bytes(str), "byte[]"));
        return true;
    } catch (e) {
        if (debugMode) console.error('writeText: ' + e);
        errCache.set(path.toString(), e);
        return false;
    }
}

/**
 * 字符串转utf-8 Bytes
 * @param str {string}
 * @returns {Int8Array}
 */
export function strToUtf8Bytes(str) {
    const utf8 = [];
    for (let i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i);
        if (charCode < 0x80) {
            utf8.push(charCode);
        } else if (charCode < 0x800) {
            utf8.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f));
        } else if (charCode < 0xd800 || charCode >= 0xe000) {
            utf8.push(0xe0 | (charCode >> 12), 0x80 | ((charCode >> 6) & 0x3f), 0x80 | (charCode & 0x3f));
        } else {
            i++;
            // Surrogate pair:
            // UTF-16 encodes 0x10000-0x10FFFF by subtracting 0x10000 and
            // splitting the 20 bits of 0x0-0xFFFFF into two halves
            charCode = 0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
            utf8.push(
                0xf0 | (charCode >> 18),
                0x80 | ((charCode >> 12) & 0x3f),
                0x80 | ((charCode >> 6) & 0x3f),
                0x80 | (charCode & 0x3f),
            );
        }
    }
    // 兼容汉字，ASCII码表最大的值为127，大于127的值为特殊字符
    for (let i = 0; i < utf8.length; i++) {
        const code = utf8[i];
        if (code > 127) {
            utf8[i] = code - 256;
        }
    }
    return new Int8Array(utf8);
}

/**
 * 将数据写入文件
 * @param path {java.nio.file.Path}
 * @param buffer {ArrayBuffer|SharedArrayBuffer}
 * @returns {boolean}
 */
export function writeBuffer(path, buffer) {
    try {
        // 将JS Buffer强转到Java byte[]
        // noinspection JSCheckFunctionSignatures
        getRAF(path).write(Java.to(new Int8Array(buffer), "byte[]"));
        return true;
    } catch (e) {
        if (debugMode) console.error('writeBuffer: ' + e);
        errCache.set(path.toString(), e);
        return false;
    }
}

/**
 * 将字符串换行后写入文件
 * @param path {java.nio.file.Path}
 * @param str {string}
 * @returns {boolean}
 */
export function writeLine(path, str) {
    return writeText(path, str + "\n");
}

/**
 * 移动文件指针
 * @param path {java.nio.file.Path}
 * @param newPos {number} long，文件指针位置
 * @param isRelative {boolean} 是否是相对当前文件指针位置移动
 * @returns {boolean}
 */
export function seekTo(path, newPos, isRelative) {
    try {
        const raf = getRAF(path);
        if (raf) {
            if (isRelative) {
                raf.seek(raf.getFilePointer() + newPos);
            } else {
                raf.seek(newPos);
            }
        } else {
            return false;
        }
    } catch (e) {
        if (debugMode) console.error('seekTo: ' + e);
        return false;
    }
}

/**
 * 设置文件大小
 * @param path {java.nio.file.Path}
 * @param newSize {number} 新文件大小
 * @returns {boolean}
 */
export function resize(path, newSize) {
    const raf = getRAF(path);
    if (raf) {
        try {
            raf.setLength(newSize);
        } catch (e) {
            if (debugMode) console.error('resize: ' + e);
            errCache.set(path.toString(), e);
            return false;
        }
    } else {
        return false;
    }
}

/**
 * 获取当前文件指针位置
 * @param path {java.nio.file.Path}
 * @returns {number|null}
 */
export function getPointerPos(path) {
    const raf = getRAF(path);
    if (raf) {
        try {
            return raf.getFilePointer();
        } catch (e) {
            if (debugMode) console.error('getPointerPos: ' + e);
            errCache.set(path.toString(), e);
            return null;
        }
    } else {
        return null;
    }
}

/**
 * 获取当前文件大小
 * @param path {java.nio.file.Path}
 * @returns {number|null}
 */
export function getSize(path) {
    const raf = getRAF(path);
    if (raf) {
        try {
            return raf.length();
        } catch (e) {
            if (debugMode) console.error('getSize: ' + e);
            errCache.set(path.toString(), e);
            return null;
        }
    } else {
        return null;
    }
}

/**
 * 关闭文件
 * @param path {java.nio.file.Path}
 * @returns {boolean}
 */
export function close(path) {
    const raf = getRAF(path);
    if (raf) {
        try {
            rafCache.delete(path.toString());
            errCache.delete(path.toString());
            raf.close();
        } catch (e) {
            if (debugMode) console.error('close: ' + e);
            errCache.set(path.toString(), e);
            return false;
        }
    } else {
        return false;
    }
}

/**
 * 获取前一个错误
 * @param path {java.nio.file.Path}
 * @returns {Error|null}
 */
export function getPreviousErr(path) {
    return errCache.get(path);
}
