import { PowerNukkitX as pnx } from ':powernukkitx';
import { PermType } from '../utils/PermType.js';
import { Player, sendText } from '../object/Player.js';
import { Event } from './Event.js';
import { Item } from '../object/Item.js';
import { SimpleForm } from '../window/SimpleForm.js';
import { CustomForm } from '../window/CustomForm.js';
import { Server } from 'cn.nukkit.Server';
import { ProtocolInfo } from 'cn.nukkit.network.protocol.ProtocolInfo';
import { Explosion } from 'cn.nukkit.level.Explosion';
import { EnumLevel } from 'cn.nukkit.level.EnumLevel';
import { Position } from 'cn.nukkit.level.Position';

const server = Server.getInstance();
const PlayerCommandMap = new Map();
const ConsoleCommandMap = new Map();

function dimToLevel(dim){
	if(dim===0) return EnumLevel.OVERWORLD.getLevel();
	else if(dim===1) return EnumLevel.NETHER.getLevel();
	else if(dim===2) return EnumLevel.THE_END.getLevel();
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
	return {success: runcmd(cmd), output: ''};
}

/**
 * 注册一条顶层命令
 * @todo 未实现
 * @param cmd {string} 命令
 * @param description {string} 描述文本
 * @param [permission=0] {number} 执行所需权限0~2
 * @param [flag=0x80] {number} 默认值
 * @param [alias] {number} 命令别名
 * @returns {Command} 指令对象
 */
function newCommand(cmd, description, permission = PermType.Any, flag, alias) {
	return {};
}
/**
 * 注册一个新的玩家命令（假命令）
 * @param cmd {string} 待注册的命令
 * @param description {string} 描述文本
 * @param callback {Function} 注册的这个命令被执行时，接口自动调用的回调函数。
 * @param [level=0] {number} 默认值
 * @returns {boolean} 是否成功
 */
function regPlayerCmd(cmd, description, callback, level = 0) {
	if (server.getCommandMap().getCommand(cmd)) {// 存在于系统命令
		if (ConsoleCommandMap.has(cmd)) {// 控制台命令中存在
			PlayerCommandMap.set(cmd, (sender, args) => {
				if (sender.isPlayer() && level > 0 && !sender.isOp()) {// 权限不足时
					return;
				}
				callback(Player.getPlayer(sender), args);
			});
			return true;
		}
		return false;
	}
	PlayerCommandMap.set(cmd, (sender, args) => {
		if (sender.isPlayer() && level > 0 && !sender.isOp()) {// 权限不足时
			return;
		}
		callback(Player.getPlayer(sender), args);
	});
	const commandBuilder = pnx.commandBuilder();
	commandBuilder.setCommandName(cmd);
	commandBuilder.setDescription(description);
	commandBuilder.setCallback((sender, args) => {
		if (ConsoleCommandMap.has(cmd)) {
			ConsoleCommandMap.get(cmd).call(this, sender, args);
		}
		PlayerCommandMap.get(cmd).call(this, sender, args);
	});
	commandBuilder.register();
	return true;
}
function regConsoleCmd(cmd, description, callback) {
	if (server.getCommandMap().getCommand(cmd)) {// 存在于系统命令
		if (PlayerCommandMap.has(cmd)) {// 控制台命令中存在
			ConsoleCommandMap.set(cmd, (sender, args) => {
				if (sender.getName() != 'CONSOLE') {// 简易的判断是否为控制台
					return;
				}
				callback(args);
			});
			return true;
		}
		return false;
	}
	ConsoleCommandMap.set(cmd, (sender, args) => {
		if (sender.getName() != 'CONSOLE') {// 简易的判断是否为控制台
			return;
		}
		callback(args);
	});
	const commandBuilder = pnx.commandBuilder();
	commandBuilder.setCommandName(cmd);
	commandBuilder.setDescription(description);
	commandBuilder.setCallback((sender, args) => {
		if (PlayerCommandMap.has(cmd)) {
			PlayerCommandMap.get(cmd).call(this, sender, args);
		}
		ConsoleCommandMap.get(cmd).call(this, sender, args);
	});
	commandBuilder.register();
}

/**
 * 注册指定的监听函数
 * @param event {string} 要监听的事件名
 * @param callback {Function} 注册的监听函数
 * @returns {boolean} 是否成功监听事件
 */
function listen(event,callback){
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
		var delta = 0x7FFFFFFF;
		for (const player of server.getOnlinePlayers().values()) {
			if (player.getName().toLowerCase().startsWith(info)) {
				const curDelta = player.getName().length - info.length;
				if (curDelta < delta) {
					found = player;
					delta = curDelta;
				}
				if (curDelta == 0) {
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
 * @param [type=0] {number} 消息类型
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
function explode(x,y,z,dimid,source,power,range,isDestroy,isFire) {
	if (arguments.length === 6) {
		var explode = new Explosion(x,range,source);
		explode.doesDamage=isDestroy;
		explode.setIncendiary(isFire);
		return explode.explode();
	} else if(arguments.length === 9){
		var explode = new Explosion(new Position(x,y,z,dimToLevel(dimid)),range,source);
		explode.doesDamage=isDestroy;
		explode.setIncendiary(isFire);
		return explode.explode();
	}else throw new Error("mc.js explode()参数错误");
}

// 物品对象
/**
 * 生成新的物品对象
 * @param name {string} 物品的标准类型名，如 minecraft:bread
 * @param count {number} 物品堆叠数量
 * @returns {Item|null} 
 */
function newItem(name, count) {
	/*
	args1: name, count
	args2: NbtCompound
	*/
	return Item.newItem(name, count);
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

export const mc = {
	//PNX 的API
	close: close,
	//💻 服务端设置 API
	getBDSVersion: getServerVersion,
	getServerProtocolVersion: getServerProtocolVersion,
	setMotd: setMotd,
	setMaxPlayers: setMaxPlayers,
	//🎨 游戏元素接口文档
	runcmd: runcmd,
	runcmdEx: runcmdEx,
	newCommand: newCommand,
	regPlayerCmd: regPlayerCmd,
	regConsoleCmd: regConsoleCmd,
	listen: listen,
	getPlayer: getPlayer,
	getOnlinePlayers: getOnlinePlayers,
	broadcast: broadcast,
	explode: explode,
	// 物品对象
	newItem: newItem,
	// 表单窗口相关
	newSimpleForm: newSimpleForm,
	newCustomForm: newCustomForm,
	// 记分榜相关
	removeScoreObjective: removeScoreObjective,
	clearDisplayObjective: clearDisplayObjective
}
