import { PowerNukkitX as pnx } from ':powernukkitx';
import { PermType } from '../utils/PermType.js';
import { Player, sendMessage } from '../object/Player.js';
import { Event } from '../event/Event.js';
import { Item } from '../object/Item.js';
import { Item as PNXItem } from 'cn.nukkit.item.Item';
import { Block } from '../object/Block.js';
import { ScoreObjectives } from '../object/ScoreObjectives.js';
import { Command } from '../command/Command.js';
import { SimpleForm } from '../gui/SimpleForm.js';
import { CustomForm } from '../gui/CustomForm.js';
import { NBT } from '../nbt/NBT.js';
import { NbtCompound } from '../nbt/NbtCompound.js';
import { getLevels, server } from '../utils/util.js';
import { NbtByte } from '../nbt/NbtByte.js';
import { Entity } from '../object/Entity.js';
import { IntPos } from '../object/IntPos.js';
import { FloatPos } from '../object/FloatPos.js';
import { ProtocolInfo } from 'cn.nukkit.network.protocol.ProtocolInfo';
import { Explosion } from 'cn.nukkit.level.Explosion';
import { EnumLevel } from 'cn.nukkit.level.EnumLevel';
import { Position } from 'cn.nukkit.level.Position';
import { Block as JBlock } from 'cn.nukkit.block.Block';
import { BlockState } from 'cn.nukkit.blockstate.BlockState';
import { BlockStateRegistry } from 'cn.nukkit.blockstate.BlockStateRegistry';
import { Vector3 } from 'cn.nukkit.math.Vector3';
import { Permission } from 'cn.nukkit.permission.Permission';
import { RemoteConsoleCommandSender } from 'cn.nukkit.command.RemoteConsoleCommandSender';
import { EntityItem } from 'cn.nukkit.entity.item.EntityItem';
import { Entity as PNXEntity } from 'cn.nukkit.entity.Entity';
import { Identifier } from 'cn.nukkit.utils.Identifier';
import { Random } from 'java.util.Random';
import { NBTIO } from 'cn.nukkit.nbt.NBTIO';

const PlayerCommandMap = new Map();
const ConsoleCommandMap = new Map();
server.getPluginManager().addPermission(new Permission("liteloaderlibs.command.any", "liteloader插件any权限", "true"));
server.getPluginManager().addPermission(new Permission("liteloaderlibs.command.op", "liteloader插件op权限", "op"));
server.getPluginManager().addPermission(new Permission("liteloaderlibs.command.console", "liteloader插件console权限", "false"));

/**
 * 获取当前所有已加载的实体
 * @returns {Entity[]} 实体对象列表
 */
function getAllEntities() {
    let entities = [];
    for (const argument of server.getLevels().values()) {
        entities.push(argument.getEntities());
    }
    return entities;
}

/**
 * 生成新生物并获取
 *
 * 通过此函数，在指定的位置生成一个新生物，并获取它对应的实体对象
 * @param {string} name 生物的命名空间名称，如 minectaft:creeper
 * @param {IntPos|FloatPos|number} x 生成生物的位置的坐标对象（或者使用x, y, z, dimid来确定生成位置）
 * @param {?number} y
 * @param {?number} z
 * @param {?number} dimid
 * @returns {Entity|Null} 生成的实体对象
 */
function spawnMob(name, x, y, z, dimid) {
    if (arguments.length === 2) {
        PNXEntity.createEntity(new Identifier(name), x.position).spawnToAll();
    } else if (arguments.length === 5) {
        PNXEntity.createEntity(new Identifier(name), new Position(x, y, z, getLevels()[dimid])).spawnToAll();
    }
}

/**
 * 复制生物并获取
 * 通过此函数，在指定的位置复制另一个实体，并获取它对应的实体对象
 * @param {Entity} entity 需要复制的实体对象
 * @param {IntPos|FloatPos|number} x 生成生物的位置的坐标对象（或者使用x, y, z, dimid来确定生成位置）
 * @param {?number} y
 * @param {?number} z
 * @param {?number} dimid
 * @returns {Entity|Null} 复制的实体对象
 */
