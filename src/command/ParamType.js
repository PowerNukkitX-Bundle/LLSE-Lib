import { CommandParamType } from 'cn.nukkit.command.data.CommandParamType';
import { CommandEnum } from 'cn.nukkit.command.data.CommandEnum';

/**
 * 枚举 命令参数类型 和 数据值类型 的对应关系如下
 */
export class ParamType {
    /**
     * 布尔值
     * @type {boolean}
     */
    static Bool = 0;
    /**
     * 整数
     * @type {number}
     */
    static Int = CommandParamType.INT;
    /**
     * 浮点数
     * @type {number}
     */
    static Float = CommandParamType.FLOAT;
    /**
     * 字符串
     * @type {string}
     */
    static String = CommandParamType.STRING;
    /**
     * 实体目标选择器 选中的实体
     * @type {Array<Actor,...>}
     */
    static Actor = CommandParamType.TARGET;
    /**
     * 玩家目标选择器 选中的实体
     * @type {Array<Player,...>}
     */
    static Player = CommandParamType.TARGET;
    /**
     * 整数坐标对象
     * @type {IntPos}
     */
    static BlockPos = CommandParamType.BLOCK_POSITION;
    /**
     * 浮点数坐标对象
     * @type {FloatPos}
     */
    static Vec3 = CommandParamType.POSITION;
    /**
     * 原始字符串（可包含特殊字符，如逗号空格）
     * @type {string}
     */
    static RawText = CommandParamType.TEXT;
    /**
     * 消息类型字符串（同 /say 指令参数，会自动展开目标选择器等）
     * @type {string}
     */
    static Message = CommandParamType.MESSAGE;
    /**
     * Json字符串
     * @type {string}
     */
    static JsonValue = CommandParamType.JSON;
    /**
     * 物品类型
     * @type {Item}
     */
    static Item = 11;
    /**
     * 方块类型
     * @type {Block}
     */
    static Block = 12;
    /**
     * 效果类型字符串
     * @type {string}
     */
    static Effect = 13;
    /**
     * 枚举字符串
     * @type {string}
     */
    static Enum = 14;
    /**
     * 可变枚举字符串
     * @todo
     * @type {string}
     */
    static SoftEnum = 15;
    /**
     * 实体类型字符串
     * @type {string}
     */
    static ActorType = 16;
    /**
     * 游戏模式类型字符串
     * @pnxonly
     * @type {string}
     */
    static GameMode = 17;
    /**
     * 指令名称（仅供测试）
     * @todo
     * @type {string}
     */
    static Command = 18;

}

/**
 * 将ParamType转为js的值，方便用于比较
 * @param arg {ParamType} 命令参数类型
 * @returns {string|number}
 */
export function Type2Value(arg) {
    if (typeof (arg) != 'number') {
        return arg.getName();
    }
    return arg;
}