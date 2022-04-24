import { DirectionAngle } from './DirectionAngle.js'

export class Player {
	constructor (PNXPlayer) {
		this.PNXPlayer = PNXPlayer;
		this.DirectionAngle = new DirectionAngle(this.PNXPlayer);
	}

	// TODO: 似乎跟 this.realName 不一样
	get name() {// 玩家名	String
		return this.PNXPlayer.getName();
	}
	set name(value) {
		return;
	}

	get pos() {// 玩家所在坐标	FloatPos
		return [this.PNXPlayer.x, this.PNXPlayer.y, this.PNXPlayer.z];
	}
	set pos(value) {
		return;
	}

	get blockPos() {// 玩家所在坐标	FloatPos
		return [Math.floor(this.PNXPlayer.x), Math.floor(this.PNXPlayer.y), Math.floor(this.PNXPlayer.z)];
	}
	set blockPos(value) {
		return;
	}

	// TODO: 似乎跟 this.name 不一样
	get realName() {// 玩家的真实名字	String
		return this.PNXPlayer.getName();
	}
	set realName(value) {
		return;
	}

	get xuid() {// 玩家Uuid字符串	String
		return this.PNXPlayer.getLoginChainData().getXUID();
	}
	set xuid(value) {
		return;
	}

	get uuid() {// 玩家Xuid字符串	String
		return this.PNXPlayer.getLoginChainData().getClientUUID();
	}
	set uuid(value) {
		return;
	}

	get permLevel() {// 玩家的操作权限等级（0 - 4）	Integer
		return this.PNXPlayer.isOp() ? 1 : 0;
	}
	set permLevel(value) {
		return;
	}

	get gameMode() {// 玩家的游戏模式（0 - 3）	Integer
		return this.PNXPlayer.getGamemode();
	}
	set gameMode(value) {
		return;
	}

	get maxHealth() {// 玩家最大生命值	Integer
		return this.PNXPlayer.getMaxHealth();
	}
	set maxHealth(value) {
		return;
	}

	get health() {// 	玩家当前生命值	Float
		return this.PNXPlayer.getHealth();
	}
	set health(value) {
		return;
	}

	get inAir() {// 	玩家当前是否悬空	Boolean
		return this.PNXPlayer.getInAirTicks() > 0;
	}
	set inAir(value) {
		return;
	}

	get inWater() {// 	玩家当前是否在水中	Boolean
		return this.PNXPlayer.isSwimming();
	}
	set inWater(value) {
		return;
	}

	get sneaking() {// 	玩家当前是否正在潜行	Boolean
		return this.PNXPlayer.isSneaking();
	}
	set sneaking(value) {
		return;
	}

	get speed() {// 	玩家当前速度	Float
		return this.PNXPlayer.getMovementSpeed();
	}
	set speed(value) {
		return;
	}

	get direction() {// 玩家当前朝向	DirectionAngle
		return this.DirectionAngle;
	}
	set direction(value) {
		return;
	}

	get uniqueId() {// 	玩家（实体的）唯一标识符	String
		return this.PNXPlayer.getId();
	}
	set uniqueId(value) {
		return;
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
		switch (type) {
			case 0: {
				this.PNXPlayer.sendMessage(msg);
				break;
			}
			case 1: {
				this.PNXPlayer.sendMessage(msg);
				break;
			}
			case 4: {
				this.PNXPlayer.sendPopup(msg);
				break;
			}
			case 5: {
				this.PNXPlayer.sendTip(msg);
				break;
			}
			default:
				return false;
		}
		return true;
	}
	sendText(msg, type) {
		return this.tell(msg, type);
	}
	broadcast() {
		//TODO: 发给所有玩家
	}
}