import { DirectionAngle } from '../utils/DirectionAngle.js';
import { IntPos } from './IntPos.js';
import { FloatPos } from './FloatPos.js';
import { Device } from './Device.js';
import { Server } from 'cn.nukkit.Server';
import { PlayerChatEvent } from 'cn.nukkit.event.player.PlayerChatEvent';
import { Position } from 'cn.nukkit.level.Position';
import { Vector3 } from 'cn.nukkit.math.Vector3';
import { EntityDamageByEntityEvent } from 'cn.nukkit.event.entity.EntityDamageByEntityEvent';
import { EntityDamageEvent } from 'cn.nukkit.event.entity.EntityDamageEvent';
import { EnumLevel } from 'cn.nukkit.level.EnumLevel';
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
	/**
	 * 判断玩家是否为OP
	 * @returns {boolean} 玩家是否为OP
	 */
	isOP() {
		return this.PNXPlayer.isOp();
	}
	/**
	 * 断开玩家连接
	 * @param msg {string} (可选参数)被踢出玩家出显示的断开原因
	 * @returns {boolean} 是否成功断开连接
	 */
	kick(msg) {
		return this.PNXPlayer.kick(msg);
	}
	/**
	 * @see {@link kick}
	 */
	disconnect(msg) {
		return this.kick(msg);
	}
	/**
	 * 发送一个文本消息给玩家
	 * @param msg {string} 待发送的文本
	 * @param type {Integer} (可选参数)发送的文本消息类型，默认为 0
	 * @returns {boolean} 是否成功发送
	 */	
	tell(msg, type = 0) {
		if (!sendText(server.getConsoleSender(), this.PNXPlayer, msg, type)) {
			return false;
		}
		return true;
	}
	/**
	 * @see {@link tell}
	 */
	sendText(msg, type) {
		return this.tell(msg, type);
	}
	/**
	 * 以某个玩家身份执行一条命令
	 * @param cmd {string} 待执行的命令
	 * @returns {boolean} 是否执行成功
	 */	
	runcmd(cmd) {
		return server.dispatchCommand(this.PNXPlayer, cmd);
	}
	/**
	 * 以某个玩家身份说话
	 * @param target {Player} (可选参数)模拟说话目标
	 * @param text {string} 模拟说话内容
	 * @returns {boolean} 是否执行成功
	 */	
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
	/**
	 * 传送玩家至指定位置
	 * @param x {IntPos|FloatPos} 目标位置坐标(或者使用 x, y, z, dimid 来确定玩家位置)
	 * @returns {boolean} 是否成功传送
	 */		
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
	/**
	 * 杀死玩家
	 * @returns {boolean} 是否成功执行
	 */	
	kill() {
		this.PNXPlayer.kill();
		return true;
	}
	/**
	 * 对玩家造成伤害
	 * @param damage {Integer} 对玩家造成的伤害数值
	 * @returns {boolean} 是否造成伤害
	 */	
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
	/**
	 * 使指定玩家着火
	 * @param time {Integer} 着火时长，单位秒
	 * @returns {boolean} 是否成功着火
	 */	
	setOnFire(time) {
		// test
		this.PNXPlayer.setOnFire(time);
		return true;
	}
	/**
	 * 重命名玩家
	 * @param newname {string} 玩家的新名字
	 * @returns {boolean} 是否重命名成功
	 */	
	rename(newname) {
		// test
		this.PNXPlayer.setDisplayName(newname);
		return true;
	}
	/**
	 * 获取玩家当前站立所在的方块
	 * @returns {Block} 当前站立在的方块对象
	 */	
	getBlockStandingOn() {// 获取玩家脚下方块	Block
		// TODO: 改为LLSE类型
		return this.PNXPlayer.getPosition().add(0, -0.1).getLevelBlock();
	}
	/**
	 * 获取玩家对应的设备信息对象
	 * @returns {Device} 玩家对应的设备信息对象
	 */	
	getDevice() {// 获取设备信息对象	Device
		return new Device(this.PNXPlayer);
	}
	/**
	 * 获取玩家主手中的物品对象
	 * @returns {Item} 玩家主手中的物品对象
	 */	
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
	/*for (var level of server.getLevels().values()) {
		levels[level.getDimension()] = level.getName();
	}
	levels[0] = server.getDefaultLevel().getName();*/
	levels[0] = EnumLevel.OVERWORLD.getLevel().getName();
	levels[1] = EnumLevel.NETHER.getLevel().getName();
	levels[2] = EnumLevel.THE_END.getLevel().getName();
	return levels;
}