function cloneMob(entity, x, y, z, dimid) {
    if (arguments.length === 2) {
        let e = entity._PNXEntity;
        let copy = PNXEntity.createEntity(e.getNetworkId(), x.position);
        let tags = e.namedTag.clone().getTags();
        for (let key in tags) {
            if (key !== "Pos") {
                copy.namedTag.put(key, tags[key]);
            }
        }
        copy.spawnToAll();
    } else if (arguments.length === 5) {
        let e = entity._PNXEntity;
        let copy = PNXEntity.createEntity(e.getNetworkId(), new Position(x, y, z, getLevels()[dimid]));
        let tags = e.namedTag.clone().getTags();
        for (let key in tags) {
            if (key !== "Pos") {
                copy.namedTag.put(key, tags[key]);
            }
        }
        copy.spawnToAll();
    }
}


/**
 * 获取世界对象
 * @param dim {string|number} 世界名或维度id
 * @returns {cn.nukkit.level.Level}
 */
function dimToLevel(dim) {
    if (isNaN(dim)) return server.getLevelByName(dim);
    else if (dim === 0) return EnumLevel.OVERWORLD.getLevel();
    else if (dim === 1) return EnumLevel.NETHER.getLevel();
    else if (dim === 2) return EnumLevel.THE_END.getLevel();
}

/**
 * 插件关闭时需要主动调用，清除boss条等
 */
function close() {
    for (const value of Player.PlayerMap.values()) {
        console.log(value.removeBossBar());
    }
}

// 💻 服务端设置 API
/**
 * 获取服务器版本
 * @returns {string} v1.18.30
 */
function getServerVersion() {
    return server.getVersion();
}

/**
 * 获取服务器协议号
 * @returns {number} v1.18.30
 */
function getServerProtocolVersion() {
    return ProtocolInfo.CURRENT_PROTOCOL;
}

/**
 * 设置Motd
 * @param {string} motd 目标 Motd 字符串
 * @returns {boolean} 是否成功
 */
function setMotd(motd) {
    server.setPropertyString('motd', motd);
    return true;
}

/**
 * 设置最大玩家数量
 * @param {number} num 最大玩家数
 * @returns {boolean} 是否成功
 */
function setMaxPlayers(num) {
    server.setMaxPlayers(num);
    return true;
}

// 🎨 游戏元素接口文档
/**
 * 执行一条命令并返回是否成功
 * @param {string} cmd 命令
 * @returns {boolean} 是否成功
 */
function runcmd(cmd) {
    return server.executeCommand(server.getConsoleSender(), cmd) > 0;
}

/**
 * 执行一条命令并返回更多信息
 * @todo 待完善
 * @param {string} cmd 命令
 * @returns {{success: boolean, output: string}} 是否成功与输出信息
 */
function runcmdEx(cmd) {
    let rconSender = new RemoteConsoleCommandSender();
    let succ = server.executeCommand(rconSender, cmd) > 0;
    return {success: succ, output: rconSender.getMessages()};
}

/**
 * 注册一条顶层命令
 * @param cmd {string} 命令
 * @param {string} description 描述文本
 * @param {number} [permission=0] 执行所需权限0~2（默认0）
 * @param {number} [flag=0x80] 默认值（默认0x80）
 * @param {string} [alias] 命令别名（默认空值）
 * @returns {Command} 指令对象
 */
function newCommand(cmd, description, permission = PermType.GameMasters, flag, alias) {
    let perm = 'liteloaderlibs.command.op';
    switch (permission) {
        case PermType.Any:
            perm = 'liteloaderlibs.command.any';
            break;
        case PermType.GameMasters:
            perm = 'liteloaderlibs.command.op';
            break;
        case PermType.Console:
            perm = 'liteloaderlibs.command.console';
            break;
    }
    return new Command(cmd, description, perm, flag, alias);
}

/**
 * 注册一个新的玩家命令（假命令）
 * @param {string} cmd 待注册的命令
 * @param {string} description 描述文本
 * @param {Function} callback 注册的这个命令被执行时，接口自动调用的回调函数。
 * @param {number} [level=0] 默认值（默认0）
 * @returns {boolean} 是否成功
 */
