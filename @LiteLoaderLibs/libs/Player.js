import { DirectionAngle } from '../utils/DirectionAngle.js'
import { IntPos } from './IntPos.js'
import { FloatPos } from './FloatPos.js'
import { Device } from './Device.js'
import { Server } from 'cn.nukkit.Server'
import { PlayerChatEvent } from 'cn.nukkit.event.player.PlayerChatEvent';
import { Position } from 'cn.nukkit.level.Position';
import { Vector3 } from 'cn.nukkit.math.Vector3';
import { EntityDamageByEntityEvent } from 'cn.nukkit.event.entity.EntityDamageByEntityEvent';
import { EntityDamageEvent } from 'cn.nukkit.event.entity.EntityDamageEvent';
const server = Server.getInstance();

export class Player {
	constructor (PNXPlayer) {
		this.PNXPlayer = PNXPlayer;
		this.DirectionAngle = new DirectionAngle(this.PNXPlayer);

		// TODO: 优化，使levels挂载到全局变量
		this.levels = getLevels();
	}

	get name() {// 显示的玩家名	String
		return this.PNXPlayer.getDisplayName();
	}

	get pos() {// 玩家所在坐标	FloatPos
		return new FloatPos(this.PNXPlayer.getPosition());
	}

	get blockPos() {// 玩家所在坐标	IntPos
		return new IntPos(this.PNXPlayer.getPosition());
	}

	get realName() {// 玩家的真实名字  String
		return this.PNXPlayer.getName();
	}

	get xuid() {// 玩家Uuid字符串	String
		return this.PNXPlayer.getLoginChainData().getXUID();
	}

	get uuid() {// 玩家Xuid字符串	String
		return this.PNXPlayer.getLoginChainData().getClientUUID();
	}

	get permLevel() {// 玩家的操作权限等级（0 - 4）	Integer
		return this.PNXPlayer.isOp() ? 1 : 0;
	}

	get gameMode() {// 玩家的游戏模式（0 - 3）	Integer
		return this.PNXPlayer.getGamemode();
	}

	get maxHealth() {// 玩家最大生命值	Integer
		return this.PNXPlayer.getMaxHealth();
	}

	get health() {// 	玩家当前生命值	Float
		return this.PNXPlayer.getHealth();
	}

	get inAir() {// 	玩家当前是否悬空	Boolean
		return this.PNXPlayer.getInAirTicks() > 0;
	}

	get inWater() {// 	玩家当前是否在水中	Boolean
		return this.PNXPlayer.isSwimming();
	}

	get sneaking() {// 	玩家当前是否正在潜行	Boolean
		return this.PNXPlayer.isSneaking();
	}

	get speed() {// 	玩家当前速度	Float
		return this.PNXPlayer.getMovementSpeed();
	}

	get direction() {// 玩家当前朝向	DirectionAngle
		return this.DirectionAngle;
	}

	get uniqueId() {// 	玩家（实体的）唯一标识符	String
		return this.PNXPlayer.getId();
	}

	isOP() {
		return this.PNXPlayer.isOp();
	}
	kick(msg) {
		return this.PNXPlayer.kick(msg);
	}
	disconnect(msg) {
		return this.kick(msg);
	}
	tell(msg, type = 0) {
		if (!sendText(server.getConsoleSender(), this.PNXPlayer, msg, type)) {
			return false;
		}
		return true;
	}
	sendText(msg, type) {
		return this.tell(msg, type);
	}
	runcmd(cmd) {
		return server.dispatchCommand(this.PNXPlayer, cmd);
	}
	talkAs(target, text) {
		/*
		args1: target, text
		args2: text
		*/
		if (arguments.length == 2) {
			return sendText(this.PNXPlayer, target.PNXPlayer, text, 1);
		} else {
			var event = new PlayerChatEvent(this.PNXPlayer, target);
			server.getPluginManager().callEvent(event);
			if (!event.isCancelled()) {
				server.broadcastMessage(server.getLanguage().translateString(event.getFormat(), [event.getPlayer().getDisplayName(), event.getMessage()]), event.getRecipients());
			}
			return true;
		}
	}
	teleport(x, y, z, dimid) {
		/*
		args1: x, y, z, dim

		args1: x, y, z, dimid
		args2: pos
		*/
		if (arguments.length == 1) {
			return this.PNXPlayer.teleport(x.position);
		} else {
			const level =  server.getLevelByName(isNaN(dimid) ? dimid: this.levels[dimid]);
			if (level == null) {
				console.log('\nUnknow worlds: '+dimid+'\n  at Player.js -> teleport()');
				return false;
			}
			return this.PNXPlayer.teleport(Position.fromObject(new Vector3(x, y, z), level));
		}
	}
	kill() {
		this.PNXPlayer.kill();
		return true;
	}
	hurt(entity) {
		// test
		var d;
		if (this.PNXPlayer.getInventory().getItemInHand() != null) {
			d = this.PNXPlayer.getInventory().getItemInHand().getAttackDamage();
		} else {
			d = 1;
		}
		this.PNXPlayer.displaySwing();
		return entity.attack(new EntityDamageByEntityEvent(this.PNXPlayer, entity, EntityDamageEvent.DamageCause.ENTITY_ATTACK, d, 0.5));
	}
	setOnFire(time) {
		// test
		this.PNXPlayer.setOnFire(time);
		return true;
	}
	rename(newname) {
		// test
		this.PNXPlayer.setDisplayName(newname);
		return true;
	}
	getBlockStandingOn() {// 获取玩家脚下方块	Block
		// TODO: 改为LLSE类型
		return this.PNXPlayer.getPosition().add(0, -0.1).getLevelBlock();
	}
	getDevice() {// 获取设备信息对象	Device
		return new Device(this.PNXPlayer);
	}
	getHand() {// 获取主手物品	Item
		// TODO: 改为LLSE类型
		return this.PNXPlayer.getInventory().getItemInHand();
	}
}

export function sendText(sender = '', receiver, msg, type) {
	switch (type) {
		case 0: {
			receiver.sendMessage(msg);
			break;
		}
		case 1: {
			receiver.sendMessage('['+(sender && sender.getName())+' -> '+receiver.getName()+'] '+msg);
			break;
		}
		case 4: {
			receiver.sendPopup(msg);
			break;
		}
		case 5: {
			receiver.sendTip(msg);
			break;
		}
		default:
			return false;
	}
	return true;
}
export function getLevels() {
	var levels = [];
	for (var level of server.getLevels().values()) {
		levels[level.getDimension()] = level.getName();
	}
	levels[0] = server.getDefaultLevel().getName();
	return levels;
}
