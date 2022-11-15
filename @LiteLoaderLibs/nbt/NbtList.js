import { NbtTypeEnum } from "./NbtTypeEnum.js"
import { CommonNbt } from './CommonNbt.js'
import { NbtEnd } from './NbtEnd.js'
import { NbtByte } from './NbtByte.js'
import { NbtShort } from './NbtShort.js'
import { NbtInt } from './NbtInt.js'
import { NbtLong } from './NbtLong.js'
import { NbtFloat } from './NbtFloat.js'
import { NbtDouble } from './NbtDouble.js'
import { NbtByteArray } from './NbtByteArray.js'
import { NbtString } from './NbtString.js'
import { data } from '../utils/data.js'
import { ListTag } from "cn.nukkit.nbt.tag.ListTag";
import { ByteTag } from 'cn.nukkit.nbt.tag.ByteTag'
import { ByteArrayTag } from 'cn.nukkit.nbt.tag.ByteArrayTag'
import { DoubleTag } from 'cn.nukkit.nbt.tag.DoubleTag'
import { FloatTag } from 'cn.nukkit.nbt.tag.FloatTag'
import { CompoundTag } from 'cn.nukkit.nbt.tag.CompoundTag'
import { EndTag } from 'cn.nukkit.nbt.tag.EndTag'
import { IntTag } from 'cn.nukkit.nbt.tag.IntTag'
import { LongTag } from 'cn.nukkit.nbt.tag.LongTag'
import { ShortTag } from 'cn.nukkit.nbt.tag.ShortTag'
import { StringTag } from 'cn.nukkit.nbt.tag.StringTag'
import { NbtCompound } from './NbtCompound.js'
import { isEmpty, isNumber } from '../utils/underscore-esm-min.js'


export class NbtList {
    /**
     * @param array {ListTag | Array | null}
     */
    constructor(array) {
        if (isEmpty(array)) {
            this._pnxNbt = new ListTag("");
        } else if (array instanceof ListTag) {
            this._pnxNbt = array;
        } else {
            let type = array[0].getType();
            for (let j = 1, len = array.length; j < len; j++) {
                if (array[j].getType() !== type) throw new TypeError("数值中NBT元素类型不一致!");
            }
            this._pnxNbt = new ListTag('');
            for (let tag of array) {
                this._pnxNbt.add(tag._pnxNbt);
            }
        }
    }

    /**
     * 获取列表长度
     * @return {Integer} 此列表的长度
     */
    getSize() {
        return this._pnxNbt.size();
    }

    /**
     * 获取NBT对象储存的数据类型
     * @return {Number} 此NBT对象储存的数据类型
     */
    getType() {
        return NbtTypeEnum.List;
    }

    /**
     * 获取某个下标位置储存的数据类型
     * @param index {Integer} 要查询的目标下标
     * @return {Number} 此下标处储存的NBT的数据类型
     */
    getTypeOf(index) {
        return this._convertTagType(this._pnxNbt.get(index)).getType();
    }

    /**
     * 设置某个下标位置的NBT对象
     * @param index {Integer} 要操作的目标下标
     * @param tag {CommonNbt} 要写入的 NBT 对象
     * @returns {NbtList} 写入完毕的NBT列表（便于连锁进行其他操作）
     */
    setTag(index, tag) {
        if (!this._evaluate(index, tag)) return this;
        this._pnxNbt.add(index, tag._pnxNbt);
        return this;
    }

    /**
     * 读取某个下标位置的NBT对象
     * @param index {Integer} 要操作的目标下标
     * @returns {CommonNbt} 下标位置的NBT对象
     */
    getTag(index) {
        if (!this._evaluate(index)) return null;
        return this._convertTagType(this._pnxNbt.get(index));
    }

    /**
     * 往列表末尾追加一个NBT对象
     * @param tag {any} NBT对象
     * @returns {NbtList} 追加完毕的NBT列表（便于连锁进行其他操作）
     */
    addTag(tag) {
        this._pnxNbt.add(tag._pnxNbt);
        return this;
    }

