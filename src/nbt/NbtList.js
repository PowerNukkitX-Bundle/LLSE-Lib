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
import { ListTag } from "cn.nukkit.nbt.tag.ListTag";
import { ArrayList } from 'java.util.ArrayList'
import { Byte } from 'java.lang.Byte'

export class NbtList {
    constructor(array) {
        let type = array[0].getType();
        for (let j = 0, len = array.length; j < len; j++) {
            if (array[j].getType() !== type) return throw new SyntaxError("参数类型错误!");
        }
        this._pnxNbt = new ListTag('');
        this._nbt = array;
        for (let tag of array) {
            this._pnxNbt.add(tag._pnxNbt);
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
     * @return {Enum} 此下标处储存的NBT的数据类型
     */
    getTypeOf(index) {
        return this._nbt[index].getType();
    }

    /**
     * 设置某个下标位置的NBT对象
     * @param index {Integer} 要操作的目标下标
     * @param tag {CommonNbt} 要写入的 NBT 对象
     * @returns {NbtList} 写入完毕的NBT列表（便于连锁进行其他操作）
     */
    setTag(index, tag) {
        if (this._evaluate(index, tag)) {
            this._nbt[index] = tag;
            let tags = new ArrayList();
            for (let j of this._nbt) {
                tags.add(j._pnxNbt);
            }
            this._pnxNbt.setAll(tags);
            return this;
        }
    }

    /**
     * 读取某个下标位置的NBT对象
     * @param index {Integer} 要操作的目标下标
     * @returns {any} 下标位置的NBT对象
     */
    getTag(index) {
        if (index < 0 || index > this.getSize()) {
            return throw new SyntaxError("参数类型错误!");
        }
        return this._nbt[index];
    }

    /**
     * 往列表末尾追加一个NBT对象
     * @param tag {any} NBT对象
     * @returns {NbtList} 追加完毕的NBT列表（便于连锁进行其他操作）
     */
    addTag(tag) {
        this._nbt.push(tag);
        this._pnxNbt.add(tag._pnxNbt);
        return this;
    }

    /**
     * 删除某个下标位置的NBT对象
     * @param index {Integer} 要删除的目标下标,下标不能超出有效下标的最大值
     * @returns {NbtList} 处理完毕的NBT列表（便于连锁进行其他操作）
     */
    removeTag(index) {
        if (index < 0 || index > this.getSize()) {
            return throw new SyntaxError("参数类型错误!");
        }
        this._pnxNbt.remove(index);
        this._nbt.splice(index, 1);
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
     * @return {Array} 对应的数组 / 列表
     */
    toArray() {
        let tag = this.getTag(0);
        if (tag.getType() === 9) {
            return this._nbt.map(k => k.toArray());
        } else if (tag.getType() === 10) {
            return this._nbt.map(k => k.toObject());
        } else {
            return this._nbt.map(k => k.get());
        }
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

    _evaluate(index, tag) {
        if (tag.getType() !== this._nbt.getType()) {
            throw new SyntaxError("参数类型错误!");
        }
        if (index < 0 || index > this.getSize()) {
            throw new RangeError("索引长度溢出");
        }
        return true;
    }
}