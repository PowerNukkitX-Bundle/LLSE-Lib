/**
 * 这个js用于创建一些经常使用的代码片段,供其他文件使用,避免多次重复实现
 */
import { EnumLevel } from 'cn.nukkit.level.EnumLevel';
import { Server } from 'cn.nukkit.Server';
import { UUID } from 'java.util.UUID';
import { Level } from 'cn.nukkit.level.Level';

//一个全局Map 用于存储只执行一次的函数 使用UUID唯一标识
if (!contain('funMap')) {
    exposeObject('funMap', new Map());
}

export const funMap = contain('funMap');

/**
 * @return {Level[]}
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