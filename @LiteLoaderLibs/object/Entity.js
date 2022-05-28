
import { DirectionAngle } from './DirectionAngle.js';
import { IntPos } from './IntPos.js';
import { FloatPos } from './FloatPos.js';
import { Player } from 'cn.nukkit.Player';
import { EntityItem } from 'cn.nukkit.entity.item.EntityItem';
export class Entity {
    constructor (PNXEntity) {
		this.PNXEntity = PNXEntity;
		this.DirectionAngle = new DirectionAngle(PNXEntity);
	}

	get name() {// 实体名称	String
		return this.PNXEntity.getName();
	}

	get type() {// 实体标准类型名	String
		return this.PNXEntity.getOriginalName();
	}

	get id() {// 实体的游戏内 id	Integer
		return this.PNXEntity.getId();
	}

	get pos() {// 实体所在坐标  FloatPos
		return new FloatPos(this.PNXEntity.getPosition());;
	}

	get blockPos() {// 实体所在的方块坐标	IntPos
		return new IntPos(this.PNXEntity.getPosition());;
	}

	get maxHealth() {// 实体最大生命值	Integer
		return this.PNXEntity.getMaxHealth();
	}

	get health() {// 实体当前生命值  Integer
		return this.PNXEntity.getHealth();
	}

	get inAir() {// 实体当前是否悬空  Boolean
		return this.PNXEntity.getInAirTicks() > 0;
	}

	get inWater() {// 实体当前是否在水中		Boolean
		return this.PNXEntity.isSwimming();
	}

	get speed() {// 实体当前速度	Float
		return this.PNXEntity.getMovementSpeed();
	}

	get direction() {// 实体当前朝向	Boolean
		return this.DirectionAngle;
	}
	
	get uniqueId() {// 实体唯一标识符	String
		return this.PNXEntity.getUniqueId().toString();
	}

	/**
	 * 传送实体至指定位置
	 * @param x {IntPos|FloatPos} 目标位置坐标(或者使用 x, y, z, dimid 来确定实体位置)
	 * @returns {boolean} 是否成功传送
	 */		
	teleport(x, y, z, dimid) {
		if (arguments.length === 1) {
			return this.PNXEntity.teleport(x.position);
		} else {
			const level = server.getLevelByName(isNaN(dimid) ? dimid: this.levels[dimid]);
			if (level == null) {
				console.log('\nUnknow worlds: '+dimid+'\n  at Entity.js -> teleport()');
				return false;
			}
			return this.PNXEntity.teleport(Position.fromObject(new Vector3(x, y, z), level));
		}
	}
	/**
	 * 杀死实体
	 * @returns {boolean} 是否成功执行
	 */	
	kill() {
		this.PNXEntity.kill();
		return !this.PNXEntity.isAlive();
	}

	/**
	 * 对实体造成伤害
	 * @param damage {Integer} 对实体造成的伤害数值
	 * @returns {boolean} 是否造成伤害
	 */	
	hurt(damage) {
		return this.PNXEntity.attack(new EntityDamageByEntityEvent(this.PNXEntity, EntityDamageEvent.DamageCause.NONE, damage));
	}

	/**
	 * 使指定实体着火
	 * @param time {Integer} 着火时长，单位秒
	 * @returns {boolean} 是否成功着火
	 */	
	setOnFire(time) {
		this.PNXEntity.setOnFire(time);
		return this.PNXEntity.isOnFire();
	}
	
	/**
	 * 判断一个实体对象是不是玩家
	 * @returns {boolean} 当前实体对象是不是玩家
	 */	
	isPlayer(){
		return this.PNXEntity instanceof Player;
	}

	/**
	 * 将实体对象转换玩家对象
	 * @returns {Player} 转换成的玩家对象,如果此实体对象指向的不是某个玩家,或者转换失败，则返回Null
	 */	
	toPlayer(){
		if(this.isPlayer()) return Player.getPlayer(this.PNXEntity);
		else return null;
	}

	/**
	 * 判断一个实体对象是不是掉落物实体
	 * @returns {boolean} 当前实体对象是不是掉落物实体
	 */	
	isItemEntity(){
		return this.PNXEntity instanceof EntityItem;
	}

	/**
	 * 获取掉落物实体中的物品对象
	 * @todo 待实现
	 * @returns {Item} 获取到的物品对象,如果此实体对象不是掉落物实体，或者获取失败，则返回 Null
	 */
	toItem(){}

	/**
	 * 获取实体当前站立所在的方块
	 * @todo 改为LLSE类型
	 * @returns {Block} 当前站立在的方块对象
	 */	
	getBlockStandingOn() {
		return this.PNXEntity.getPosition().add(0, -0.1).getLevelBlock();
	}

	/**
	 * 获取实体盔甲栏对象
	 * @todo 待实现
	 * @returns {Container} Container对象
	 */
	getArmor() {}	

	/**
	 * 判断生物是否拥有容器（盔甲栏除外）
	 * @todo 待实现
	 * @returns {Container} 这个生物实体是否拥有容器
	 */
	hasContainer() {}

	/**
	 * 获取生物所拥有的容器对象（盔甲栏除外）
	 * @todo 待实现
	 * @returns {Container} 这个生物实体所拥有的容器对象
	 */
	getContainer(){}

	/**
	 * 刷新生物物品栏、盔甲栏
	 * @todo 待实现
	 * @returns {boolean} 是否成功刷新
	 */
	refreshItems(){}

	/**
	 * 为实体增加一个 Tag
	 * @param tag {string} 要增加的 tag 字符串
	 * @returns {boolean} 是否成功
	 */
	addTag(tag) {
		if (this.PNXEntity.containTag(tag)) {
			return false;
		}
		this.PNXEntity.addTag(tag);
		return true;
	}

	/**
	 * 为实体移除一个 Tag
	 * @param tag {string} 要移除的 tag 字符串
	 * @returns {boolean} 是否成功
	 */
	removeTag(tag) {
		if (!this.PNXEntity.containTag(tag)) {
			return false;
		}
		this.PNXEntity.removeTag(tag);
		return true;
	}

	/**
	 * 检查实体是否拥有某个 Tag
	 * @param tag {string} 要检查的 tag 字符串
	 * @returns {boolean} 是否拥有
	 */
	hasTag(tag) {
		return this.PNXEntity.containTag(tag);
	}

	/**
	 * 获取实体拥有的所有 Tag 列表
	 * @returns {String[]} 玩家所有的 tag 字符串列表
	 */
	getAllTags() {
		return this.PNXEntity.getAllTags().stream().map(item => {return item.parseValue()}).distinct().collect(Collectors.toList());
	}

	/**
	 * 获取实体对应的 NBT 对象
	 * @todo 待实现
	 * @returns {NbtCompound} LLSE的NbtCompound对象
	 */
	getNbt() {
		return true;
	}

	/**
	 * 写入实体对应的 NBT 对象
	 * @todo 待实现
	 * @param nbt {NbtCompound} NBT 对象
	 * @returns {boolean} 是否成功
	 */
	setNbt(nbt) {
		return true;
	}
}