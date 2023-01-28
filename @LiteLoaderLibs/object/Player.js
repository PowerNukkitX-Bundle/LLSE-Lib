import { DirectionAngle } from './DirectionAngle.js';
import { IntPos } from './IntPos.js';
import { FloatPos } from './FloatPos.js';
import { Device } from './Device.js';
import { Block } from './Block.js';
import { Item } from './Item.js';
import { Container } from '../container/Container.js';
import { ScoreObjectives } from './ScoreObjectives.js';
import { ModalForm } from '../gui/ModalForm.js';
import { SimpleForm } from '../gui/SimpleForm.js';
import { CustomForm } from '../gui/CustomForm.js';
import { isNumber } from '../utils/underscore-esm-min.js';
import { getLevels, onlyOnceExecute, server } from '../utils/Mixins.js';
import { InetSocketAddress } from 'java.net.InetSocketAddress';
import { Collectors } from 'java.util.stream.Collectors';
import { PlayerChatEvent } from 'cn.nukkit.event.player.PlayerChatEvent';
import { Position } from 'cn.nukkit.level.Position';
import { Vector3 } from 'cn.nukkit.math.Vector3';
import { EntityDamageByEntityEvent } from 'cn.nukkit.event.entity.EntityDamageByEntityEvent';
import { EntityDamageEvent } from 'cn.nukkit.event.entity.EntityDamageEvent';
import { Item as JItem } from 'cn.nukkit.item.Item';
import { Attribute } from 'cn.nukkit.entity.Attribute';
import { BossBarColor } from 'cn.nukkit.utils.BossBarColor';
import { AdventureSettings } from 'cn.nukkit.AdventureSettings';
import { NbtCompound } from '../nbt/NbtCompound.js';
import { BlockSnow } from 'cn.nukkit.block.BlockSnow';
import { BlockPowderSnow } from 'cn.nukkit.block.BlockPowderSnow';
import { BlockWallBase } from 'cn.nukkit.block.BlockWallBase';
import { Entity as PNXEntity } from 'cn.nukkit.entity.Entity';
import { BlockEndPortal } from 'cn.nukkit.block.BlockEndPortal';
import { BlockNetherPortal } from 'cn.nukkit.block.BlockNetherPortal';
import { BlockLava } from 'cn.nukkit.block.BlockLava';
import { BlockWitherRose } from 'cn.nukkit.block.BlockWitherRose';
import { BlockMagma } from 'cn.nukkit.block.BlockMagma';
import { BlockFire } from 'cn.nukkit.block.BlockFire';
import { BlockFireSoul } from 'cn.nukkit.block.BlockFireSoul';
import { BlockCampfire } from 'cn.nukkit.block.BlockCampfire';
import { BlockCampfireSoul } from 'cn.nukkit.block.BlockCampfireSoul';
import { Level } from 'cn.nukkit.level.Level';
import { Entity } from "./Entity.js";

const PlayerDB = contain('PlayerDB');
const ASType = AdventureSettings.Type;
const impl = new (Java.extend(Java.type('cn.nukkit.form.handler.FormResponseHandler')))({
    handle: function (player, formID) {
        if (!Player.FormCallbackMap.has(formID)) {
            return;
        }
        var win = Player.FormCallbackMap.get(formID);
        win._callback(Player.getPlayer(player), win._response);
        Player.FormCallbackMap.delete(formID);
    }
});

export class Player {
    static id = "7D623B95-3173-1F92-6B96-33C9C6CB99AC";
    static BossBarIdMap = new Map();// '玩家名': Map

    static PlayerMap = new Map();

    static ExtraDataMap = new Map();// '玩家名': {}

    static FormCallbackMap = new Map();// 'formId': function(){}

    /**
     * @type PNXPlayer
     */
    _PNXPlayer;
    /**
     * @type DirectionAngle
     */
    directionAngle;
    /**
     用来存放其他LLSE插件对该玩家物品的操作信息，refreshItems函数利用这个执行,refreshItems之后清空
     <p>
     [pnxItem, type: [hand, offhand], slot: number]
     */
    itemChangeList;

    /**
     * @param player {PNXPlayer}
     */
    constructor(player) {
        this._PNXPlayer = player;
        this.directionAngle = new DirectionAngle(player);
        this.levels = getLevels();
        this.itemChangeList = [];
    }

    /**
     * @param player {PNXPlayer}
     */
    static getPlayer(player) {
        if (!Player.PlayerMap.has(player.name) || !Player.PlayerMap.get(player.name)._PNXPlayer.isOnline()) {
            Player.BossBarIdMap.set(player.name, new Map());
            Player.PlayerMap.set(player.name, new Player(player));
            let uuid = String(player.getLoginChainData().getClientUUID()).toLowerCase();
            let xuid = String(player.getLoginChainData().getXUID()).toLowerCase();
            PlayerDB.exec(`INSERT INTO player (NAME, XUID, UUID)
                           VALUES ('${player.name.toLowerCase()}', '${xuid}', '${uuid}') ON CONFLICT (NAME) DO
            UPDATE
                SET XUID='${xuid}',
                UUID='${uuid}';`);
        }
        return Player.PlayerMap.get(player.name);
    }

    /**
     * @return {string} 返回玩家名
     */
    get name() {//
        return this._PNXPlayer.getDisplayName();
    }

    /**
     * @return {FloatPos} 返回玩家所在坐标
     */
    get pos() {
        return new FloatPos(this._PNXPlayer.getPosition());
    }

