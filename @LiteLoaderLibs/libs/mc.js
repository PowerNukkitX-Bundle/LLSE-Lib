import { PermType } from './PermType.js';
import { Player, sendText } from './Player.js';
import { Event } from './Event.js';
import { Server } from 'cn.nukkit.Server';
const server = Server.getInstance();

function runcmd(cmd) {
	return server.dispatchCommand(server.getConsoleSender(), cmd);
}
function runcmdEx(cmd) {
	// TODO: output是命令的返回
	return {success: true, output: ''};
}
function newCommand(cmd, description, permission = PermType.Any, flag, alias) {
	// TODO: 注册一个命令
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
	return new Player(found);
}
function getOnlinePlayers() {
	var PlayerList = [];
	for (var player of server.getOnlinePlayers().values()) {
		PlayerList.push(new Player(player));
	}
	return PlayerList;
}

function broadcast(msg, type = 0) {
	//TODO: 发给所有玩家
	for (var player of server.getOnlinePlayers().values()) {
		sendText(server.getConsoleSender(), player, msg, type);
	}
	return true;
}

export const mc = {
	runcmd: runcmd,
	runcmdEx: runcmdEx,
	newCommand: newCommand,
	listen: listen,
	getPlayer: getPlayer,
	getOnlinePlayers: getOnlinePlayers,
	broadcast: broadcast
}
