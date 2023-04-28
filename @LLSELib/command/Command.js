import { PowerNukkitX as pnx } from ':powernukkitx';
import { ParamType } from './ParamType.js';
import { IntPos } from '../object/IntPos.js';
import { FloatPos } from '../object/FloatPos.js';
import { Player } from '../object/Player.js';
import { Entity } from '../object/Entity.js';
import { CommandEnum } from 'cn.nukkit.command.data.CommandEnum';
import { CommandParamOption } from 'cn.nukkit.command.data.CommandParamOption';
import { CommandParamType } from 'cn.nukkit.command.data.CommandParamType';
import { ConsoleCommandSender } from 'cn.nukkit.command.ConsoleCommandSender';
import { PlayersNode } from 'cn.nukkit.command.tree.node.PlayersNode';
import { RemoteConsoleCommandSender } from 'cn.nukkit.command.RemoteConsoleCommandSender';
import { isArray, isNumber, isString, isUndefined } from '../utils/underscore-esm-min.js';
import { Item } from "../object/Item.js";
import { Block } from "../object/Block.js";
import { OriginType } from './OriginType.js';

/**@typedef ParamType number*/
export class Command {
    /**
     保存全部参数，可以是可选也可以是非可选
     结构:
     {
        name: 参数名,
        type: 参数类型,
        enumName: 枚举名,
        identifier: 备用唯一标识符,
        enumOptions: 枚举选项,
        isOptional: 是否可选
    }
     @type {Map<string,Array>}
     */
    _params = new Map();
    /**
     保存全部枚举
     @type {Map<string,Array<string>>}
     */
    _enum = new Map();

    /**
     标记overload数量
     @type {number}
     */
    _overloadCount = 0;
    _pnxCmd;//PNX的命令对象

    /**
     * 注册一条顶层命令
     * @param {string} cmd  待注册的命令名
     * @param {string} description  命令描述文本
     * @param {string} [permission='liteloaderlibs.command.any'] （可选参数）指令执行所需权限
     * @param {number} [flag=0x80]  默认值=0x80
     * @param {string} [alias]  命令别名
     * @returns {Command} 指令对象
     */
    constructor(cmd, description, permission = 'liteloaderlibs.command.op', flag, alias) {
        this._permission = permission//保留NK内部权限以待后续扩展，先暂时使用简易判断
        this._flag = flag;//暂时忽略
        this._commandBuilder = pnx.commandBuilder();
        this._commandBuilder.setCommandName(cmd);
        this._commandBuilder.setPermission(permission);
        this._commandBuilder.setDescription(description);
        if (alias) {
            this._commandBuilder.addAlias(alias);
        }
    }