    /**
     * @return {IntPos} 返回玩家所在的方块坐标
     */
    get blockPos() {
        return new IntPos(this._PNXPlayer.getPosition());
    }

    /**
     * @return {string} 返回玩家的真实名字
     */
    get realName() {
        return this._PNXPlayer.getName();
    }

    /**
     * @return {string} 返回玩家Xuid字符串
     */
    get xuid() {
        return this._PNXPlayer.getLoginChainData().getXUID();
    }

    /**
     * @return {string} 返回玩家Uuid字符串
     */
    get uuid() {
        return this._PNXPlayer.getLoginChainData().getClientUUID();
    }

    /**
     * @return {number} 返回玩家的操作权限等级(0-4)
     */
    get permLevel() {
        return this._PNXPlayer.isOp() ? 1 : 0;
    }

    /**
     * @return {number} 返回玩家的游戏模式(0-3)
     */
    get gameMode() {
        return this._PNXPlayer.getGamemode();
    }

    /**
     * @return {boolean} 玩家是否可以飞行
     */
    get canFly() {
        return this._PNXPlayer.getAdventureSettings().get(Type.ALLOW_FLIGHT);
    }

    /**
     * @return {boolean} 玩家是否可以睡觉
     */
    get canSleep() {
        let time = this._PNXPlayer.getLevel().getTime() % Level.TIME_FULL;
        return time >= Level.TIME_NIGHT && time < Level.TIME_SUNRISE;
    }

    /**
     * @return {boolean} 玩家是否可以在地图上看到
     */
    get canBeSeenOnMap() {
        return true;
    }

    /**
     * @return {boolean} 玩家是否可以冻结
     */
    get canFreeze() {
        return this._PNXPlayer.getFreezingEffectStrength() > 0;
    }

    /**
     * @return {boolean} 玩家是否能看到日光
     */
    get canSeeDaylight() {
        return true;
    }

    /**
     * @return {boolean} 玩家是否可以显示姓名标签
     */
    get canShowNameTag() {
        return this._PNXPlayer.isNameTagVisible();
    }

    /**
     * @return {boolean} 玩家是否可以开始在床上睡觉
     */
    get canStartSleepInBed() {
        let time = this._PNXPlayer.getLevel().getTime() % Level.TIME_FULL;
        return time >= Level.TIME_NIGHT && time < Level.TIME_SUNRISE;
    }

    /**
     * @return {boolean} 玩家是否可以拾取物品
     */
    get canPickupItems() {
        return true;
    }

    /**
     * @return {number} 返回玩家最大生命值
     */
    get maxHealth() {
        return this._PNXPlayer.getMaxHealth();
    }

    /**
     * @return {Float} 返回玩家当前生命值
     */
    get health() {
        return this._PNXPlayer.getHealth();
    }

    /**
     * @return {Boolean} 返回玩家当前是否悬空
     */
    get inAir() {
        return this._PNXPlayer.getInAirTicks() > 0;
    }

    /**
     * @return {Boolean} 玩家当前是否在水中
     */
    get inWater() {
        return this._PNXPlayer.isSwimming();
    }

    /**
     * @return {Boolean} 玩家是否已经加载
     */
    get isLoading() {
        return this._PNXPlayer.isLoaderActive();
    }

    /**
     * @return {string} 玩家设置的语言的标识符(形如zh_CN)
     */
    get langCode() {
        return this._PNXPlayer.getLoginChainData().getLanguageCode();
    }

    /**
     * @returns {boolean} 实体是否在岩浆中
     */
    get inLava() {
        return this._PNXPlayer.isInsideOfLava();
    }

    /**
     * @todo 未实现
     * @returns {boolean} 玩家是否在雨中
     */
    get inRain() {
        return false;
    }

    /**
     * @returns {boolean} 玩家是否在雪中
     */
    get inSnow() {
        return this._checkCollisionBlocks([BlockSnow, BlockPowderSnow]);
    }

    /**
     * @returns {boolean} 玩家是否在墙上
     */
    get inWall() {
        return this._checkCollisionBlocks([BlockWallBase]);
    }

    /**
     * @returns {boolean} 玩家是否在水中或雨中
     */
    get inWaterOrRain() {
        return this.inWater;
    }

    /**
     * @todo 不懂什么意思
     * @returns {boolean} 玩家是否在世界中
     */
    get inWorld() {
        return true;
    }

    /**
     * @returns {boolean} 玩家是否在云端
     */
    get inClouds() {
        return this._PNXPlayer.getY() > 192;
    }

    /**
     * @returns {boolean} 玩家是否不可见
     */
    get isInvisible() {
        return this._PNXEntity.getDataPropertyBoolean(PNXEntity.DATA_FLAG_INVISIBLE);
    }

    /**
     * @returns {boolean} 玩家是否在门户内
     */
    get isInsidePortal() {
        return this._checkCollisionBlocks([BlockEndPortal, BlockNetherPortal]);
    }

    /**
     * @returns {boolean} 玩家是否受伤
     */
    get isHurt() {
        return this._PNXPlayer.getHealth() < this._PNXPlayer.getMaxHealth();
    }

    /**
     * @returns {boolean} 玩家是否饿了
     */
    get isHungry() {
        return this._PNXPlayer.getFoodData().getLevel() < this._PNXPlayer.getFoodData().getMaxLevel();
    }

    /**
     * @todo 弄懂这是啥
     * @returns {boolean} 玩家是否信任
     */
    get isTrusting() {
        return true;
    }