function regPlayerCmd(cmd, description, callback, level = 0) {
    if (server.getCommandMap().getCommand(cmd)) {// 存在于系统命令
        if (ConsoleCommandMap.has(cmd)) {// 控制台命令中存在
            PlayerCommandMap.set(cmd, function (sender, args) {
                if (sender.isPlayer() && level > 0 && !sender.isOp()) {// 权限不足时
                    return;
                }
                callback.bind(Player.getPlayer(sender))(Player.getPlayer(sender), args);// ! Handle绑定this给LLSE-Player
            });
            return true;
        }
        return false;
    }
    PlayerCommandMap.set(cmd, function (sender, args) {
        if (sender.isPlayer() && level > 0 && !sender.isOp()) {// 权限不足时
            return;
        }
        callback.bind(Player.getPlayer(sender))(Player.getPlayer(sender), args);// ! Handle绑定this给LLSE-Player
    });
    const commandBuilder = pnx.commandBuilder();
    commandBuilder.setCommandName(cmd);
    commandBuilder.setDescription(description);
    commandBuilder.setCallback((sender, args_) => {
        let args = Java.from(args_);
        if (ConsoleCommandMap.has(cmd)) {
            ConsoleCommandMap.get(cmd).call(sender, sender, args);// ! Map绑定this给sender
        }
        PlayerCommandMap.get(cmd).call(sender, sender, args);
    });
    commandBuilder.registerOld();
    return true;
}

function regConsoleCmd(cmd, description, callback) {
    if (server.getCommandMap().getCommand(cmd)) {// 存在于系统命令
        if (PlayerCommandMap.has(cmd)) {// 控制台命令中存在
            ConsoleCommandMap.set(cmd, function (sender, args) {
                if (sender.getName() !== 'CONSOLE') {// 简易的判断是否为控制台
                    return;
                }
                callback.bind(sender)(args);
            });
            return true;
        }
        return false;
    }
    ConsoleCommandMap.set(cmd, function (sender, args) {
        if (sender.getName() !== 'CONSOLE') {// 简易的判断是否为控制台
            return;
        }
        callback.bind(sender)(args);
    });
    const commandBuilder = pnx.commandBuilder();
    commandBuilder.setCommandName(cmd);
    commandBuilder.setDescription(description);
    commandBuilder.setCallback((sender, args_) => {
        let args = Java.from(args_);
        if (PlayerCommandMap.has(cmd)) {
            PlayerCommandMap.get(cmd).call(sender, sender, args);
        }
        ConsoleCommandMap.get(cmd).call(sender, sender, args);
    });
    commandBuilder.registerOld();
}

/**
 * 模拟产生一个控制台命令输出
 * @param {string} output  模拟产生的命令输出
 * @returns {boolean} 是否成功执行
 */
function sendCmdOutput(output) {
    server.getConsoleSender().sendMessage(output);
    return true;
}

/**
 * 注册指定的监听函数
 * @param {string} event 要监听的事件名
 * @param {Function} callback 注册的监听函数
 * @returns {boolean} 是否成功监听事件
 */
function listen(event, callback) {
    return Event[event].run(callback);
}

/**
 * 获取玩家对象
 * @param {string} info 玩家名/xuid
 * @returns {Player|null} 玩家对象
 */
function getPlayer(info) {
    var found = null;
    if (isNaN(info)) {// 玩家名
        if (info === 'CONSOLE' || info === 'Rcon') {// 判断是控制台|远程命令
            return Player.getPlayer(server.getConsoleSender());
        }
        var delta = 0x7FFFFFFF;
        for (const player of server.getOnlinePlayers().values()) {
            if (player.getName().toLowerCase().startsWith(info.toLowerCase())) {
                const curDelta = player.getName().length - info.length;
                if (curDelta < delta) {
                    found = player;
                    delta = curDelta;
                }
                if (curDelta === 0) {
                    break;
                }
            }
        }
    } else {// xuid
        const xuid = String(info);
        for (const player of server.getOnlinePlayers().values()) {
            if (xuid === player.getLoginChainData().getXUID()) {
                found = player;
                break;
            }
        }
    }
    if (found == null) {
        return null;
    }
    return Player.getPlayer(found);
}

/**
 * 获取在线玩家列表
 * @returns {Player[]} 玩家对象数组
 */
function getOnlinePlayers() {
    var PlayerList = [];
    for (const player of server.getOnlinePlayers().values()) {
        PlayerList.push(Player.getPlayer(player));
    }
    return PlayerList;
}

/**
 * 发给所有玩家一条消息
 * @param {string} msg 消息内容
 * @param {number} [type=0] 消息类型（默认0）
 * @returns {boolean} 是否成功
 */
function broadcast(msg, type = 0) {
    for (const player of server.getOnlinePlayers().values()) {
        sendMessage(server.getConsoleSender(), player, msg, type);
    }
    return true;
}

