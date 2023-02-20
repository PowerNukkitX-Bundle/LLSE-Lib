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
import { data } from '../utils/data.js'
import { isEmpty } from "../utils/underscore-esm-min.js";
import { ByteTag } from 'cn.nukkit.nbt.tag.ByteTag'
import { ByteArrayTag } from 'cn.nukkit.nbt.tag.ByteArrayTag'
import { DoubleTag } from 'cn.nukkit.nbt.tag.DoubleTag'
import { FloatTag } from 'cn.nukkit.nbt.tag.FloatTag'
import { EndTag } from 'cn.nukkit.nbt.tag.EndTag'
import { IntTag } from 'cn.nukkit.nbt.tag.IntTag'
import { LongTag } from 'cn.nukkit.nbt.tag.LongTag'
import { ShortTag } from 'cn.nukkit.nbt.tag.ShortTag'
import { StringTag } from 'cn.nukkit.nbt.tag.StringTag'
import { ListTag } from 'cn.nukkit.nbt.tag.ListTag'
import { CompoundTag } from "cn.nukkit.nbt.tag.CompoundTag";
import { NBTIO } from "cn.nukkit.nbt.NBTIO";
import { ByteOrder } from "java.nio.ByteOrder";

export class NbtCompound {
    /**
     * @param obj {CompoundTag | Object | null}
     */
    constructor(obj) {
        if (isEmpty(obj)) {
            this._pnxNbt = new CompoundTag("");
        } else if (obj instanceof CompoundTag) {
            this._pnxNbt = obj.clone();
        } else if (this._evaluate(obj)) {
            this._pnxNbt = new CompoundTag("");//PNX的CompoundTag
            for (let key in obj) {
                this._pnxNbt.put(key, obj[key]._pnxNbt);
            }
        } else throw new TypeError("参数类型错误!");
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
        return this._convertTagType(this._pnxNbt.get(key)).getType();
    }

    /**
     * 设置键对应的 NBT 对象
     * @param key {string} 要操作的键名
     * @param tag {CommonNbt} NBT对象
     * @returns {NbtCompound} 处理完毕的 NBT 对象
     */
    setTag(key, tag) {
        this._pnxNbt.put(key, tag._pnxNbt);
        return this;
    }

    /**
     * 读取键对应的 NBT 对象
     * @param key {string} 要操作的键名
     * @returns {CommonNbt} 生成的 NBT 对象
     */
    getTag(key) {
        return this._convertTagType(this._pnxNbt.get(key));
    }

    /**
     * 删除键对应的 NBT对象
     * @param key {string} 要操作的键名。键名必须已经存在
     * @returns {NbtCompound} 处理完毕的 NBT 对象
     */
    removeTag(key) {
        this._pnxNbt.remove(key);
        return this;
    }

    /**
     * 读取键对应的值的具体数据<p>
     * 如果目标位置储存的是List类型 NBT，将返回一个NbtList对象；如果目标位置储存的是Compound类型 NBT，将返回一个NbtCompound对象<p>
     * 如果要读取的NBT不存在，将返回Null
     * @param key {string} 要操作的键名
     * @returns {any} 键对应的值的具体数据
     */
    getData(key) {
        if (!this._pnxNbt.contains(key)) {
            return null;
        }
        const result = this._convertTagType(this._pnxNbt.get(key));
        if (result.getType() === 9 || result.getType() === 10) {
            return result;
        } else return result.get();
    }

    /**
     * 将 NBT 标签对象 序列化为 SNBT
     * @param space {number} 空格数量。如果要格式化输出的字符串，则传入此参数(默认-1不格式化)。
     * @returns {String} 对应的 SNBT 字符串
     */
    toSNBT(space = -1) {
        var snbt;
        if (space === -1) {
            snbt = this._pnxNbt.toSNBT();
        } else snbt = this._pnxNbt.toSNBT(space);
        return snbt;
    }

    /**
     * 将 NBT 标签对象 转换为 Object
     * @returns {object} 对应的对象/表
     */
    toObject() {
        let obj = {};
        for (let key of this.getKeys()) {
            let tag = this._convertTagType(this._pnxNbt.get(key));
            if (tag.getType() === 10) {//Compound
                obj[key] = tag.toObject();
            } else if (tag.getType() === 9) {//List
                obj[key] = tag.toArray();
            } else if (tag.getType() === 8) {//String
                obj[key] = String(tag.get());
            } else if (tag.getType() === 7) {//ByteArray
                obj[key] = tag.get();
            } else if (tag.getType() === 1) {//Byte
                let result = tag.get();
                if (result === 1) {
                    result = true;
                } else if (result === 0) {
                    result = false;
                }
                obj[key] = result;
            } else if (tag.getType() === 0) {//End
                obj[key] = null;
            } else {
                obj[key] = Number(tag.get());
            }
        }
        return obj;
    }

    /**
     * 将 NBT 标签对象 序列化为二进制 NBT
     * @returns {Int8Array}
     */
    toBinaryNBT() {
        return new Int8Array(NBTIO.write(this._pnxNbt, ByteOrder.LITTLE_ENDIAN, false));
    }

    toString(space = -1) {
        if (space === -1) {
            return JSON.stringify(this._preToObject());
        } else {
            return JSON.stringify(this._preToObject(), null, space);
        }
    }

    _preToObject() {
        let obj = {};
        for (let key of this.getKeys()) {
            let tag = this._convertTagType(this._pnxNbt.get(key));
            if (tag.getType() === 10) {
                obj[key] = tag._preToObject();
            } else if (tag.getType() === 9) {
                obj[key] = tag._preToArray();
            } else if (tag.getType() === 7) {
                let str = "";
                let int2array = tag.get();
                for (let j = 0, len = int2array.length; j < len; j++) {
                    str += int2array[j];
                }
                obj[key] = data.toBase64(str);
            } else obj[key] = tag.get();
        }
        return obj;
    }

    destroy() {
        if (!this._pnxNbt instanceof CompoundTag) return false;
        this._pnxNbt = null;
        delete this;
        return true;
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

    setByteArray(key, data) {
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
        return result;
    }

    /**
     * 将PNX的NBT转换为LLSE的NBT类型
     * @returns {CommonNbt | NbtCompound | NbtList} LLSE的NBT
     */
    _convertTagType(tag) {
        if (tag instanceof ByteTag) {
            return new NbtByte(tag);
        } else if (tag instanceof ByteArrayTag) {
            return new NbtByteArray(tag);
        } else if (tag instanceof DoubleTag) {
            return new NbtDouble(tag);
        } else if (tag instanceof FloatTag) {
            return new NbtFloat(tag);
        } else if (tag instanceof CompoundTag) {
            return new NbtCompound(tag);
        } else if (tag instanceof ListTag) {
            return new NbtList(tag);
        } else if (tag instanceof EndTag) {
            return new NbtEnd(tag);
        } else if (tag instanceof IntTag) {
            return new NbtInt(tag);
        } else if (tag instanceof LongTag) {
            return new NbtLong(tag);
        } else if (tag instanceof ShortTag) {
            return new NbtShort(tag);
        } else if (tag instanceof StringTag) {
            return new NbtString(tag);
        } else return null;
    }
}