    /**
     * @returns {boolean} 玩家是否接触到伤害方块
     */
    get isTouchingDamageBlock() {
        return this._checkCollisionBlocks([BlockLava, BlockWitherRose, BlockMagma, BlockFire, BlockFireSoul, BlockCampfire, BlockCampfireSoul]);
    }

    /**
     * @returns {boolean} 玩家是否在地面
     */
    get isOnGround() {
        return !this.inAir;
    }

    /**
     * @returns {boolean} 玩家是否在热块上
     */
    get isOnHotBlock() {
        return this._checkCollisionBlocks([BlockMagma]);
    }

    /**
     * @todo pnx未实现检测
     * @returns {boolean} 玩家是否在交易
     */
    get isTrading() {
        return true;
    }

    /**
     * @todo pnx未实现检测
     * @returns {boolean} 玩家是否正在骑行
     */
    get isRiding() {
        return true;
    }

    /**
     * @todo pnx未实现检测
     * @returns {boolean} 玩家是否在跳舞
     */
    get isDancing() {
        return true;
    }

    /**
     * @returns {boolean} 玩家是否在睡觉
     */
    get isSleeping() {
        return this._PNXPlayer.isSleeping();
    }

    /**
     * @todo pnx未实现检测
     * @returns {boolean} 玩家是否移动
     */
    get isMoving() {
        return this._PNXPlayer.positionChanged;
    }

    /**
     * @returns {boolean} 玩家是否是冒险模式
     */
    get isAdventure() {
        return this._PNXPlayer.isAdventure();
    }

    /**
     * @returns {boolean} 玩家是否是生存模式
     */
    get isSurvival() {
        return this._PNXPlayer.isSurvival();
    }

    /**
     * @returns {boolean} 玩家是否是观众模式
     */
    get isSpectator() {
        return this._PNXPlayer.isSpectator();
    }

    /**
     * @returns {boolean} 玩家是否是创造模式
     */
    get isCreative() {
        return this._PNXPlayer.isCreative();
    }

    /**
     * @return {Boolean} 玩家当前是否正在潜行
     */
    get sneaking() {
        return this._PNXPlayer.isSneaking();
    }

    /**
     * @return {Float} 返回玩家当前速度
     */
    get speed() {
        return this._PNXPlayer.getMovementSpeed();
    }

    /**
     * @return {DirectionAngle} 返回玩家当前朝向
     */
    get direction() {
        return this.DirectionAngle;
    }

    /**
     * @return {String} 返回玩家(实体的)唯一标识符
     */
    get uniqueId() {
        return this._PNXPlayer.getUniqueId().toString();
    }

    /**
     * @return {String} 返回玩家(实体的)唯一标识符
     */
    get ip() {
        return this._PNXPlayer.getRawAddress();
    }

    /**
     * 按照输入检查玩家碰撞到的方块
     * @pnxonly
     * @param blocks {Array} 目标检查的方块数组
     * @return boolean 玩家是否碰撞到目标方块
     */
    _checkCollisionBlocks(blocks) {
        for (let block of this._PNXPlayer.getCollisionBlocks()) {
            blocks.map((v, i) => {
                if (block instanceof v) {
                    return true;
                }
            });
        }
        return false
    }

    /**
     * 判断玩家是否为OP
     * @returns {boolean} 玩家是否为OP
     */
    isOP() {
        return this._PNXPlayer.isOp();
    }

