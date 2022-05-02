import { PermType } from './PermType.js';
import { Player, sendText } from './Player.js';
import { Event } from './Event.js';
import { Server } from 'cn.nukkit.Server';
import { ProtocolInfo } from 'cn.nukkit.network.protocol.ProtocolInfo';
const server = Server.getInstance();

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

// 🎨 LLSE - 游戏元素接口文档
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
 * @todo 未实现
 * @param cmd {string} 命令
 * @returns {{success: boolean, output: string}} 是否成功与输出信息
 */
function runcmdEx(cmd) {
	return {success: true, output: ''};
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
		for (var player of server.getOnlinePlayers().values()) {
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
		var xuid = String(info);
		for (var player of server.getOnlinePlayers().values()) {
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
	for (var player of server.getOnlinePlayers().values()) {
		sendText(server.getConsoleSender(), player, msg, type);
	}
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
	listen: listen,
	getPlayer: getPlayer,
	getOnlinePlayers: getOnlinePlayers,
	broadcast: broadcast
}
