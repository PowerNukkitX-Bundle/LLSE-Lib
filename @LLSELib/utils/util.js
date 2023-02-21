/**
 * 这个js用于创建一些经常使用的代码片段,供其他文件使用,避免多次重复实现
 */
import { EnumLevel } from 'cn.nukkit.level.EnumLevel';
import { Server } from 'cn.nukkit.Server';
import { UUID } from 'java.util.UUID';
import { URL as JURL } from "java.net.URL";
import { File as JFile } from "java.io.File";
import { Files } from "java.nio.file.Files";
import { isUndefined } from "./underscore-esm-min.js";

//一个全局Map 用于存储只执行一次的函数 使用UUID唯一标识
if (!contain('funMap')) {
    exposeObject('funMap', new Map());
}

export const funMap = contain('funMap');

/**
 * @return {cn.nukkit.level.Level[]}
 */
export const getLevels = function getLevels() {
    return [
        EnumLevel.OVERWORLD.getLevel(),
        EnumLevel.NETHER.getLevel(),
        EnumLevel.THE_END.getLevel()
    ];
}

export const onlyOnceExecute = function onlyExecute(callback, id) {
    if (!funMap.has(id)) {
        funMap.set(id, callback);
        callback.call(null);
    }
}

export const randomUUID = UUID.randomUUID;

export const nameUUIDFromBytes = UUID.nameUUIDFromBytes;

export const server = Server.getInstance();

/**
 * @param {string} url 下载地址
 * @param {string} folder 目标保存文件夹
 * @param {string} fileName 目标名
 * @param {?function} callback 如果文件不存在，则在下载完成之后，执行该回调函数
 */
export function download(url, folder, fileName, callback) {
    const jurl = new JURL(url);
    const jfolder = new JFile(folder);
    const jfile = new JFile(jfolder, fileName);

    if (!jfolder.exists()) {
        if (jfolder.mkdirs()) {
            console.info("Created " + folder);
        }
    }

    if (!jfile.isFile()) {
        try {
            console.info("Get library from: " + jurl);
            Files.copy(jurl.openStream(), jfile.toPath());
            console.info("Get library " + fileName + " done!");
            if (!isUndefined(callback)) {
                callback.call(null);
            }
        } catch (e) {
            console.error("下载" + fileName + "失败,具体异常:" + e);
            return false;
        }
    }
    return true;
}