    /**
     * 断开玩家连接
     * @param msg {string} (可选参数)被踢出玩家出显示的断开原因
     * @returns {boolean} 是否成功断开连接
     */
    kick(msg) {
        return this._PNXPlayer.kick(msg);
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
        if (!sendMessage(server.getConsoleSender(), this._PNXPlayer, msg, type)) {
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
     * 在屏幕上方显示消息 (类似于成就完成)
     * @param title {string} 待发送的标题
     * @param context {string} 待发送的文本
     * @returns {boolean} 是否成功发送
     */
    sendToast(title, context) {
        this._PNXPlayer.sendToast(title, context);
        return true;
    }

    /**
     * 以某个玩家身份执行一条命令
     * @param cmd {string} 待执行的命令
     * @returns {boolean} 是否执行成功
     */
    runcmd(cmd) {
        return server.dispatchCommand(this._PNXPlayer, cmd);
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
        if (arguments.length === 2) {
            return sendMessage(this._PNXPlayer, target._PNXPlayer, text, 1);
        } else if (arguments.length === 1) {
            var event = new PlayerChatEvent(this._PNXPlayer, target);
            server.getPluginManager().callEvent(event);
            if (!event.isCancelled()) {
                server.broadcastMessage(server.getLanguage().translateString(event.getFormat(), [event.getPlayer().getDisplayName(), event.getMessage()]), event.getRecipients());
            }
            return true;
        } else {
            throw 'Wrong number of parameters.';
        }
    }

    /**
     * 获取玩家到坐标的距离
     * @param {Entity | Player | IntPos | FloatPos}  pos 目标位置
     * @returns {number} 到坐标的距离(方块)
     */
    distanceTo(pos) {
        let target;
        if (pos instanceof Entity) {
            target = pos._PNXEntity;
        } else if (pos instanceof Entity) {
            target = pos._PNXPlayer;
        } else {
            target = pos.position;
        }
        return this._PNXPlayer.distanceSquared(target);
    }

    /**
     * 获取玩家到坐标的距离
     * @param {Entity | Player | IntPos | FloatPos}  pos 目标位置
     * @returns {number} 到坐标的距离(方块)
     */
    distanceToSqr(pos) {
        let target;
        if (pos instanceof Entity) {
            target = pos._PNXEntity;
        } else if (pos instanceof Entity) {
            target = pos._PNXPlayer;
        } else {
            target = pos.position;
        }
        return this._PNXPlayer.distance(target);
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
        if (arguments.length === 1) {
            return this._PNXPlayer.teleport(x.position);
        } else if (arguments.length === 4) {
            if (isNumber(dimid) && (0 <= dimid <= 2)) {
                var level = this.levels[dimid];
            } else return false;
            return this._PNXPlayer.teleport(Position.fromObject(new Vector3(x, y, z), level));
        } else return false;
    }

    /**
     * 杀死玩家
     * @returns {boolean} 是否成功执行
     */
    kill() {
        this._PNXPlayer.kill();
        return !this._PNXPlayer.isAlive();
    }

    /**
     * 对玩家造成伤害
     * @param damage {Integer} 对玩家造成的伤害数值
     * @returns {boolean} 是否造成伤害
     */
    hurt(damage) {
        return this._PNXPlayer.attack(new EntityDamageByEntityEvent(this._PNXPlayer, EntityDamageEvent.DamageCause.NONE, damage));
    }

    /**
     * 治疗玩家
     * @param {number} health 治疗的心数
     * @returns {boolean}  治疗是否成功
     */
    heal(health) {
        return this._PNXPlayer.heal(Math.floor(health) * 2);
    }

    /**
     * 设置玩家的生命值
     * @param {number} health 生命值数
     * @returns {boolean}  是否成功
     */
    setHealth(health) {
        return this._PNXPlayer.setHealth(Math.floor(health));
    }

    /**
     * 为玩家设置伤害吸收属性
     * @param {number} value  新的值
     * @returns {boolean}  为玩家设置属性值是否成功
     */
    setAbsorption(value) {
        return this._PNXPlayer.setAbsorption(Math.floor(value));
    }

    /**
     * todo 为玩家设置攻击伤害属性
     * @param {number} value  新的值
     * @returns {boolean}  为玩家设置属性值是否成功
     */
    /*setMaxAttackDamage(value) {
    }*/

    /**
     * todo为玩家设置跟随范围
     * @param {number} value  新的值
     * @returns {boolean}  为玩家设置属性值是否成功
     */
    /*setFollowRange(value) {
    }*/

    /**
     * todo 为玩家设置击退抵抗属性
     * @param {number} value  新的值
     * @returns {boolean}  为玩家设置属性值是否成功
     */
    /*setKnockbackResistance(value) {
    }*/

    /**
     * todo 为玩家设置幸运属性
     * @param {number} value  新的值
     * @returns {boolean}  为玩家设置属性值是否成功
     */

    /*setLuck(value) {
    }*/

    /**
     * 为玩家设置移动速度属性
     * @param {number} value  新的值
     * @returns {boolean}  为玩家设置属性值是否成功
     */
    setMovementSpeed(value) {
        this._PNXPlayer.setMovementSpeed(value);
        return true;
    }

    /**
     * todo 为玩家设置水下移动速度属性
     * @param {number} value  新的值
     * @returns {boolean}  为玩家设置属性值是否成功
     */
    /*setUnderwaterMovementSpeed(value) {
    }*/
    /**
     * todo 为玩家设置岩浆上移动速度属性
     * @param {number} value  新的值
     * @returns {boolean}  为玩家设置属性值是否成功
     */

    /*setLavaMovementSpeed(value) {
    }*/

    /**
     * 设置玩家最大生命值
     * @param {number} health    饥饿值数
     * @returns {boolean}  为玩家设置属性值是否成功
     */
    setMaxHealth(health) {
        this._PNXPlayer.setMaxHealth(value);
        return true;
    }

    /**
     * 设置玩家饥饿值
     * @param {number} hunger  新的值
     * @returns {boolean}  为玩家设置属性值是否成功
     */
    setHungry(hunger) {
        let data = this._PNXPlayer.getFoodData();
        if (data !== null) {
            data.setLevel(hunger);
            return true;
        } else {
            return false;
        }
    }

    /**
     * 使指定玩家着火
     * @param {number} time 着火时长，单位秒
     * @returns {boolean} 是否成功着火
     */
    setOnFire(time) {
        this._PNXPlayer.setOnFire(time);
        return this._PNXPlayer.isOnFire();
    }

    /**
     * 熄灭玩家
     * @returns {boolean} 是否已被熄灭
     */
    stopFire() {
        this._PNXPlayer.setOnFire(0);
        return true;
    }

    /**
     * 缩放玩家
     * @param {number} scale 新的玩家体积
     * @returns {boolean} 玩家是否成功地被缩放
     */
    setScale(scale) {
        this._PNXPlayer.setScale(scale);
        return true;
    }

    /**
     * 重命名玩家
     * @param newname {string} 玩家的新名字
     * @returns {boolean} 是否重命名成功
     */
    rename(newname) {
        this._PNXPlayer.setDisplayName(newname);
        return true;
    }

    /**
     * 获取玩家当前站立所在的方块
     * @returns {Block} 当前站立在的方块对象
     */
    getBlockStandingOn() {
        return new Block(this._PNXPlayer.getPosition().add(0, -0.1).getLevelBlock());
    }

    /**
     * 获取玩家对应的设备信息对象
     * @returns {Device} 玩家对应的设备信息对象
     */
    getDevice() {
        return new Device(this._PNXPlayer);
    }

    /**
     * 获取玩家主手中的物品对象
     * @returns {Item} 玩家主手中的物品对象
     */
    getHand() {
        const handitem = new Item(this._PNXPlayer.getInventory().getItemInHand());
        if (handitem != null) {
            this.itemChangeList.push([handitem._PNXItem, 'hand', this._PNXPlayer.getInventory().getHeldItemIndex()]);
        }
        return handitem;
    }

    /**
     * 获取副手物品
     * @returns {Item} Item对象
     */
    getOffHand() {
        const offhandItem = new Item(this._PNXPlayer.getOffhandInventory().getItem(0));
        if (offhandItem != null) {
            this.itemChangeList.push([offhandItem._PNXItem, 'offhand', 0]);
        }
        return offhandItem;
    }

    /**
     * 获取玩家背包对象
     * @todo 测试
     * @returns {Container} Container对象
     */
    getInventory() {
        return new Container(this._PNXPlayer.getInventory());
    }

    /**
     * 获取玩家盔甲栏对象
     * @todo 测试
     * @returns {Container} Container对象
     */
    getArmor() {
        return new PlayerArmorContainer(this._PNXPlayer.getInventory());
    }

    /**
     * 获取玩家末影箱对象
     * @todo 测试
     * @returns {Container} Container对象
     */
    getEnderChest() {
        return new Container(this._PNXPlayer.getEnderChestInventory());
    }

    /**
     * 获取玩家重生点位置
     * @returns {IntPos} IntPos对象
     */
    getRespawnPosition() {
        return new IntPos(this._PNXPlayer.getSpawn());
    }

    /**
     * 设置获取玩家重生点位置
     * @param x {number} x
     * @param y {number} y
     * @param z {number} z
     * @param dimid {number} 维度id
     * @returns {boolean} 是否成功修改
     */
    setRespawnPosition(x, y, z, dimid) {
        /*
        args1: pos
        args2: x,y,z,dimid
        */
        if (arguments.length === 1) {
            return this._PNXPlayer.setSpawn(x.position);
        } else if (arguments.length === 4) {
            if (isNumber(dimid) && (0 <= dimid <= 2)) {
                var level = this.levels[dimid];
            } else return false;
            return this._PNXPlayer.setSpawn(Position.fromObject(new Vector3(x, y, z), level));
        } else return false;
    }

    /**
     * 给予玩家一个物品
     * @param item {Item} 物品对象
     * @returns {boolean} 是否成功给予
     */
    giveItem(item) {
        if (item instanceof Item) {
            this._PNXPlayer.giveItem(item._PNXItem);
        } else if (item instanceof JItem) {
            this._PNXPlayer.giveItem(item);
        } else {
            return false;
        }
        return true;
    }

    /**
     * 清除玩家背包中所有指定类型的物品
     * @param type {string} 要清除的物品对象类型名
     * @returns {number} 清除的物品个数
     */
    clearItem(type) {
        if (type == null) return 0
        let num = 0;
        let inv = this._PNXPlayer.getInventory()
        let limit = inv.getSize() + 4
        for (let i = 0; i < limit; i++) {
            if (inv.getItem(i).getNamespaceId() === type) {
                inv.clear(i);
                num++
            }
        }
        return num;
    }

    /**
     * 刷新玩家物品栏、盔甲栏
     * @returns {boolean} 是否成功
     */
    refreshItems() {
        if (this.itemChangeList.length === 0) return false;
        for (let array of this.itemChangeList) {
            //todo 支持物品栏 盔甲栏刷新
            switch (array[1]) {
                case 'hand': {
                    this._PNXPlayer.getInventory().setItem(array[2], array[0], true);
                    break;
                }
                case 'offhand': {
                    this._PNXPlayer.getOffhandInventory().setItem(array[2], array[0], true);
                    break;
                }
                default:
                    return false;
            }
        }
        this.itemChangeList = [];
        return true;
    }

    /**
     * 刷新玩家加载的所有区块
     * @returns {boolean} 是否成功
     */
    refreshChunks() {
        return true;
    }

    /**
     * 修改玩家操作权限 （0、1、4） 普通、OP、OP+
     * @param level {number} 目标操作权限等级
     * @returns {boolean} 是否成功
     */
    setPermLevel(level) {
        if (level < 1) {
            this._PNXPlayer.setOp(false);
        } else {
            this._PNXPlayer.setOp(true);
        }
        return true;
    }

    /**
     * 修改玩家游戏模式（0~2）
     * @param mode {number} 目标游戏模式
     * @returns {boolean} 是否成功
     */
    setGameMode(mode) {
        return this._PNXPlayer.setGamemode(mode);
    }

    /**
     * 提高玩家经验等级
     * @param count {number} 要提升的经验等级
     * @returns {boolean} 是否成功
     */
    addLevel(count) {
        if (isNaN(count)) {
            return false;
        }
        this._PNXPlayer.setExperience(this._PNXPlayer.getExperien(), this._PNXPlayer.getExperienceLevel() + Number(count));
        return true;
    }

    /**
     * 获取玩家经验等级
     * @returns {number} 玩家经验等级
     */
    getLevel() {
        return this._PNXPlayer.getExperienceLevel();
    }

    /**
     * 重置玩家经验
     * @returns {boolean} 是否成功
     */
    resetLevel() {
        this._PNXPlayer.setExperience(0);
        return true;
    }

    /**
     * 获取玩家升级所需的经验值
     * @returns {number} 玩家升级所需的经验值
     */
    getXpNeededForNextLevel() {
        return this._PNXPlayer.calculateRequireExperience(this.getLevel()) - this._PNXPlayer.getExperien();
    }

    /**
     * 提高玩家经验值
     * @param count {number} 要提升的经验值
     * @returns {boolean} 是否成功
     */
    addExperience(count) {
        if (isNaN(count)) {
            return false;
        }
        this._PNXPlayer.setExperience(this._PNXPlayer.getExperien() + Number(count), this.getLevel(), true);
        return true;
    }

    /**
     * 传送玩家至指定服务器
     * @param server {string} 目标服务器 IP / 域名
     * @param [port=19132] {number} 目标服务器端口
     * @returns {boolean} 是否成功
     */
    transServer(server, port = 19132) {
        this._PNXPlayer.transfer(new InetSocketAddress(server, port));
        return true;
    }

    /**
     * 使玩家客户端崩溃
     * @todo 待实现
     * @returns {boolean} 是否成功
     */
    crash() {
        this._PNXPlayer.kick('crash');
        return true;
    }

    /**
     * 设置玩家自定义侧边栏
     * @todo 待实现
     * @param title {string} 侧边栏标题
     * @param data {object} 侧边栏对象内容对象
     * @param [sortOrder=1] {number} 侧边栏内容的排序顺序。（0为升序，1为降序）
     * @returns {boolean} 是否成功
     */
    setSidebar(title, data, sortOrder = 1) {
        //scoreborad.setSort(SortOrder.values()[sortOrder]);
        //server.getScoreboardManager().setDisplay(DisplaySlot.SIDEBAR, )
        return true;
    }

    /**
     * 移除玩家自定义侧边栏
     * @todo 待实现
     * @returns {boolean} 是否成功
     */
    removeSidebar() {
        //server.getScoreboardManager().removeDisplay(DisplaySlot.SIDEBAR);
        return true;
    }

    /**
     * 设置玩家看到的自定义 Boss 血条
     * @param uid {number} 唯一ID
     * @param title {string} 自定义血条标题
     * @param percent {number} 血条中的血量百分比（0~100）
     * @param [color=2] {number} 血条颜色 (默认值为 2 (RED))
     * @returns {boolean} 是否成功
     */
    setBossBar(uid, title, percent, color = 2) {
        if (arguments.length <= 3) {
            color = percent || 2;
            percent = title;
            title = uid;
            uid = 'default';
        }
        if (!Player.BossBarIdMap.has(this._PNXPlayer.name)) {
            return false;
        }
        let mapData = Player.BossBarIdMap.get(this._PNXPlayer.name);
        if (mapData.has(uid)) {
            this._PNXPlayer.updateBossBar(title, percent, mapData.get(uid));
            this._PNXPlayer.getDummyBossBar(mapData.get(uid)).setColor(BossBarColor.values()[color]);
        } else {
            mapData.set(uid, this._PNXPlayer.createBossBar(title, percent));
            if (color != 2) {
                this._PNXPlayer.getDummyBossBar(mapData.get(uid)).setColor(BossBarColor.values()[color]);
            }
        }
        return true;
    }

    /**
     * 移除玩家看到的自定义 Boss 血条
     * @param uid {number} 唯一ID
     * @returns {boolean} 是否成功
     */
    removeBossBar(uid = 'default') {
        if (!Player.BossBarIdMap.has(this._PNXPlayer.name)) {
            return false;
        }
        let mapData = Player.BossBarIdMap.get(this._PNXPlayer.name);
        if (!mapData.has(uid)) {
            return false;
        }
        this._PNXPlayer.removeBossBar(mapData.get(uid));
        mapData.delete(uid);
        return true;
    }

    /**
     * 获取玩家对应的 NBT 对象
     * @todo 待测试
     * @returns {NbtCompound} LLSE的NbtCompound对象
     */
    getNbt() {
        return new NbtCompound(this._PNXPlayer.namedTag);
    }

    /**
     * 写入玩家对应的 NBT 对象
     * @todo 待测试
     * @param NbtCompound {NbtCompound} NBT 对象
     * @returns {boolean} 是否成功
     */
    setNbt(NbtCompound) {
        if (!NbtCompound._pnxNbt.isEmpty()) {
            this._PNXPlayer.namedTag = NbtCompound._pnxNbt;
            return true;
        }
        return false;
    }

    /**
     * 为玩家增加一个 Tag
     * @param tag {string} 要增加的 tag 字符串
     * @returns {boolean} 是否成功
     */
    addTag(tag) {
        if (this._PNXPlayer.containTag(tag)) {
            return false;
        }
        this._PNXPlayer.addTag(tag);
        return true;
    }

    /**
     * 为玩家移除一个 Tag
     * @param tag {string} 要移除的 tag 字符串
     * @returns {boolean} 是否成功
     */
    removeTag(tag) {
        if (!this._PNXPlayer.containTag(tag)) {
            return false;
        }
        this._PNXPlayer.removeTag(tag);
        return true;
    }

    /**
     * 检查玩家是否拥有某个 Tag
     * @param tag {string} 要检查的 tag 字符串
     * @returns {boolean} 是否拥有
     */
    hasTag(tag) {
        return this._PNXPlayer.containTag(tag);
    }

    /**
     * 获取玩家拥有的所有 Tag 列表
     * @returns {String[]} 玩家所有的 tag 字符串列表
     */
    getAllTags() {
        return this._PNXPlayer.getAllTags().stream().map(item => {
            return item.parseValue()
        }).distinct().collect(Collectors.toList());
    }

    /**
     * 获取玩家的 Abilities 能力列表（来自玩家 NBT）
     * @todo 待完善，WTF mojang.
     * @returns {object} 玩家所有能力信息的键 - 值对列表对象 例子：{'mayfly': number, ...}
     */
    getAbilities() {
        return {
            "attackmobs": Number(this._PNXPlayer.getAdventureSettings().get(ASType.ATTACK_MOBS)),
            "attackplayers": Number(this._PNXPlayer.getAdventureSettings().get(ASType.ATTACK_PLAYERS)),
            "build": 1,// 建造，与nk冲突
            "doorsandswitches": Number(this._PNXPlayer.getAdventureSettings().get(ASType.DOORS_AND_SWITCHED)),
            "flySpeed": 0.05000000074505806,
            "flying": Number(this._PNXPlayer.getAdventureSettings().get(ASType.FILYING)),
            "instabuild": 0,// 迷惑..
            "invulnerable": Number(this._PNXPlayer.getAdventureSettings().get(ASType.NO_CLIP)),
            "lightning": 0,// 迷惑..
            "mayfly": Number(this._PNXPlayer.getAdventureSettings().get(ASType.ALLOW_FLIGHT)),
            "mine": 1,// 破坏，与nk冲突
            "op": Number(this._PNXPlayer.getAdventureSettings().get(ASType.OPERATOR)),
            "opencontainers": Number(this._PNXPlayer.getAdventureSettings().get(ASType.OPEN_CONTAINERS)),
            "permissionsLevel": Number(this._PNXPlayer.getAdventureSettings().get(ASType.OPERATOR)),// 与op相同
            "playerPermissionsLevel": 2,// [普通权限, ？, OP, 自定义权限]
            "teleport": Number(this._PNXPlayer.getAdventureSettings().get(ASType.TELEPORT)),
            "walkSpeed": 0.10000000149011612
        };
    }

    /**
     * 获取玩家的 Attributes 属性列表（来自玩家 NBT）
     * @todo 待完善
     * @returns {array} 玩家所有属性对象的数组 键名有：Base Current DefaultMax DefaultMin Max Min Name
     */
    getAttributes() {
        var myAttribute = [
            Attribute.ABSORPTION,
            Attribute.SATURATION,
            Attribute.EXHAUSTION,
            Attribute.KNOCKBACK_RESISTANCE,
            Attribute.MAX_HEALTH,
            Attribute.MOVEMENT_SPEED,
            Attribute.FOLLOW_RANGE,
            Attribute.MAX_HUNGER,
            Attribute.ATTACK_DAMAGE,
            Attribute.EXPERIENCE_LEVEL,
            Attribute.EXPERIENCE,
            Attribute.LUCK
        ];
        myAttribute.forEach((v, i) => {
            const javaAttribute = Attribute.getAttribute(v);
            myAttribute[i] = {
                "Base": javaAttribute.getDefaultValue(),
                "Current": javaAttribute.getDefaultValue(),
                "DefaultMax": javaAttribute.getMaxValue(),
                "DefaultMin": javaAttribute.getMinValue(),
                "Max": javaAttribute.getMaxValue(),
                "Min": javaAttribute.getMinValue(),
                "Name": javaAttribute.getName()
            }
        });
        myAttribute[Attribute.MAX_HEALTH].Max = this._PNXPlayer.getMaxHealth();
        myAttribute[Attribute.MAX_HEALTH].Current = this._PNXPlayer.getHealth() > 0 ? (this._PNXPlayer.getHealth() < this._PNXPlayer.getMaxHealth() ? this._PNXPlayer.getHealth() : this._PNXPlayer.getMaxHealth()) : 0;
        myAttribute[Attribute.MAX_HUNGER].Current = this._PNXPlayer.getFoodData().getLevel();
        myAttribute[Attribute.MOVEMENT_SPEED].Current = this._PNXPlayer.getMovementSpeed();
        myAttribute[Attribute.EXPERIENCE_LEVEL].Current = this._PNXPlayer.getExperienceLevel();
        myAttribute[Attribute.EXPERIENCE].Current = this._PNXPlayer.getExperience() / this._PNXPlayer.calculateRequireExperience(this._PNXPlayer.getExperienceLevel());
        return myAttribute;
    }

    /**
     * 获取玩家疾跑状态
     * @returns {boolean} 玩家疾跑状态
     */
    isSprinting() {
        return this._PNXPlayer.isSprinting();
    }

    /**
     * 设置玩家疾跑状态
     * @param sprinting {boolean} 疾跑状态
     * @returns {boolean} 是否成功
     */
    setSprinting(sprinting) {
        this._PNXPlayer.setSprinting(sprinting);
        return this.isSprinting();
    }

    // 🏃‍♂️ 玩家绑定数据
    /**
     * 储存玩家绑定数据
     * @param name {string} 要储存到绑定数据的名字
     * @param data {any} 你要储存的绑定数据
     * @returns {boolean} 是否成功
     */
    setExtraData(name, data) {
        if (!Player.ExtraDataMap.has(this.realName)) {
            Player.ExtraDataMap.set(this.realName, new Map());
        }
        Player.ExtraDataMap.get(this.realName).set(name, data);
        return true;
    }

    /**
     * 获取玩家绑定数据
     * @param name {string} 要读取的绑定数据的名字
     * @returns {any} 返回获取的数据
     */
    getExtraData(name) {
        if (!Player.ExtraDataMap.has(this.realName)) {
            Player.ExtraDataMap.set(this.realName, new Map());
        }
        return Player.ExtraDataMap.get(this.realName).get(name);
    }

    /**
     * 删除玩家绑定数据
     * @param name {string} 要删除的绑定数据的名字
     * @returns {boolean} 是否成功
     */
    delExtraData(name) {
        if (!Player.ExtraDataMap.has(this.realName)) {
            Player.ExtraDataMap.set(this.realName, new Map());
        }
        if (Player.ExtraDataMap.get(this.realName).has(name)) {
            Player.ExtraDataMap.get(this.realName).delete(name);
            return true;
        } else {
            return false;
        }
    }

    // 📊 表单相关 API
    /**
     * 向玩家发送模式表单(对话表单)
     * @param title {string} 要删除表单标题的绑定数据的名字
     * @param content {string} 表单内容
     * @param button1 {string} 按钮 1 文本的字符串
     * @param button2 {string} 按钮 2 文本的字符串
     * @param callback {function} 玩家点击按钮之后被调用的回调函数。 call(Player player, Boolean result)
     * @returns {number} 发送的表单 ID
     */
    sendModalForm(title, content, button1, button2, callback) {
        const form = new ModalForm(title, content, button1, button2);
        form.setCallback(callback);
        form._Form.addHandler(impl);
        Player.FormCallbackMap.set(form._id, form);
        this._PNXPlayer.showFormWindow(form._Form, form._id);
        return form._id;
    }

    /**
     * 向玩家发送普通表单
     * @param title {string} 要删除表单标题的绑定数据的名字
     * @param content {string} 表单内容
     * @param buttons {Array<String,...>} 各个按钮文本的字符串数组
     * @param images {Array<String,...>} 各个按钮对应的图片路径
     * @param callback {function} 玩家点击按钮之后被调用的回调函数。 call(Player player, Number id)
     * @returns {number} 发送的表单 ID
     */
    sendSimpleForm(title, content, buttons, images, callback) {
        const form = new SimpleForm(title, content);
        form.setCallback(callback);
        buttons.forEach((v, i) => {
            form.addButton(v, images[i]);
        });
        form._Form.addHandler(impl);
        Player.FormCallbackMap.set(form._id, form);
        this._PNXPlayer.showFormWindow(form._Form, form._id);
        return form._id;
    }

    /**
     * 向玩家发送自定义表单（Json 格式）
     * @todo 待实现，解析传入的json
     * @param json {string|object} 自定义表单 json
     * @param callback {function} 玩家点击按钮之后被调用的回调函数。 call(Player player, Array data)
     * @returns {number} 发送的表单 ID
     */
    sendCustomForm(json, callback) {
        const form = new CustomForm();
        form.setCallback(callback);
        form._Form.addHandler(impl);
        Player.FormCallbackMap.set(form._id, form);
        return form._id;
    }

    /**
     * 发送表单
     * @param form {CustomForm|SimpleForm} 表单对象
     * @param callback {function} 玩家点击按钮之后被调用的回调函数。 call(Player player, Array data)
     * @returns {number} 发送的表单 ID
     */
    sendForm(form, callback) {
        if (!callback) {
            return null;
        }
        form.setCallback(callback);
        form._Form.addHandler(impl);
        Player.FormCallbackMap.set(form._id, form);
        this._PNXPlayer.showFormWindow(form._Form, form._id);
        return form._id;
    }

    /**
     * 获取玩家计分项的分数
     * @param name {string} 计分项名称
     * @returns {number} 分数
     */
    getScore(name) {
        let score = ScoreObjectives.getObjectives(name);
        return score.getScore(this);
    }

    /**
     * 修改玩家计分项的分数
     * @param name {string} 计分项名称
     * @param value {number} 计分项名称
     * @returns {boolean} 是否设置成功
     */
    setScore(name, value) {
        let score = ScoreObjectives.getObjectives(name);
        return score.setScore(this, value) != null;
    }

    /**
     * 添加玩家计分项的分数
     * @see setScore
     */
    addScore(name, value) {
        let score = ScoreObjectives.getObjectives(name);
        return score.addScore(this, value) != null;
    }

    /**
     * 减少玩家计分项的分数
     * @see setScore
     */
    reduceScore(name, value) {
        let score = ScoreObjectives.getObjectives(name);
        return score.reduceScore(this, value) != null;
    }

    /**
     * 玩家停止跟踪计分项
     * @param name {string} 计分项名称
     * @returns {boolean} 是否成功
     */
    deleteScore(name) {
        let score = ScoreObjectives.getObjectives(name);
        return score.deleteScore(this);
    }

    toString() {
        return JSON.stringify({realName: this.realName});
    }
}

export function sendMessage(sender = '', receiver, msg, type) {
    switch (type) {
        case 0: {
            receiver.sendMessage(msg);
            break;
        }
        case 1: {
            receiver.sendMessage('[' + (sender && sender.getName()) + ' -> ' + receiver.getName() + '] ' + msg);
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

onlyOnceExecute(() => {
    if (!contain('PlayerDB')) {// 防止重复database
        exposeObject('PlayerDB', new DBSession('sqlite3', {path: './plugins/LiteLoaderLibs/PlayerDB.db'}));
    }
    // noinspection SqlNoDataSourceInspection
    if (!PlayerDB.query("SELECT COUNT(*) FROM sqlite_master where type ='table' and name ='player'")[1][0]) {
        // noinspection SqlNoDataSourceInspection
        PlayerDB.exec(`CREATE TABLE player
                       (
                           NAME TEXT PRIMARY KEY NOT NULL,
                           XUID TEXT             NOT NULL,
                           UUID TEXT             NOT NULL
                       ) WITHOUT ROWID;`);
    }
}, Player.id);
