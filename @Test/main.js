import { mc, WSClient, NBT, File } from '@LiteLoaderLibs/index.js'
//import { WsClientBuilder } from 'WsClient';


export function close() {
	mc.close();
}

export function main() {
	mc.runcmd('say hello!');
	var player = mc.getPlayer("mcayear");

	//var fi = new File('./plugins/AMCBuilder/export/slab.mcstructure', 0, true);
	//var binData = fi.readAllSync();
	//let snbt = NBT.parseBinaryNBT(binData).toSNBT();
	//console.log(snbt);
	//console.log('snbt to comp');
	//NBT.parseSNBT(snbt);
	let blockNbt = mc.getBlock(115, 11, 158, 0).getNbt();
	//console.log(mc.setBlock(115, 14, 158, 0, blockNbt));

/*
	if (!player) return console.log("no found player.");
	
	let item = player.getOffHand();
	console.log(item.toString());
	console.log(item.getNbt());
	item.setLore(['setLore','1']);
	console.log(player.giveItem(mc.newItem('minecraft:arrow', 12)));

	//console.log(player.talkAs(player, "hello!"));
	//console.log(player.teleport(1062, 70, 1138, 0));
	//player.setBossBar('this a title!!', 50, 3)
	//console.log(player.setOnFire(10));
	//console.log(player.addTag('aTag2'));
	//console.log(player.hasTag('aTag2'));
	//console.log(player.getAllTags());

	*/
	/*
	let wsc = new WSClient();
	wsc.listen("onTextReceived", (data) => {
		console.log("onText", data);
	});
	wsc.listen("onLostConnection", (code) => {
		console.log("与服务器链接断开 close: "+code);
	});
	wsc.listen("onError", (msg) => {
		console.log("与服务器链接断开 error: "+msg);
	});
	wsc.listen("onBinaryReceived", (data) => {
		console.log("onBinary");
		console.log("onBinary", data);
	});
	wsc.listen('onOpen', (webSocket) => {
		console.log('connect succ!');
	});
	wsc.connectAsync('ws://127.0.0.1:8881', (succ, err)=>{
		if (!succ) console.log(err);
		wsc.send(JSON.stringify({"type":"login"}));
	});*/

/*
	WsClientBuilder.setURI('ws://127.0.0.1:8881')
	.onOpen((ws)=>{
		console.log('Open');
		return true;
	})
	.onText((ws, data, last)=>{
		console.log('Text', data, last);
		return true;
	})
	.onClose((ws, statusCode, reason)=>{
		console.log('Close', statusCode, reason);
		return true;
	})
	.onBinary((ws, data, last)=>{
		console.log('Binary', data, last);
		return true;
	})
	.onPing((ws, message)=>{
		console.log('Ping', message);
		return true;
	})
	.onPong((ws, message)=>{
		console.log('Pong', message);
		return true;
	})
	.buildAsync()
	.then(ws => {
		console.log('!!!????????!!!', true);
		ws.sendText(JSON.stringify({"type":"login"}), true);		
	}, () => {
		console.warn(false);
	});*/
}
