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
import { NbtCompound } from '../nbt/NbtCompound.js'

export class Item {
    /**
     * 生产新的 Item 方法对象
     * @param name {PNXItem|String}
     * @param count {Number}
     * @returns {Item} 物品对象 如返回值为 Null 则表示生成失败
     */
    constructor(name, count = null) {
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
     * @return {Number} 物品攻击伤害
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
        return this._PNXItem instanceof ItemHorseArmorLeather || this._PNXItem instanceof ItemHorseArmorDiamond
            || this._PNXItem instanceof ItemHorseArmorGold || this._PNXItem instanceof ItemHorseArmorIron;
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
        return this._PNXItem.getDamage() === aux;
    }

    /**
     * 获取物品对应的 NBT 对象
     * @returns {NbtCompound}
     */
    getNbt() {
        return new NbtCompound(this._PNXItem.getNamedTag());
    }

    /**
     * 写入物品对应的 NBT 对象
     * @param nbt {NbtCompound} NBT 对象
     * @returns {boolean}
     */
    setNbt(nbt) {
        const result = this._PNXItem.setNamedTag(nbt._pnxNbt);
        return result.getNamedTag().equals(nbt._pnxNbt);
    }

    /**
     * 设置自定义 Lore
     * @param names {string[]} 要设置的 Lore 字符串的数组
     * @returns {boolean} 是否设置成功
     */
    setLore(names) {
        const result = this._PNXItem.setLore(names);
        return !!result.getLore().equals(names);
    }

    /**
     * 设置自定义物品名称
     * @param name {string} 新物品名称
     * @returns {Boolean} 设置物品名称是否成功
     */
    setDisplayName(name) {
        let result = this._PNXItem.setCustomName(name);
        return result.getCustomName() === name;
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
        return JSON.stringify({
            name: this.name,
            type: this.type,
            id: this.id,
            count: this.count,
            aux: this.aux,
            damage: this.damage,
            attackDamage: this.attackDamage,
            maxDamage: this.maxDamage
        });
    }
}