/**
 * 在指定位置制造一次爆炸
 * @param {IntPos | FloatPos} pos 引发爆炸的位置坐标(或者使用x,y,z,dimid来确定实体位置)
 * @param source {Entity} 设置爆炸来源的实体对象，可以为 Null
 * @param power {Float} 爆炸的威力值，影响爆炸的伤害大小和破坏范围
 * @param range {Float} 爆炸的范围半径，影响爆炸的波及范围
 * @param isDestroy {boolean} 爆炸是否破坏方块
 * @param isFire {boolean} 爆炸结束后是否留下燃烧的火焰
 * @returns {boolean} 是否成功制造爆炸
 */
function explode(x, y, z, dimid, source, power, range, isDestroy, isFire) {
    let explode
    if (arguments.length === 6) {
        explode = new Explosion(x, range, source)
        explode.doesDamage = isDestroy;
        explode.setIncendiary(isFire);
        return explode.explode();
    } else if (arguments.length === 9) {
        explode = new Explosion(new Position(x, y, z, dimToLevel(dimid)), range, source)
        explode.doesDamage = isDestroy;
        explode.setIncendiary(isFire);
        return explode.explode();
    } else throw new Error("mc.js explode()参数错误");
}

// 物品对象
/**
 * 生成新的物品对象
 * @param {String} name 物品的标准类型名，如 minecraft:bread
 * @param {number} count 物品堆叠数量
 * @args1 name, count
 * @args2 NbtCompound
 * @returns {Item|null}
 */
function newItem(name, count) {
    let item = new Item(name, count);
    if (item.isNull()) {
        return null;
    }
    return item;
}

/**
 * 根据物品对象生成掉落物实体
 *
 * @param item {Item}
 * @param pos {IntPos|FloatPos}
 * @returns {Entity|null}
 */
function spawnItem(item, pos) {
    /*
    args1: item,pos
    args2: item,x,y,z,dimid
    */
    let position, thisitem;
    if (arguments.length === 5) {
        const level = server.getLevel(arguments[4]);
        position = Position.fromObject(new Vector3(arguments[1], arguments[2], arguments[3]), level);
    } else if (arguments.length === 2) {
        if (pos instanceof Position) {
            position = pos;
        } else {
            position = pos.position;
        }
    } else {
        throw 'Wrong number of parameters.';
    }
    if (item instanceof PNXItem) {
        thisitem = item;
    } else if (item instanceof Item) {
        thisitem = item._PNXItem;
    }
    if (thisitem.getId() !== 0 && thisitem.getCount() > 0) {
        let itemEntity = new EntityItem(
            position.getLevel().getChunk(position.getX() >> 4, position.getZ() >> 4, true),
            PNXEntity.getDefaultNBT(position, new Vector3(0, 0, 0), new Random().nextFloat() * 360, 0)
                .putShort("Health", 5)
                .putCompound("Item", NBTIO.putItemHelper(thisitem))
                .putShort("PickupDelay", 10));
        if (itemEntity != null) {
            itemEntity.spawnToAll();
            return new Entity(itemEntity);
        } else return null;
    }
    return null;
}

// 表单窗口相关
/**
 * 构建一个空的简单表单对象
 * @returns {SimpleForm} 空的简单表单对象
 */
function newSimpleForm() {
    return new SimpleForm();
}

/**
 * 构建一个空的自定义表单对象
 * @returns {CustomForm} 空的自定义表单对象
 */
function newCustomForm() {
    return new CustomForm();
}

// 记分榜相关
/**
 * 移除一个已存在的计分项
 * @param {string} name 计分项名称
 * @returns {boolean} 是否清除成功
 */
function removeScoreObjective(name) {
    const manager = server.getScoreboardManager();
    if (manager.hasScoreboard(name)) {
        manager.removeScoreBoard(name);
        return true;
    }
    return false;
}

/**
 * 使计分项停止显示
 * @param {string} slot 显示槽位名称字符串，可以为 sidebar/belowname/list
 * @returns {boolean} 是否清除成功
 */
function clearDisplayObjective(slot) {
    const manager = server.getScoreboardManager();
    switch (slot) {
        case 'sidebar': {
            slot = DisplaySlot.SIDEBAR;
            break;
        }
        case 'belowname': {
            slot = DisplaySlot.BELOW_NAME;
            break;
        }
        case 'list': {
            slot = DisplaySlot.LIST;
            break;
        }
        default: {
            return false;
        }
    }
    manager.removeDisplay(slot);
    return true;
}

