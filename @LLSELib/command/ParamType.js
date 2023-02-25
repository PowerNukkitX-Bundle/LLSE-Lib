import { CommandParamType } from 'cn.nukkit.command.data.CommandParamType';
import { CommandEnum } from 'cn.nukkit.command.data.CommandEnum';

/**
 * 枚举 命令参数类型和数据值类型的对应关系如下
 * @enum {number}
 */
export class ParamType {
    /**
     * 布尔值
     * 数据值 {boolean}
     */
    static Bool = 0;
    /**
     * 整数
     * 数据值 {number}
     */
    static Int = 1;
    /**
     * 浮点数
     * 数据值 {number}
     */
    static Float = 2;
    /**
     * 字符串
     * 数据值 {string}
     */
    static String = 3;
    /**
     * 实体目标选择器 选中的实体
     * 数据值 {Array<Actor,...>}
     */
    static Actor = 4;
    /**
     * 玩家目标选择器 选中的实体
     * 数据值 {Array<Player,...>}
     */
    static Player = 5;
    /**
     * 整数坐标对象
     * 数据值 {IntPos}
     */
    static BlockPos = 6;
    /**
     * 浮点数坐标对象
     * 数据值 {FloatPos}
     */
    static Vec3 = 7;
    /**
     * 原始字符串（可包含特殊字符，如逗号空格）
     * 数据值 {string}
     */
    static RawText = 8;
    /**
     * 消息类型字符串（同 /say 指令参数，会自动展开目标选择器等）
     * 数据值 {string}
     */
    static Message = 9;
    /**
     * Json字符串
     * 数据值 {string}
     */
    static JsonValue = 10;
    /**
     * 物品类型
     * 数据值 {Item}
     */
    static Item = 11;
    /**
     * 方块类型
     * 数据值 {Block}
     */
    static Block = 12;
    /**
     * 效果类型字符串
     * 数据值 {string}
     */
    static Effect = 13;
    /**
     * 枚举字符串
     * 数据值{string}
     */
    static Enum = 14;
    /**
     * 可变枚举字符串
     * @todo
     * 数据值 {string}
     */
    static SoftEnum = 15;
    /**
     * 实体类型字符串
     * 数据值 {string}
     */
    static ActorType = 16;
    /**
     * 游戏模式类型字符串
     * @pnxonly
     * 数据值 {string}
     */
    static GameMode = 17;
    /**
     * 指令名称（仅供测试）
     * @todo
     * 数据值 {string}
     */
    static Command = 18;
}

/**
 * 将ParamType转为js的值，方便用于比较
 * @param {ParamType} arg 命令参数类型
 * @returns {Object | number}
 */
export function typeToObject(arg) {
    switch (arg) {
        case 0:
            return CommandEnum.ENUM_BOOLEAN;
        case 1:
            return CommandParamType.INT;
        case 2:
            return CommandParamType.FLOAT;
        case 3:
            return CommandParamType.STRING;
        case 4:
            return CommandParamType.Actor;
        case 5:
            return CommandParamType.Actor;
        case 6:
            return CommandParamType.BLOCK_POSITION;
        case 7:
            return CommandParamType.POSITION;
        case 8:
            return CommandParamType.RAWTEXT;
        case 9:
            return CommandParamType.MESSAGE;
        case 10:
            return CommandParamType.JSON;
        case 11:
            return CommandEnum.ENUM_ITEM;
        case 12:
            return CommandEnum.ENUM_BLOCK;
        case 13:
            return CommandEnum.ENUM_EFFECT;
        case 14:
            return 14;
        case 15:
            return 15;
        case 16:
            return CommandEnum.ENUM_ENTITY;
        case 17:
            return CommandEnum.ENUM_GAMEMODE;
        case 18:
            return CommandParamType.COMMAND;
        default:
            return undefined;
    }
}