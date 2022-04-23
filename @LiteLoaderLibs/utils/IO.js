// noinspection NpmUsedModulesInstalled,JSUnresolvedFunction,JSValidateJSDoc,JSUnresolvedVariable

import {InputStreamReader} from "java.io.InputStreamReader";
import {BufferedReader} from "java.io.BufferedReader";
import {Files} from "java.nio.file.Files";
import {Paths} from "java.nio.file.Paths";
import {StandardOpenOption} from "java.nio.file.StandardOpenOption";
import {JString} from "java.lang.String";
import {FileInputStream} from "java.io.FileInputStream";
import {File} from "java.io.File";

const CharArray = Java.type("char[]");

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
 * @external java.io.BufferedReader
 */
/**
 * @external java.nio.file.IOEntry._file.Path
 */

class IOEntry {
    /**
     *
     * @param file {java.io.File}
     * @param fis {java.io.FileInputStream}
     * @param reader {java.io.BufferedReader}
     */
    constructor(file, fis, reader) {
        this._file = file;
        this._fis = fis;
        this._reader = reader;
    }

    get file() {
        return this._file;
    }

    get fis() {
        return this._fis;
    }

    get reader() {
        return this._reader;
    }
}

/**
 * BufferedReader缓存
 * @type {WeakMap<java.nio.file.Path, IOEntry>}
 */
const bufferedReaderCache = new WeakMap();

/**
 * 获取或新建BufferedReader
 * @param path {java.nio.file.Path}
 * @returns {IOEntry}
 */
function getIO(path) {
    if (bufferedReaderCache.has(path)) {
        const entry = bufferedReaderCache.get(path);
        entry.fis.getChannel().position(0);
        entry.reader.reset();
        return entry;
    } else {
        const file = path.toFile();
        const fis = new FileInputStream(file);
        const reader = new BufferedReader(new InputStreamReader(fis, "UTF-8"));
        const entry = new IOEntry(file, fis, reader);
        bufferedReaderCache.set(path, entry);
        return entry;
    }
}

/**
 * 当IO库作为Job并行运行时的入口时此函数被调用
 * @param action {number} 操作代码
 * @param path {java.nio.file.Path} 路径对象
 * @param offset {number} 偏移量
 * @param data {string|number} 操作的数据
 * @returns {string|SharedArrayBuffer} 操作结果
 */
export function main(action, path, offset, data) {
    if (action === 0) { //read text async
        return readText(path, offset, data);
    } else if (action === 1) {
        return readLine(path, offset);
    }
}

/**
 * 读取指定数量字符的文本
 * @param path {java.nio.file.Path}
 * @param offset {number}
 * @param cnt {number}
 * @returns {string}
 */
export function readText(path, offset, cnt) {
    const chars = new CharArray(cnt);
    const reader = getIO(path).reader;
    reader.read(chars);
    return new JString(chars);
}

/**
 * 读取一行文本
 * @param path
 * @param offset
 */
export function readLine(path, offset) {
    const entry = getIO(path);
    entry.reader.skip(offset);
    return entry.reader.readLine();
}