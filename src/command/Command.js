import {PowerNukkitX as pnx} from ':powernukkitx';
import {ParamType} from './ParamType.js';
import {IntPos} from '../object/IntPos.js';
import {FloatPos} from '../object/FloatPos.js';
import {Player} from '../object/Player.js';
import {Entity} from '../object/Entity.js';

/**
 * 注册一条顶层命令
 * @param cmd {string} 命令
 * @param description {string} 描述文本
 * @param [permission=liteloaderlibs.command.any] {string} 执行所需权限0~2
 * @param [flag=0x80] {number} 默认值
 * @param [alias] {string} 命令别名
 * @returns {Command} 指令对象
 */
export class Command {
    constructor(cmd, description, permission = 'liteloaderlibs.command.any', flag, alias) {
        this._optional = {};// 存储 可选参数
        this._mandatory = {};// 存储 必选参数
        this._enum = {};// 存储 枚举值
        this._permission = permission;
        this._flag = flag;
        this._commandBuilder = pnx.commandBuilder();
        this._commandBuilder.setCommandName(cmd);
        this._commandBuilder.setPermission(permission);
        this._commandBuilder.setDescription(description);
        this._lastMessage = '';
        if (alias) {
            this._commandBuilder.addAlias(alias);
        }
    }

    /**
     * 设置指令回调
     * @param callback {function} 回调函数
     * @returns {boolean} 是否成功设置
     */
    setCallback(callback) {
        this._commandBuilder.setCallback((sender, args) => {
            // see: https://docs.litebds.com/zh_CN/Development/GameAPI/Command.html#%E6%8C%87%E4%BB%A4%E5%9B%9E%E8%B0%83%E5%87%BD%E6%95%B0
            var origin = {
                type: {},// todo: 指令执行主体类型	OriginType
                name: sender.getName(),// 指令执行主体的名称	String
                pos: new FloatPos(sender.getPosition()),// 指令执行主体的坐标	FloatPos
                blockPos: new IntPos(sender.getPosition()),// 指令执行主体的方块坐标	IntPos
                entity: sender.isEntity() ? new Entity(sender) : null,// 执行指令的实体（可空）	Entity
                player: sender.isPlayer() ? Player.getPlayer(sender.getPlayer()) : null // 执行指令的玩家（可空）	Player
            };
            var output = {
                success: (msg) => {
                    this._lastMessage = '§a' + msg;
                    sender.sendMessage('§a' + msg);
                },
                error: (msg) => {
                    this._lastMessage = '§c' + msg;
                    sender.sendMessage('§c' + msg);
                },
                addMessage: (msg) => {
                    this._lastMessage = '§f' + msg;
                    sender.sendMessage('§f' + msg);
                }
            };
            var results = {};
            callback.call(this, this, origin, output, results);
        });
        return true;
    }

    /**
     * 设置指令别名
     * @param alias {string} 指令别名
     * @returns {boolean} 是否成功设置
     */
    setAlias(alias) {
        this._commandBuilder.addAlias(alias);
        return true;
    }

    /**
     * 新增一个指令枚举选项
     * @param name {string} 枚举名，用于设置参数时区分枚举
     * @param values {Array<String>} 枚举的有效值
     * @returns {boolean} 是否成功设置
     */
    setEnum(name, values) {
        if (!Array.isArray(values)) {
            return false;
        }
        this._enum[name] = values;
        return true;
    }

    /**
     * 新增一个必选参数
     * @param name {string} 参数名，用于执行指令时识别参数
     * @param type {ParamType} 命令参数类型
     * @param [enumName] {string} 枚举名（仅 ParamType 为 Enum 时有效，用于区分枚举选项）
     * @param [identifier] {string} 参数标识，特殊情况下用于唯一识别参数，一般可用 enumName 或 name 代替
     * @param [enumOptions=0] {number} 参数选项，设置为 1 可在指令提示中展开枚举选项 如 <action : TagChangeAction> 会变成 <add|remove>
     * @returns {boolean} 是否成功设置
     */
    mandatory(name, type, enumName, identifier, enumOptions) {
        var name_ = name;
        if (type === ParamType.Enum) {
            name_ = enumName;
        }
        if (this._mandatory[name_] || this._optional[name_]) {
            return false;
        }
        this._optional[name_] = [name, type, enumName, identifier, enumOptions];
        return true;
    }

    /**
     * 新增一个可选参数
     * @param name {string} 参数名，用于执行指令时识别参数
     * @param type {ParamType} 命令参数类型
     * @param [enumName] {string} 枚举名（仅 ParamType 为 Enum 时有效，用于区分枚举选项）
     * @param [identifier] {string} 参数标识，特殊情况下用于唯一识别参数，一般可用 enumName 或 name 代替
     * @param [enumOptions=0] {number} 参数选项，设置为 1 可在指令提示中展开枚举选项 如 <action : TagChangeAction> 会变成 <add|remove>
     * @returns {boolean} 是否成功设置
     */
    optional(name, type, enumName, identifier, enumOptions) {
        var name_ = name;
        if (type === ParamType.Enum) {
            name_ = enumName;
        }
        if (this._mandatory[name_] || this._optional[name_]) {
            return false;
        }
        this._optional[name_] = [name, type, enumName, identifier, enumOptions];
        return true;
    }

    /**
     * 新增一条指令重载
     * @param params {Array<string>} 参数标识符，重载所用到的参数列表，可用 参数标识符、枚举名、参数名。注意不能使用无法区分具体参数的标识符，如两个参数都叫 action 但枚举选项不同，此时应该使用枚举名而不是参数名
     * @returns {boolean} 是否成功设置
     */
    overload(params) {
        for (let i = 0, len = params.length; i < len; i++) {
            let args = [];
            let isOptional = false;
            if (this._mandatory[params[i]]) {
                args = this._mandatory[params[i]];
            } else if (this._optional[params[i]]) {
                args = this._optional[params[i]];
                isOptional = true;
            } else {
                let name = params.join("->");
                this._commandBuilder.createCommandPattern(name);
                this._commandBuilder.setCommandParameters(this._commandBuilder.getCommandParameters().keySet().removeIf(key => key == name));
                return false;
            }
            if (args[1] === ParamType.Enum) {
                this._commandBuilder.addTypeParameter(args[0], isOptional, args[1]);
            } else if (args[1] === ParamType.Block) {
                this._commandBuilder.addEnumBlockParameter(args[0], isOptional);
            } else if (args[1] === ParamType.Item) {
                this._commandBuilder.addEnumItemParameter(args[0], isOptional);
            } else if (args[1] === ParamType.ActorType) {
                this._commandBuilder.addEnumEntityParameter(args[0], isOptional);
            } else if (args[1] === ParamType.Bool) {
                this._commandBuilder.addEnumBooleanParameter(args[0], isOptional);
            } else if (args[1] === ParamType.GameMode) {
                this._commandBuilder.addEnumGameModeParameter(args[0], isOptional);
            } else {
                let enumValue = this._enum[args[2]];
                if (!enumValue) {
                    // this._commandBuilder.currentCommandParameterList = new ArrayList<>(3);
                    return false;
                }
                this._commandBuilder.addEnumParameter(enumValue[0], isOptional, enumValue[1]);
            }
        }
        this._commandBuilder.createCommandPattern(params.join("->"));
    }

    /**
     * 安装指令
     * 在对命令的所有配置完成之后，使用此函数将命令注册到 PNX 命令系统当中
     * @returns {boolean} 是否成功安装
     */
    setup() {
        this._commandBuilder.register();
        return true;
    }
}