    /**
     * 删除某个下标位置的NBT对象
     * @param index {Integer} 要删除的目标下标,下标不能超出有效下标的最大值
     * @returns {NbtList} 处理完毕的NBT列表（便于连锁进行其他操作）
     */
    removeTag(index) {
        if (!this._evaluate(index)) return this;
        this._pnxNbt.remove(index);
        return this;
    }

    setEnd(index) {
        return this.setTag(index, new NbtEnd());
    }

    setByte(index, data) {
        return this.setTag(index, new NbtByte(data));
    }

    setShort(index, data) {
        return this.setTag(index, new NbtShort(data));
    }

    setInt(index, data) {
        return this.setTag(index, new NbtInt(data));
    }

    setLong(index, data) {
        return this.setTag(index, new NbtLong(data));
    }

    setFloat(index, data) {
        return this.setTag(index, new NbtFloat(data));
    }

    setDouble(index, data) {
        return this.setTag(index, new NbtDouble(data));
    }

    setByteBuffer(index, data) {
        return this.setTag(index, new NbtByteArray(data));
    }

    setString(index, data) {
        return this.setTag(index, new NbtString(data));
    }

    /**
     * 读取某个下标位置的具体数据
     * @param index {Integer} 要操作的目标下标
     * @return {any} 指定位置储存的具体数据
     */
    getData(index) {
        let tag = this.getTag(index);
        if (tag.getType() === 9 || tag.getType() === 10) {
            return tag;
        } else return tag.get();
    }

    /**
     * 将List类型转换为Array
     * @return {Array} 对应的数组/列表
     */
    toArray() {
        const result = [];
        let tag = this.getTag(0);
        if (isEmpty(tag)) {
            return [];
        } else if (tag.getType() === 9) {
            for (let nbt of this._pnxNbt.getAll()) result.push(new NbtList(nbt).toArray());
            return result;
        } else if (tag.getType() === 10) {
            for (let nbt of this._pnxNbt.getAll()) result.push(new NbtCompound(nbt).toObject());
            return result;
        } else {
            for (let nbt of this._pnxNbt.getAll()) result.push(this._convertTagType(nbt).get());
            return result;
        }
    }

    /**
     * 将NBT对象转换为Json字符串
     * @param space （可选参数）如果要格式化输出的字符串，则传入此参数。代表每个缩进的空格数量，这样生成的字符串更适合人阅读。此参数默认为-1，即不对输出字符串进行格式化
     * @return {String} 对应的Json字符串
     */
    toString(space = -1) {
        if (space === -1) {
            return JSON.stringify(this._preToArray());
        } else {
            return JSON.stringify(this._preToArray(), null, space);
        }
    }

    _preToArray() {
        const result = [];
        let tag = this.getTag(0);
        if (!tag) {
            return {};
        } else if (tag.getType() === 10) {
            for (let nbt of this._pnxNbt.getAll()) result.push(this._convertTagType(nbt)._preToObject());
            return result;
        } else if (tag.getType() === 9) {
            for (let nbt of this._pnxNbt.getAll()) result.push(this._convertTagType(nbt)._preToArray());
            return result;
        } else if (tag.getType() === 7) {
            for (let nbt of this._pnxNbt.getAll()) {
                let str = "";
                let int2array = nbt.get();
                for (let j = 0, len = int2array.length; j < len; j++) {
                    str += int2array[j];
                }
                result.push(data.toBase64(str));
            }
            return result;
        } else {
            for (let nbt of this._pnxNbt.getAll()) result.push(this._convertTagType(nbt).get());
            return result;
        }
    }

    _evaluate(index, tag = null) {
        if (isNumber(index) && !isEmpty(tag)) {
            return (index > 0 || index < this.getSize()) && (tag.getType() === this._convertTagType(this._pnxNbt[0]).getType());
        }
        if (isNumber(index)) {
            return index > 0 || index < this.getSize();
        }
        if (!isEmpty(tag)) {
            return tag.getType() === this._convertTagType(this._pnxNbt[0]).getType();
        }
        return false;
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