//📦 方块对象 API
/**
 * 通过坐标获取方块
 * @param {number} x x
 * @param {number} y y
 * @param {number} z z
 * @param {number} dimid 维度ID
 * @args1 pos
 * @args2 x, y, z, dim
 * @args3 x, y, z, dimid
 * @returns {Block|null} 方块对象
 */
function getBlock(x, y, z, dimid) {
    if (arguments.length === 4) {
        const level = dimToLevel(dimid);
        if (level === null) {
            return null;
        }
        return Block.get(Position.fromObject(new Vector3(x, y, z), level).getLevelBlock());
    } else if (arguments.length === 1) {
        return Block.get(x.position.getLevelBlock());// Java Position
    } else {
        throw 'error arguments: ' + JSON.stringify([...arguments]);
    }
}

/**
 * 设置指定位置的方块
 * @param {number} x x
 * @param {number} y y
 * @param {number} z z
 * @param {number} dimid 维度ID
 * @param {string|Block|NbtCompound} block 要设置成的方块标准类型名（如 minecraft:stone）、方块对象或方块 NBT 数据
 * @param {number} [tiledata=0] 方块状态值（默认0）
 * @args1 pos, block, tiledata = 0
 * @args2 x, y, z, dim, block, tiledata = 0
 * @args3 x, y, z, dimid, block, tiledata = 0
 * @returns {boolean} 是否成功设置
 */
function setBlock(x, y, z, dimid, block, tiledata = 0) {
    var _pos, _block;
    if (arguments.length === 5 || arguments.length === 6) {// 5 个参数
        const level = dimToLevel(dimid);
        if (level === null) {
            return false;
        }
        _pos = Position.fromObject(new Vector3(x, y, z), level).getLevelBlock();
        _block = block;
    } else if (arguments.length === 2 || arguments.length === 3) {// 2 个参数
        _pos = x.position;
        _block = y;
        if (isNaN(z)) {// 设置默认值
            tiledata = 0;
        } else {
            tiledata = z;
        }
    } else {
        throw 'error arguments: ' + JSON.stringify([...arguments]);
    }
    if (!isNaN(_block)) _block = Number(_block);
    switch (_block.constructor.name) {
        case 'Number':
            try {
                _block = JBlock.get(_block, tiledata);
            } catch(err){
                _block = JBlock.get(blockid, 0);
            }
            break;
        case 'String':
            var blockid = _block.indexOf(":air") > -1 ? 0 : BlockStateRegistry.getBlockId(_block);
            if (!blockid && blockid != 0) {
                console.log(blockid)
                console.error('Unknow block: ' + _block);
                return false;
            }
            try {
                _block = JBlock.get(blockid, tiledata);
            } catch(err){
                _block = JBlock.get(blockid, 0);
            }
            break;
        case 'Block':
            _block = _block._PNXBlock;
            break;
        case 'NbtCompound':
            let state = _block.getData('name');
            let states = _block.getData('states');//还是NBTCompound
            if (!states) {
                var blockid = state.indexOf(":air") > -1 ? 0 : BlockStateRegistry.getBlockId(state);
                if (!blockid && isNaN(blockid)) {
                    console.error('Unknow block spacename: ' + state);
                    return false;
                }
                _block = JBlock.get(blockid, 0);
                break;
            }
            for (let key of states.getKeys()) {
                let tag = states.getTag(key);
                if (tag instanceof NbtByte) {
                    state += ';' + key + '=' + tag.get();
                } else {
                    let value = tag.get();
                    let res = isNaN(value) ? value : Number(value);
                    state += ';' + key + '=' + String(res);
                }
            }
            try {
                _block = BlockState.of(state).getBlock();
            } catch (err) {
                console.error('Unknow states: ' + state);
                return false;
            }
            break;
        default:
            throw 'Error type: ' + _block.constructor.name + ' Error block: ' + _block;
    }
    if (!_block) {
        throw 'block parsing of failed: ' + JSON.stringify([...arguments]);
    }
    return _pos.getLevel().setBlock(_pos, _block);
}

/**
 * 在指定位置生成粒子效果
 * @param {number} x x
 * @param {number} y y
 * @param {number} z z
 * @param {number} dimid 维度ID
 * @param {string} type 粒子效果名例如 minecraft:heart_particle
 * @args1 pos, type
 * @args2 x, y, z, dim, type
 * @args3 x, y, z, dimid, type
 * @returns {boolean} 是否成功生成
 */
