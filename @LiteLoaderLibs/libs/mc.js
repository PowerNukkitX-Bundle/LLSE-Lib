import { PermType } from './PermType.js'
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

export const mc = {
	runcmd: runcmd,
	runcmdEx: runcmdEx
}