    /**
     * 设置指令回调
     * @param  {function} callback 回调函数
     * @returns {boolean} 是否成功设置
     */
    setCallback(callback) {
        this._commandBuilder.setCallback((sender, result, log) => {
            switch (this._permission) {
                case 'liteloaderlibs.command.any':
                    break;
                case 'liteloaderlibs.command.op':
                    if (!sender.isOp()) return 0;
                    break;
                case 'liteloaderlibs.command.console':
                    if (!(sender instanceof ConsoleCommandSender)) return 0;
                    break;
            }
            let origin = {
                type: {},// todo: 指令执行主体类型	OriginType int
                name: sender.getName(),// 指令执行主体的名称	String
                pos: new FloatPos(sender.getPosition()),// 指令执行主体的坐标	FloatPos
                blockPos: new IntPos(sender.getPosition()),// 指令执行主体的方块坐标	IntPos
                entity: sender.isEntity() ? new Entity(sender) : null,// 执行指令的实体（可空）	Entity
                player: sender.isPlayer() ? Player.getPlayer(sender.asPlayer()) : null // 执行指令的玩家（可空）	Player
            };
            if (sender.isEntity()) {// TODO: 还需要更多类型的判断
                origin.type = OriginType.Player;
            } else if (sender.isEntity()) {
                origin.type = OriginType.Actor;
            } else if (sender instanceof RemoteConsoleCommandSender || sender instanceof ConsoleCommandSender) {
                origin.type = OriginType.Server;
            }
            let output = {
                success: (msg) => {
                    log.addSuccess(msg).output();
                },
                error: (msg) => {
                    log.addError(msg).output();
                },
                addMessage: (msg) => {
                    log.addMessage('§f' + msg).output();
                }
            };
            let r = {};
            let overloadName = result.getKey();
            let list = result.getValue();
            let params = this._pnxCmd.getCommandParameters(overloadName);
            let i = 0;
            for (const param of params) {
                if (!list.hasResult(i)) r[param.name] = null;
                else if (param.type === CommandParamType.RAWTEXT) {//RawText适应性改变
                    r[param.name] = list.getResult(i).toString();
                } else if (param.type === CommandParamType.POSITION) {
                    r[param.name] = new FloatPos(list.getResult(i));
                } else if (param.type === CommandParamType.BLOCK_POSITION) {
                    r[param.name] = new IntPos(list.getResult(i));
                } else if (param.type === CommandParamType.TARGET) {
                    let result = [];
                    let targets = list.getResult(i);
                    if (param.paramNode instanceof PlayersNode) {
                        targets.forEach((v) => {
                            result.push(new Player(v));
                        });
                    } else {
                        targets.forEach((v) => {
                            result.push(new Entity(v));
                        });
                    }
                    r[param.name] = result;
                } else if (param.enumData === CommandEnum.ENUM_ITEM) {
                    r[param.name] = new Item(list.getResult(i));
                } else if (param.enumData === CommandEnum.ENUM_BLOCK) {
                    r[param.name] = new Block(list.getResult(i));
                } else r[param.name] = list.get(i).get();
                i++;
            }
            callback.call(this, this, origin, output, r);
        });
        return true;
    }

    /**
     * 设置指令别名
     * @param {string} alias 指令别名
     * @returns {boolean} 是否成功设置
     */
    setAlias(alias) {
        this._commandBuilder.addAlias(alias);
        return true;
    }

    /**
     * 新增一个指令枚举选项
     * @param {string} name 枚举名，用于设置参数时区分枚举
     * @param {Array<String>} values 枚举的有效值
     * @returns {boolean} 是否成功设置
     */
    setEnum(name, values) {
        if (!isArray(values)) {
            return false;
        }
        this._enum.set(name, values);
        return true;
    }

    /**
     * 新增一个必选参数
     *
     * @param {string} name  参数名，用于执行指令时识别参数
     * @param {ParamType} type  命令参数类型
     * @param {string} [enumName]  枚举名（仅 ParamType 为 Enum 时有效，用于区分枚举选项）
     * @param {string} [identifier]  参数标识，特殊情况下用于唯一识别参数，一般可用 enumName 或 name 代替
     * @param {number} [enumOptions=0]  参数选项，设置为 1 可在指令提示中展开枚举选项 如 <action : TagChangeAction> 会变成 <add|remove>
     * @returns {boolean} 是否成功设置
     */
    mandatory(name, type, enumName, identifier, enumOptions = 0) {
        let key = name;
        if (type === ParamType.Enum && !isUndefined(enumName)) {
            if (this._enum.has(enumName)) {
                key = enumName;
            } else return false;
        }
        if (isNumber(identifier)) {
            this._params.set(key, [name, type, enumName, undefined, identifier, false]);
            return true;
        } else if (isString(identifier)) key = identifier;
        this._params.set(key, [name, type, enumName, identifier, enumOptions, false]);
        return true;
    }

    /**
     * 新增一个可选参数
     * @param {string} name 参数名，用于执行指令时识别参数
     * @param {ParamType} type 命令参数类型
     * @param {string} [enumName] 枚举名（仅 ParamType 为 Enum 时有效，用于区分枚举选项）
     * @param {string} [identifier] 参数标识，特殊情况下用于唯一识别参数，一般可用 enumName 或 name 代替
     * @param {number} [enumOptions=0] 参数选项，设置为 1 可在指令提示中展开枚举选项 如 <action : TagChangeAction> 会变成 <add|remove>
     * @returns {boolean} 是否成功设置
     */
    optional(name, type, enumName, identifier, enumOptions) {
        let key = name;
        if (type === ParamType.Enum && !isUndefined(enumName)) {
            if (this._enum.has(enumName)) {
                key = enumName;
            } else return false;
        }
        if (isNumber(identifier)) {
            this._params.set(key, [name, type, enumName, undefined, identifier, true]);
            return true;
        } else if (isString(identifier)) key = identifier;
        this._params.set(key, [name, type, enumName, identifier, enumOptions, true]);
        return true;
    }

