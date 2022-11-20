import { PowerNukkitX as pnx } from ':powernukkitx';
import { PermType } from '../utils/PermType.js';
import { Player, sendText } from '../object/Player.js';
import { Event } from '../event/Event.js';
import { Item } from '../object/Item.js';
import { Item as PNXItem } from 'cn.nukkit.item.Item';
import { Block } from '../object/Block.js';
import { ScoreObjectives } from '../object/ScoreObjectives.js';
import { Command } from '../command/Command.js';
import { SimpleForm } from '../gui/SimpleForm.js';
import { CustomForm } from '../gui/CustomForm.js';
import { NbtCompound } from '../nbt/NbtCompound.js';
import { server } from '../utils/Mixins.js';
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
import { NbtByte } from "../nbt/NbtByte.js";
import { EntityItem } from 'cn.nukkit.entity.item.EntityItem'
import { Entity as PNXEntity } from 'cn.nukkit.entity.Entity'
import { Random } from 'java.util.Random'
import { NBTIO } from 'cn.nukkit.nbt.NBTIO'
import { Entity } from '../object/Entity.js'

const PlayerCommandMap = new Map();
const ConsoleCommandMap = new Map();
server.getPluginManager().addPermission(new Permission("liteloaderlibs.command.any", "liteloader插件any权限", "true"));
server.getPluginManager().addPermission(new Permission("liteloaderlibs.command.op", "liteloader插件op权限", "op"));
server.getPluginManager().addPermission(new Permission("liteloaderlibs.command.console", "liteloader插件console权限", "false"));

/**
 * 获取世界对象
 * @param dim {string|number} 世界名或维度id
 * @returns {cn.nukkit.level}
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
 * @param motd {string} 目标 Motd 字符串
 * @returns {boolean} 是否成功
 */
function setMotd(motd) {
    server.setPropertyString('motd', motd);
    return true;
}

/**
 * 设置最大玩家数量
 * @param num {number} 最大玩家数
 * @returns {boolean} 是否成功
 */
function setMaxPlayers(num) {
    server.setMaxPlayers(num);
    return true;
}

// 🎨 游戏元素接口文档
/**
 * 执行一条命令并返回是否成功
 * @param cmd {string} 命令
 * @returns {boolean} 是否成功
 */
function runcmd(cmd) {
    return server.dispatchCommand(server.getConsoleSender(), cmd);
}

/**
 * 执行一条命令并返回更多信息
 * @todo 待完善
 * @param cmd {string} 命令
 * @returns {{success: boolean, output: string}} 是否成功与输出信息
 */
function runcmdEx(cmd) {
    let rconSender = new RemoteConsoleCommandSender();
    let succ = server.dispatchCommand(rconSender, cmd);
    return {success: succ, output: rconSender.getMessages()};
}

/**
 * 注册一条顶层命令
 * @todo 未实现
 * @param cmd {string} 命令
 * @param description {string} 描述文本
 * @param [permission=0] {number} 执行所需权限0~2（默认0）
 * @param [flag=0x80] {number} 默认值（默认0x80）
 * @param [alias] {string} 命令别名（默认空值）
 * @returns {Command} 指令对象
 */
function newCommand(cmd, description, permission = PermType.Any, flag, alias) {
    let perm = 'liteloaderlibs.command.any';
    switch (permission) {
        case PermType.Any:
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
 * @param cmd {string} 待注册的命令
 * @param description {string} 描述文本
 * @param callback {Function} 注册的这个命令被执行时，接口自动调用的回调函数。
 * @param [level=0] {number} 默认值（默认0）
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
    commandBuilder.setCallback((sender, args) => {
        if (ConsoleCommandMap.has(cmd)) {
            ConsoleCommandMap.get(cmd).call(sender, sender, args);// ! Map绑定this给sender
        }
        PlayerCommandMap.get(cmd).call(sender, sender, args);
    });
    commandBuilder.register();
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
    commandBuilder.setCallback((sender, args) => {
        if (PlayerCommandMap.has(cmd)) {
            PlayerCommandMap.get(cmd).call(sender, sender, args);
        }
        ConsoleCommandMap.get(cmd).call(sender, sender, args);
    });
    commandBuilder.register();
}

/**
 * 注册指定的监听函数
 * @param event {string} 要监听的事件名
 * @param callback {Function} 注册的监听函数
 * @returns {boolean} 是否成功监听事件
 */
function listen(event, callback) {
    return Event[event].run(callback);
}

/**
 * 获取玩家对象
 * @param info {string} 玩家名/xuid
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
 * @param msg {string} 消息内容
 * @param [type=0] {number} 消息类型（默认0）
 * @returns {boolean} 是否成功
 */
function broadcast(msg, type = 0) {
    for (const player of server.getOnlinePlayers().values()) {
        sendText(server.getConsoleSender(), player, msg, type);
    }
    return true;
}

/**
 * 在指定位置制造一次爆炸
 * @param pos {IntPos | FloatPos} 引发爆炸的位置坐标(或者使用x,y,z,dimid来确定实体位置)
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
 * @param name {String} 物品的标准类型名，如 minecraft:bread
 * @param count {number} 物品堆叠数量
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
 * @todo 应该返回Entity LLSE类型
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
 * @param name {string} 计分项名称
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
 * @param slot {string} 显示槽位名称字符串，可以为 sidebar/belowname/list
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
 * @param x {number} x
 * @param y {number} y
 * @param z {number} z
 * @param dimid {number} 维度ID
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
 * @param x {number} x
 * @param y {number} y
 * @param z {number} z
 * @param dimid {number} 维度ID
 * @param block {string|Block|NbtCompound} 要设置成的方块标准类型名（如 minecraft:stone）、方块对象或方块 NBT 数据
 * @param [tiledata=0] {number} 方块状态值（默认0）
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
            _block = JBlock.get(_block, tiledata);
            break;
        case 'String':
            var blockid = _block.indexOf(":air") > -1 ? 0 : BlockStateRegistry.getBlockId(_block);
            if (!blockid && isNaN(blockid)) {
                console.error('Unknow block: ' + _block);
                return false;
            }
            _block = JBlock.get(blockid, tiledata);
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
 * @param x {number} x
 * @param y {number} y
 * @param z {number} z
 * @param dimid {number} 维度ID
 * @param type {string} 粒子效果名例如 minecraft:heart_particle
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
 * @param name {string} 计分项名称
 * @param displayName  {string} 计分项显示名称
 * @returns {ScoreObjectives|null} 新增创建的计分项对象
 */
function newScoreObjective(name, displayName) {
    return ScoreObjectives.newScoreObjective(...arguments);
}

/**
 * 获取某个已存在的计分项
 * @param name {string} 要获取的计分项名称
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
 * @param slot {string} 待查询的显示槽位名称，可以为"sidebar"/"belowname"/"list"
 * @returns {ScoreObjectives|null} 正在slot槽位显示的计分项
 */
function getDisplayObjective(slot) {
    return ScoreObjectives.getDisplayObjective(slot);
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
    //📝 计分板 API
    removeScoreObjective,
    clearDisplayObjective,
    newScoreObjective,
    getScoreObjective,
    getAllScoreObjectives,
    getDisplayObjective
}
