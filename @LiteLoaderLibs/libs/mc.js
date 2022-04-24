import { PermType } from './PermType.js'
import { Player } from './Player.js'
import { Event } from './Event.js'
import { Server } from 'cn.nukkit.Server'
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
	return new Player(found);
}
function getOnlinePlayers() {
	var PlayerList = [];
	for (var player of server.getOnlinePlayers().values()) {
		PlayerList.push(new Player(player));
	}
	return PlayerList;
}

export const mc = {
	runcmd: runcmd,
	runcmdEx: runcmdEx,
	newCommand: newCommand,
	listen: listen,
	getPlayer: getPlayer,
	getOnlinePlayers: getOnlinePlayers
}
