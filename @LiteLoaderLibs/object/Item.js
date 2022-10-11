import { Item as PNXItem } from 'cn.nukkit.item.Item';
import { ItemBlock } from 'cn.nukkit.item.ItemBlock';
import { ItemBookEnchanted } from 'cn.nukkit.item.ItemBookEnchanted';
import { ItemHorseArmorLeather } from 'cn.nukkit.item.ItemHorseArmorLeather';
import { ItemHorseArmorIron } from 'cn.nukkit.item.ItemHorseArmorIron';
import { ItemHorseArmorGold } from 'cn.nukkit.item.ItemHorseArmorGold';
import { ItemHorseArmorDiamond } from 'cn.nukkit.item.ItemHorseArmorDiamond';
import { ItemRecord } from 'cn.nukkit.item.ItemRecord';
import { ItemPotion } from 'cn.nukkit.item.ItemPotion';
import { ItemPotionLingering } from 'cn.nukkit.item.ItemPotionLingering';
import { ItemPotionSplash } from 'cn.nukkit.item.ItemPotionSplash';
import { Position } from 'cn.nukkit.level.Position';
import { Vector3 } from 'cn.nukkit.math.Vector3';
import { EntityItem } from "cn.nukkit.entity.item.EntityItem";
import { Entity as PNXEntity } from "cn.nukkit.entity.Entity";
import { Random } from "java.util.Random";
import { NBTIO } from "cn.nukkit.nbt.NBTIO";
import { Entity } from "./Entity.js";
import { server } from '../utils/Mixins.js'

export class Item {
    /**
     * 生产新的 Item 方法对象
     * @param name {PNXItem|String}
     * @param count {Number}
     * @returns {Item} 物品对象 如返回值为 Null 则表示生成失败
     */
    constructor(name, count) {
        if (name instanceof PNXItem) {
            this._PNXItem = name;
        } else {
            this._PNXItem = PNXItem.fromString(name);
            if (count) {
                this._PNXItem.setCount(count);
            }
        }
    }

    /**
     * 生成新的物品对象
     * @todo 未完善
     * @param name {String} 物品的标准类型名，如 minecraft:bread
     * @param count {Number} 物品堆叠数量
     * @returns {Item|null}
     */
    static newItem(name, count = null) {
        /*
        args1: JItem
        args2: name, count
        args3: NbtCompound // 未实现
        */
        let item = new Item(name, count);
        if (item.isNull()) {
            return null;
        }
        return item;
    }

    /**
     * @return {string} 游戏内显示的物品名称
     */
    get name() {
        return this._PNXItem.getName();
    }

    /**
     * @return {string} 物品标准类型名
     */
    get type() {
        return this._PNXItem.getNamespaceId();
    }

    /**
     * @return {Number} 物品的游戏内id
     */
    get id() {
        return this._PNXItem.getId();
    }

    /**
     * @return {Number} 这个物品对象堆叠的个数
     */
    get count() {
        return this._PNXItem.getCount();
    }

    /**
     * @return {Number} 物品附加值（如羊毛颜色）
     */
    get aux() {
        return this._PNXItem.getDamage();
    }

    /**
     * @return {Number} 物品当前耐久
     */
    get damage() {
        if (this._PNXItem.isTool() || this._PNXItem.isArmor()) return this.maxDamage - this._PNXItem.getDamage();
        else return -1;
    }

    /**
     * @return {string} 物品攻击伤害
     */
    get attackDamage() {
        return this._PNXItem.getAttackDamage();
    }

    /**
     * @return {Number} 物品最大耐久
     */
    get maxDamage() {
        return this._PNXItem.getMaxDurability();
    }

    /**
     * @return {boolean} 物品是否为盔甲
     */
    get isArmorItem() {
        return this._PNXItem.isArmor();
    }

    /**
     * @return {boolean} 物品是否为方块
     */
    get isBlock() {
        return this._PNXItem instanceof ItemBlock;
    }

    /**
     * @return {boolean} 物品是否可被破坏
     */
    get isDamageableItem() {
        return !this._PNXItem.isUnbreakable();
    }

    /**
     * @return {boolean} 物品耐久是否被消耗
     */
    get isDamaged() {
        if (this._PNXItem.isTool() || this._PNXItem.isArmor()) return this.damage > 0;
        else return false;
    }

    /**
     * @return {boolean} 物品是否已被附魔
     */
    get isEnchanted() {
        return this._PNXItem.hasEnchantments();
    }

    /**
     * @return {boolean} 物品是否为附魔书
     */
    get isEnchantingBook() {
        return this._PNXItem instanceof ItemBookEnchanted;
    }

    /**
     * @return {boolean} 物品是否防火
     */
    get isFireResistant() {
        return this._PNXItem.isLavaResistant();
    }

    /**
     * @return {boolean} 物品是否已堆叠到最大堆叠数
     */
    get isFullStack() {
        return this.count === this._PNXItem.getMaxStackSize();
    }

    /**
     * @return {boolean} 物品是否闪烁(是否发光？？？)
     */
    get isGlint() {
        if (this.isBlock) return this._PNXItem.getBlock().getLightLevel() > 0;
        else return false;
    }

    /**
     * @return {boolean} 物品是否为马铠
     */
    get isHorseArmorItem() {
        if (this._PNXItem instanceof ItemHorseArmorLeather || this._PNXItem instanceof ItemHorseArmorDiamond
            || this._PNXItem instanceof ItemHorseArmorGold || this._PNXItem instanceof ItemHorseArmorIron) return true;
        else return false;
    }

    /**
     * todo 弄懂这是啥然后写
     * @return {boolean} Whether the item is liquid clip
     */
    get isLiquidClipItem() {

    }

