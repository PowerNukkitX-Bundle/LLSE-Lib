// noinspection NpmUsedModulesInstalled,JSUnresolvedFunction,JSValidateJSDoc

import {FileChannel} from "java.nio.channels.FileChannel";
import {Files} from "java.nio.file.Files";
import {Paths} from "java.nio.file.Paths";
import {CharBuffer} from "java.nio.CharBuffer";
import {StandardOpenOption} from "java.nio.file.StandardOpenOption";
import {JString} from "java.lang.String";

const CharArray = Java.type("char[]");

/**
 * 当IO库作为Job并行运行时的入口
 * @param action {number} 操作代码
 * @param path {java.nio.file.Path} 路径对象
 * @param data {string|number} 操作的数据
 * @returns {string|SharedArrayBuffer} 操作结果
 */
export function main(action, path, data) {
    if (action === 0) { //read text async
        return readText(path, data);
    }
}


export function readText(path, cnt) {
    const chars = new CharArray(cnt);
    const reader = Files.newBufferedReader(path);
    reader.read(chars);
    return new JString(chars);
}