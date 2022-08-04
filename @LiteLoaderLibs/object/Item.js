import { Item as PNXItem } from 'cn.nukkit.item.Item';
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
        this._reference = null;// [entity, type: [hand, offhand], slot: number]
    }

    /**
     * 生成新的物品对象
     * @todo 未完善
     * @param name {String} 物品的标准类型名，如 minecraft:bread
     * @param count {Number} 物品堆叠数量
     * @returns {Item|null}
     */
    static newItem(name, count) {
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

    _changeItem() {
        if (!this._reference || !this._reference[0].isOnline()) {
            return;
        }
        switch (this._reference[1]) {
            case 'hand': {
                this._reference[0].getInventory().setItem(this._reference[2], this._PNXItem);
                break;
            }
            case 'offhand': {
                this._reference[0].getOffhandInventory().setItem(this._reference[2], this._PNXItem, true);
                break;
            }
            default:
                return false;
        }
        return true;
    }

    get id() {
        return this._PNXItem.getId();
    }

    get name() {
        return this._PNXItem.getName();
    }

    set name(name) {
        this._PNXItem.setCustomName(name);
        this._changeItem();
    }

    get count() {
        return this._PNXItem.getCount();
    }

    set count(num) {
        this._PNXItem.setCount(num);
        this._changeItem();
    }

    get aux() {
        return this._PNXItem.getDamage();
    }

    set aux(aux) {
        this.setAux(aux);
        this._changeItem();
    }

    get type() {
        return this._PNXItem.getNamespaceId();
    }

    /**
     * 设置物品的附加值
     * @param aux {number} 物品的附加值
     * @returns {boolean}
     */
    setAux(aux) {
        this._PNXItem.setDamage(aux);
        this._changeItem();
        return true;
    }

    /**
     * 设置自定义 Lore
     * @param names {Array<String,String,...>} 要设置的 Lore 字符串的数组
     * @returns {boolean}
     */
    setLore(names) {
        this._PNXItem.setLore(names);
        this._changeItem();
        return true;
    }

    /**
     * 判断物品对象是否为空
     * @returns {boolean}
     */
    isNull() {
        return this._PNXItem.isNull();
    }

    /**
     * 将此物品对象置为空（删除物品）
     * @returns {boolean}
     */
    setNull() {
        this._PNXItem.setCount(-1);
        this._changeItem();
        return true;
    }

    /**
     * 克隆物品对象
     * @todo 未测试
     * @returns {Item}
     */
    clone() {
        return new Item(this._PNXItem.clone(), null);
    }

    /**
     * 将此物品对象设置为另一个物品
     * @param item {Item}
     * @returns {boolean}
     */
    set(item) {
        let succ = false;
        if (item instanceof Item) {
            this._PNXItem = item.item;
            succ = true;
        } else if (item instanceof PNXItem) {
            this._PNXItem = item;
            succ = true;
        } else {
            succ = false;
        }
        if (succ) {
            this._changeItem();
        }
        return succ;
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
        this._changeItem();
        return false;
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

    toString() {
        return JSON.stringify({name: this.name, id: this.id, count: this.count, aux: this.aux, type: this.type});
    }
}
