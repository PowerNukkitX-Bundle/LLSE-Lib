import { PermType } from './PermType.js'
import { Event } from './Event.js'
import { Server } from 'cn.nukkit.Server'

const server = Server.getInstance();

function runcmd(cmd) {
	return server.dispatchCommand(server.getConsoleSender(), cmd);
}
function runcmdEx(cmd) {
	return {success: true, output: res};
}
function newCommand(cmd, description, permission = PermType.Any, flag, alias) {
	return {};
}

function listen(event,callback){
	return Event[event].run(callback);
}

export const mc = {
	runcmd: runcmd,
	runcmdEx: runcmdEx,
	listen: listen
}