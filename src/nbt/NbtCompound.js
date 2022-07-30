import { CompoundTag } from "cn.nukkit.nbt.tag.CompoundTag";
import { NBTIO } from "cn.nukkit.nbt.NBTIO";
import { ByteOrder } from "java.nio.ByteOrder";
import { NbtTypeEnum } from "./NbtTypeEnum.js"
import { NbtByte } from './NbtByte.js'
import { NbtByteArray } from './NbtByteArray.js'
import { NbtDouble } from './NbtDouble.js'
import { NbtEnd } from './NbtEnd.js'
import { NbtFloat } from './NbtFloat.js'
import { NbtInt } from './NbtInt.js'
import { NbtList } from './NbtList.js'
import { NbtString } from './NbtString.js'
import { NbtShort } from './NbtShort.js'
import { NbtLong } from './NbtLong.js'

export class NbtCompound {
    constructor(obj) {
        if (obj instanceof CompoundTag) {
            this._pnxNbt = obj;
            return this;
        } else if (this._evaluate(obj)) {
            this._pnxNbt = new CompoundTag("");//PNX的CompoundTag
            this._nbt = obj;//js的对象存储着llse版本的NbtTag
            for (let key in obj) {
                this._pnxNbt.put(key, obj[key]._pnxNbt);
            }
        } else return null;
    }

    getType() {
        return NbtTypeEnum.Compound;
    }

    /**
     * 获取所有的键
     * @returns {Array} 生成的 NBT 对象
     */
    getKeys() {
        return this._pnxNbt.getTags().keySet().toArray();
    }

    /**
     * 获取键对应的值的数据类型
     * @param key {String} 要查询的键名
     * @return {Number} 对应的值的数据类型
     */
    getTypeOf(key) {
        if (key in this._nbt) {
            return this._nbt[key].getType();
        } else return null;
    }

    /**
     * 设置键对应的 NBT 对象
     * @param key {string} 要操作的键名
     * @param tag {any} NBT对象
     * @returns {NbtCompound} 处理完毕的 NBT 对象
     */
    setTag(key, tag) {
        this._pnxNbt.put(key, tag._pnxNbt);
        this._nbt[key] = tag;
        return this;
    }

    /**
     * 读取键对应的 NBT 对象
     * @param key {string} 要操作的键名
     * @returns {any} 生成的 NBT 对象
     */
    getTag(key) {
        if (key in this._nbt) {
            return this._nbt[key];
        } else return null;
    }

    /**
     * 删除键对应的 NBT对象
     * @param key {string} 要操作的键名。键名必须已经存在
     * @returns {NbtCompound} 处理完毕的 NBT 对象
     */
    removeTag(key) {
        if (key in this._nbt) {
            this._pnxNbt.remove(key);
            delete this._nbt[key];
            return this;
        } else return null;
    }

    /**
     * 读取键对应的 NBT 对象
     * @param key {string} 要操作的键名
     * @returns {cn.nukkit.nbt.tag} 生成的 NBT 对象
     * @todo 将返回修改为LLSE类型
     */
    getData(key) {
        let tag = this.getData(key);
        if (tag.getType() === 9 || tag.getType() === 10) {
            return tag;
        } else return tag.get();
    }

    /**
     * 将 NBT 标签对象 序列化为 SNBT
     * @param space {number} 空格数量。如果要格式化输出的字符串，则传入此参数。
     * @returns {string} 对应的 SNBT 字符串
     */
    toSNBT(space = -1) {
        if (space === -1) {
            return this._pnxNbt.toSnbt();
        } else return this._pnxNbt.toSnbt(space);
    }

    /**
     * 将 NBT 标签对象 转换为 Object
     * @returns {object} 对应的对象/表
     */
    toObject() {
        return JSON.parse(this._pnxNbt.toSnbt().replaceAll('_bit":0b', '_bit":false').replaceAll('_bit":1b', '_bit":true'));
    }

    /**
     * 将 NBT 标签对象 序列化为二进制 NBT
     * @returns {Int8Array}
     */
    toBinaryNBT() {
        return new Int8Array(NBTIO.write(this._pnxNbt, ByteOrder.LITTLE_ENDIAN, false));
    }

    toString() {
        return this.toSNBT().replaceAll('_bit":0b', '_bit":false').replaceAll('_bit":1b', '_bit":true');
    }

    destroy() {
    }

    setEnd(key) {
        return this.setTag(key, new NbtEnd());
    }

    setByte(key, data) {
        return this.setTag(key, new NbtByte(data));
    }

    setShort(key, data) {
        return this.setTag(key, new NbtShort(data));
    }

    setInt(key, data) {
        return this.setTag(key, new NbtInt(data));
    }

    setLong(key, data) {
        return this.setTag(key, new NbtLong(data));
    }

    setFloat(key, data) {
        return this.setTag(key, new NbtFloat(data));
    }

    setDouble(key, data) {
        return this.setTag(key, new NbtDouble(data));
    }

    setByteBuffer(key, data) {
        return this.setTag(key, new NbtByteArray(data));
    }

    setString(key, data) {
        return this.setTag(key, new NbtString(data));
    }

    _evaluate(obj) {
        let result = true;
        for (let tag of Object.values(obj)) {
            if (!(tag instanceof NbtByte || tag instanceof NbtByteArray || tag instanceof NbtDouble
                || tag instanceof NbtCompound || tag instanceof NbtEnd || tag instanceof NbtFloat
                || tag instanceof NbtInt || tag instanceof NbtList || tag instanceof NbtLong || tag instanceof NbtString || tag instanceof NbtShort)) {
                result = false
            }
        }
        if (result === false) throw new SyntaxError("解析对象失败");
        return result;
    }
}