function spawnParticle(x, y, z, dimid, type) {
    if (arguments.length === 5) {
        const level = dimToLevel(dimid);
        if (level === null) {
            return false;
        }
        let pos = Position.fromObject(new Vector3(x, y, z), level);
        pos.level.addParticleEffect(pos.asVector3f(), type, -1, pos.level.getDimension(), null);
        return true;
    } else if (arguments.length === 2) {
        let pos = x.position;// Java Position
        pos.level.addParticleEffect(pos.asVector3f(), y, -1, pos.level.getDimension(), null);
        return true;
    } else {
        throw 'error arguments: ' + JSON.stringify([...arguments]);
    }
}

//📝 计分板 API
/**
 * 创建一个新的计分项
 * 此接口的作用类似命令 /scoreboard objectives add <name> <displayName> dummy
 * @param {string} name 计分项名称
 * @param {string} displayName 计分项显示名称
 * @returns {ScoreObjectives|null} 新增创建的计分项对象
 */
function newScoreObjective(name, displayName) {
    return ScoreObjectives.newScoreObjective(...arguments);
}

/**
 * 获取某个已存在的计分项
 * @param {string} name 要获取的计分项名称
 * @returns {ScoreObjectives|null} 对应的计分项对象
 */
function getScoreObjective(name) {
    return ScoreObjectives.getObjectives(...arguments);
}

/**
 * 获取所有计分项
 * 此接口的作用类似命令 /scoreboard objectives list
 * @returns {ScoreObjectives[]} 计分板系统记录的所有计分项对象
 */
function getAllScoreObjectives() {
    return ScoreObjectives.getAllScoreObjectives();
}

/**
 * 获取某个处于显示状态的计分项
 * @param {string} slot 待查询的显示槽位名称，可以为"sidebar"/"belowname"/"list"
 * @returns {ScoreObjectives|null} 正在slot槽位显示的计分项
 */
function getDisplayObjective(slot) {
    return ScoreObjectives.getDisplayObjective(slot);
}

/**
 * 生成一个整数坐标对象
 * @param {number} x x 坐标
 * @param {number} y y 坐标
 * @param {number} z z 坐标
 * @param {number|string} dimid 维度ID：0 代表主世界，1 代表下界，2 代表末地
 * @returns {IntPos|null} 错误的世界则返回null
 */
function newIntPos(x, y, z, dimid) {
    let level = dimToLevel(dimid);
    if (!level) return null;
    let pos = new Position(x, y, z, level);
    return new IntPos(pos);
}

/**
 * 生成一个浮点数坐标对象
 * @param {number} x x 坐标
 * @param {number} y y 坐标
 * @param {number} z z 坐标
 * @param {number|string} dimid 维度ID：0 代表主世界，1 代表下界，2 代表末地
 * @returns {IntPos|null} 错误的世界则返回null
 */
function newFloatPos(x, y, z, dimid) {
    let level = dimToLevel(dimid);
    if (!level) return null;
    let pos = new Position(x, y, z, level);
    return new FloatPos(pos);
}

/**
 * 获取结构NBT
 * @todo 未实现实体Entities
 * @param {IntPos} pos1 位置1
 * @param{IntPos}  pos2 pos2 位置2
 * @param {boolean} ignoreBlocks 是否忽略方块(默认false)
 * @param {boolean} ignoreEntities 是否忽略实体(默认false)
 * @returns {NbtCompound} 结构的NBT数据
 */