    /**
     * 新增一条指令重载,作用是实现多条子命令,类似于PNX中的CommandParameters
     * @param {Array<string>} params 参数标识符，重载所用到的参数列表，可用 参数标识符、枚举名、参数名。注意不能使用无法区分具体参数的标识符，如两个参数都叫 action 但枚举选项不同，此时应该使用枚举名而不是参数名
     * @returns {boolean} 是否成功设置
     */
    overload(params) {
        for (let i = 0, len = params.length; i < len; i++) {
            let args = this._params.get(params[i]);
            if (isUndefined(args)) return false;
            if (args[1] === ParamType.Enum) {
                let options = [];
                if (args[4] === 1) options.push(CommandParamOption.SUPPRESS_ENUM_AUTOCOMPLETION);
                this._commandBuilder.addCustomEnumParameter(args[0], args[5], new CommandEnum(args[2], this._enum.get(args[2])), null, options);
            } else if (args[1] === ParamType.Bool) {
                this._commandBuilder.addEnumBooleanParameter(args[0], args[5]);
            } else if (args[1] === ParamType.Int) {
                this._commandBuilder.addIntParameter(args[0], args[5]);
            } else if (args[1] === ParamType.Float) {
                this._commandBuilder.addFloatParameter(args[0], args[5]);
            } else if (args[1] === ParamType.String) {
                this._commandBuilder.addStringParameter(args[0], args[5]);
            } else if (args[1] === ParamType.Actor) {
                this._commandBuilder.addTargetParameter(args[0], args[5]);
            } else if (args[1] === ParamType.Player) {
                this._commandBuilder.addCustomTypeParameter(args[0], args[5], CommandParamType.TARGET, new PlayersNode(), []);
            } else if (args[1] === ParamType.BlockPos) {
                this._commandBuilder.addBlockPositionParameter(args[0], args[5]);
            } else if (args[1] === ParamType.Vec3) {
                this._commandBuilder.addPositionParameter(args[0], args[5]);
            } else if (args[1] === ParamType.RawText) {
                this._commandBuilder.addTypeParameter(args[0], args[5], CommandParamType.RAWTEXT);
            } else if (args[1] === ParamType.Message) {
                this._commandBuilder.addMessageParameter(args[0], args[5]);
            } else if (args[1] === ParamType.JsonValue) {
                this._commandBuilder.addJsonParameter(args[0], args[5]);
            } else if (args[1] === ParamType.Item) {
                this._commandBuilder.addEnumItemParameter(args[0], args[5]);
            } else if (args[1] === ParamType.Block) {
                this._commandBuilder.addEnumBlockParameter(args[0], args[5]);
            } else if (args[1] === ParamType.Effect) {
                this._commandBuilder.addEnumParameter(args[0], args[5], CommandEnum.ENUM_EFFECT);
            } else if (args[1] === ParamType.ActorType) {
                this._commandBuilder.addEnumEntityParameter(args[0], args[5]);
            } else if (args[1] === ParamType.Command) {
                this._commandBuilder.addSubCommandParameter(args[0], args[5]);
            } else {
                return false;
            }
        }
        this._commandBuilder.createCommandPattern("overload" + this._overloadCount);
        this._overloadCount++;
    }

    /**
     * 安装指令
     * 在对命令的所有配置完成之后，使用此函数将命令注册到 PNX 命令系统当中
     * @returns {boolean} 是否成功安装
     */
    setup() {
        if (this._commandBuilder.register()) {
            this._pnxCmd = this._commandBuilder.getBuildCommand();
            return true;
        } else return false;
    }
}