    /**
     * @return {boolean} 物品是否为唱片
     */
    get isMusicDiscItem() {
        return this._PNXItem instanceof ItemRecord;
    }

    /**
     * @return {boolean} 物品是否可设置到副手
     */
    get isOffhandItem() {
        if (this._PNXItem.isTool() || this._PNXItem.isArmor()) return true;
        else switch (this.type) {
            case "minecraft:arrow":
                return true;
            case "minecraft:firework_rocket":
                return true;
            case "minecraft:totem_of_undying":
                return true;
            case "minecraft:empty_map":
                return true;
            case "minecraft:filled_map":
                return true;
            case "minecraft:nautilus_shell":
                return true;
            default:
                return false;
        }
    }

    /**
     * @return {boolean} 物品是否为药水
     */
    get isPotionItem() {
        return this._PNXItem instanceof ItemPotion || this._PNXItem instanceof ItemPotionSplash || this._PNXItem instanceof ItemPotionLingering;
    }

    /**
     * @return {boolean} 物品是否可堆叠
     */
    get isStackable() {
        return this._PNXItem.getMaxStackSize() > 1;
    }

    /**
     * todo 和isArmorItem方法相比有什么区别
     * @return {boolean} 物品是否可穿戴
     */
    get isWearableItem() {
        return this._PNXItem.isArmor();
    }

    /**
     * 判断物品对象是否为空
     * @returns {boolean} 这个物品对象是否为空
     */
    isNull() {
        return this._PNXItem.isNull();
    }

    /**
     * 将此物品对象置为空（删除物品）
     * @returns {boolean} 是否删除成功
     */
    setNull() {
        this._PNXItem.setCount(-1);
        return true;
    }

    /**
     * 将此物品对象设置为另一个物品
     * @param item {Item}
     * @returns {boolean}
     */
    set(item) {
        let succ;
        if (item instanceof Item) {
            this._PNXItem = item.item;
            succ = true;
        } else if (item instanceof PNXItem) {
            this._PNXItem = item;
            succ = true;
        } else {
            succ = false;
        }
        return succ;
    }

    /**
     * 设置物品耐久度
     * @param damage {Number}
     * @returns {Boolean} 是否设置成功
     */
    setDamage(damage) {
        if (this._PNXItem.isTool() || this._PNXItem.isArmor()) {
            let k = this.maxDamage - damage;
            if (k >= 0) {
                this._PNXItem.setDamage(k);
                return true;
            } else return false;
        } else return false;
    }

    /**
     * 设置物品的附加值
     * @param aux {number} 物品的附加值
     * @returns {boolean} 是否设置成功
     */
    setAux(aux) {
        this._PNXItem.setDamage(aux);
        return true;
    }

    /**
     * 获取物品对应的 NBT 对象
     * @todo 改为LLSE类型，目前为snbt
     * @returns {NbtCompound}
     */
    getNbt() {
        const nbtcomp = this._PNXItem.getNamedTag();
        return nbtcomp.toSnbt().substr(3);// toSnbt返回例子 "": {object: {}}
    }

    /**
     * 写入物品对应的 NBT 对象
     * @todo 未实现
     * @param nbt {NbtCompound} NBT 对象
     * @returns {boolean}
     */
    setNbt(nbt) {
        // more code...
        return false;
    }

    /**
     * 设置自定义 Lore
     * @param names {string[]} 要设置的 Lore 字符串的数组
     * @returns {boolean} 是否设置成功
     */
    setLore(names) {
        this._PNXItem.setLore(names);
        return true;
    }

    /**
     * 根据物品对象生成掉落物实体
     * @todo 应该返回Entity LLSE类型
     * @param item {Item}
     * @param pos {IntPos|FloatPos}
     * @returns {Entity|null}
     */
    spawnItem(item, pos) {
        /*
        args1: item,pos
        args2: item,x,y,z,dimid
        */
        let position, thisitem;
        if (arguments.length === 5) {
            const level = server.getLevel(arguments[4]);
            position = Position.fromObject(new Vector3(arguments[1], arguments[2], arguments[3]), level);
        } else if (arguments.length === 2) {
            if (pos instanceof Position) {
                position = pos;
            } else {
                position = pos.position;
            }
        } else {
            throw 'Wrong number of parameters.';
        }
        if (item instanceof PNXItem) {
            thisitem = item;
        } else if (item instanceof Item) {
            thisitem = item._PNXItem;
        }
        if (thisitem.getId() !== 0 && thisitem.getCount() > 0) {
            let itemEntity = new EntityItem(
                position.getLevel().getChunk(position.getX() >> 4, position.getZ() >> 4, true),
                PNXEntity.getDefaultNBT(position, new Vector3(0, 0, 0), new Random().nextFloat() * 360, 0)
                    .putShort("Health", 5)
                    .putCompound("Item", NBTIO.putItemHelper(thisitem))
                    .putShort("PickupDelay", 10));
            if (itemEntity != null) {
                itemEntity.spawnToAll();
                return new Entity(itemEntity);
            } else return null;
        }
        return null;
    }

    /**
     * 设置自定义物品名称
     * @param name {string} 新物品名称
     * @returns {Boolean} 设置物品名称是否成功
     */
    setDisplayName(name) {
        let result = this._PNXItem.setCustomName(name);
        if (result.getCustomName() === name) {
            return true;
        } else return false;
    }

    /**
     * 克隆物品对象
     * @todo 未测试
     * @returns {Item|Null} 如返回值为 Null 则表示生成失败
     */
    clone() {
        return new Item(this._PNXItem.clone(), this._PNXItem.count);
    }

    toString() {
        return JSON.stringify({name: this.name, id: this.id, count: this.count, aux: this.aux, type: this.type});
    }
}