function getStructure(pos1, pos2, ignoreBlocks = false, ignoreEntities = false) {
    let minPos = [pos1.x, pos1.y, pos1.z];
    let maxPos = [pos2.x, pos2.y, pos2.z];
    if (minPos[0] > maxPos[0]) {
        maxPos[0] = pos1.x;
        minPos[0] = pos2.x;
    }
    if (minPos[1] > maxPos[1]) {
        maxPos[1] = pos1.y;
        minPos[1] = pos2.y;
    }
    if (minPos[2] > maxPos[2]) {
        maxPos[2] = pos1.z;
        minPos[2] = pos2.z;
    }
    const size = [maxPos[0] - minPos[0] + 1, maxPos[1] - minPos[1] + 1, maxPos[2] - minPos[2] + 1];
    const snbt = {
        "structure_world_origin": minPos,
        "format_version": 1,
        "size": size,
        "structure": {
            "entities": [],
            "palette": {
                "default": {
                    "block_palette": [{
                        "name": "minecraft:air",
                        //"version": 1786555,
                        "states": {}
                    }],
                    "block_position_data": {}
                }
            },
            "block_indices": [
                [],
                []
            ]
        }
    }
    
    const level = dimToLevel(pos1.dim);
    //level.getChunk(minPos[0] >> 4, minPos[2] >> 4).getSection(minPos[1] & 0x0f)
    //sec.getBlockState(x, y, z)

    let paletteMap = [];
    for (let x = minPos[0]; x <= maxPos[0]; ++x) {
        if (ignoreBlocks) { // 忽略方块时直接返回
            break;
        }
        for (let y = minPos[1]; y <= maxPos[1]; ++y) {
            for (let z = minPos[2]; z <= maxPos[2]; ++z) {
                let block = mc.getBlock(x, y, z, pos1.dim);
                if (block.type === "minecraft:air") {
                    snbt.structure.block_indices[0].push(0);
                    snbt.structure.block_indices[1].push(0);
                    continue;
                }
                const blockSNBT = block.getNbt().toString();
                let index = paletteMap.indexOf(blockSNBT);
                if (index === -1) {
                    paletteMap.push(blockSNBT);
                    snbt.structure.palette.default.block_palette.push(JSON.parse(blockSNBT));
                    index = snbt.structure.palette.default.block_palette.length - 1;
                } else {
                    index++;
                }
                snbt.structure.block_indices[0].push(index);
                snbt.structure.block_indices[1].push(0);
            }
        }
    }
    let data = JSON.stringify(snbt).replace(/_bit":0/g, '_bit":0b').replace(/_bit":1/g, '_bit":1b');
    return NBT.parseSNBT(data);
}

/**
 * 设置结构NBT
 * @todo 实现镜像与旋转
 * @param {NbtCompound} nbt 结构的NBT数据
 * @param {IntPos} pos 放置的位置，向递增坐标的方向构建
 * @param {number} mirror 镜像 0:None 1:X 2:Z 3:XZ
 * @param {number} rotation 旋转 0:None 1:Rotate90 2:Rotate180 3:Rotate270
 * @returns {boolean} 是否成功
 */
function setStructure(nbt, pos, mirror = 0, rotation = 0) {
    var data = JSON.parse(nbt.toString());
    if (data.format_version !== 1) {
        console.log("§emcstructure file version(" + data.format_version + ")");
    }
    var size = data.size;
    var blockPalette = data.structure.palette.default.block_palette;
    var [paletteList, damageList] = data.structure.block_indices;// ZYX
    var index = 0;
    for (let x = 0; x < size[0]; x++) {
        for (let y = 0; y < size[1]; y++) {
            for (let z = 0; z < size[2]; z++) {
                const block = paletteList[index] > -1 ? blockPalette[paletteList[index]] : {
                    name: "minecraft:air",
                    states: {},
                    "version": 17959425
                };
                mc.setBlock(x + pos.x, y + pos.y, z + pos.z, pos.dim, NBT.parseSNBT(JSON.stringify(block).replaceAll('_bit":0', '_bit":0b').replaceAll('_bit":1', '_bit":1b')));
                index++;
            }
        }
    }
    return true;
}

export const mc = {
    //PNX 的API
    close,
    //💻 服务端设置 API
    getBDSVersion: getServerVersion,
    getServerProtocolVersion,
    setMotd,
    setMaxPlayers,
    //🎨 游戏元素接口文档
    runcmd,
    runcmdEx,
    newCommand,
    regPlayerCmd,
    regConsoleCmd,
    sendCmdOutput,
    getAllEntities,
    spawnMob,
    cloneMob,
    listen,
    getPlayer,
    getOnlinePlayers,
    broadcast,
    explode,
    // 物品对象
    newItem,
    spawnItem,
    // 表单窗口相关
    newSimpleForm,
    newCustomForm,
    // 方块对象API
    getBlock,
    setBlock,
    spawnParticle,
    newIntPos,
    newFloatPos,
    getStructure,
    setStructure,
    //📝 计分板 API
    removeScoreObjective,
    clearDisplayObjective,
    newScoreObjective,
    getScoreObjective,
    getAllScoreObjectives,
    getDisplayObjective
}
