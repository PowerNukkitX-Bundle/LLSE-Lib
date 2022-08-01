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
import { data } from '../utils/data.js'
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

export class NbtCompound {
    constructor(obj) {
        if (obj instanceof CompoundTag) {
            this._pnxNbt = obj;
            this._nbt = {};
            for (let key of obj.getTags().keySet().toArray()) {
                let tag = obj.get(key);
                if (tag instanceof ByteTag) {
                    this._nbt[key] = new NbtByte(tag);
                } else if (tag instanceof ByteArrayTag) {
                    this._nbt[key] = new NbtByteArray(tag);
                } else if (tag instanceof DoubleTag) {
                    this._nbt[key] = new NbtDouble(tag);
                } else if (tag instanceof FloatTag) {
                    this._nbt[key] = new NbtFloat(tag);
                } else if (tag instanceof CompoundTag) {
                    this._nbt[key] = new NbtCompound(tag);
                } else if (tag instanceof ListTag) {
                    this._nbt[key] = new NbtList(tag);
                } else if (tag instanceof EndTag) {
                    this._nbt[key] = new NbtEnd(tag);
                } else if (tag instanceof IntTag) {
                    this._nbt[key] = new NbtInt(tag);
                } else if (tag instanceof LongTag) {
                    this._nbt[key] = new NbtLong(tag);
                } else if (tag instanceof ShortTag) {
                    this._nbt[key] = new NbtShort(tag);
                } else if (tag instanceof StringTag) {
                    this._nbt[key] = new NbtString(tag);
                } else throw new SyntaxError("参数类型错误!");
            }
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
        let obj = {};
        for (let key of Object.keys(this._nbt)) {
            if (this._nbt[key].getType() === 10) {
                obj[key] = this._nbt[key].toObject();
            } else if (this._nbt[key].getType() === 9) {
                obj[key] = this._nbt[key].toArray();
            } else {
                obj[key] = this._nbt[key].get();
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
        for (let key of Object.keys(this._nbt)) {
            let tag = this._nbt[key];
            if (tag.getType() === 10) {
                obj[key] = tag._preToObject();
            } else if (tag.getType() === 9) {
                obj[key] = tag._preToObject();
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
