import { EnumLevel } from 'cn.nukkit.level.EnumLevel'
import { Server } from 'cn.nukkit.Server'

/**
 * 这个js用于创建一些经常使用的代码片段,供其他文件使用,避免多次重复实现
 */
export const getLevels = function getLevels() {
    return [
        EnumLevel.OVERWORLD.getLevel(),
        EnumLevel.NETHER.getLevel(),
        EnumLevel.THE_END.getLevel()
    ];
}

export const server = Server.getInstance();