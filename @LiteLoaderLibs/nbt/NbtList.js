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
import { ArrayList } from 'java.util.ArrayList'
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
import { isEmpty, isNull } from '../utils/underscore-esm-min.js'


export class NbtList {
    /**
     * @param array {ListTag | Array | null}
     */
    constructor(array) {
        if (isEmpty(array)) {
            this._pnxNbt = new ListTag("");
            this._nbt = [];
        } else if (array instanceof ListTag) {
            this._pnxNbt = array;
            this._nbt = [];
            let type = array.getAll()[0];
            if (type instanceof ByteTag) {
                for (let tag of array.getAll()) {
                    this._nbt.push(new NbtByte(tag));
                }
            } else if (type instanceof ByteArrayTag) {
                for (let tag of array.getAll()) {
                    this._nbt.push(new NbtByteArray(tag));
                }
            } else if (type instanceof DoubleTag) {
                for (let tag of array.getAll()) {
                    this._nbt.push(new NbtDouble(tag));
                }
            } else if (type instanceof FloatTag) {
                for (let tag of array.getAll()) {
                    this._nbt.push(new NbtFloat(tag));
                }
            } else if (type instanceof CompoundTag) {
                for (let tag of array.getAll()) {
                    this._nbt.push(new NbtCompound(tag));
                }
            } else if (type instanceof ListTag) {
                for (let tag of array.getAll()) {
                    this._nbt.push(new NbtList(tag));
                }
            } else if (type instanceof EndTag) {
                for (let tag of array.getAll()) {
                    this._nbt.push(new NbtEnd());
                }
            } else if (type instanceof IntTag) {
                for (let tag of array.getAll()) {
                    this._nbt.push(new NbtInt(tag));
                }
            } else if (type instanceof LongTag) {
                for (let tag of array.getAll()) {
                    this._nbt.push(new NbtLong(tag));
                }
            } else if (type instanceof ShortTag) {
                for (let tag of array.getAll()) {
                    this._nbt.push(new NbtShort(tag));
                }
            } else if (type instanceof StringTag) {
                for (let tag of array.getAll()) {
                    this._nbt.push(new NbtString(tag));
                }
            } else throw new TypeError("解析PNX NBT tag类型错误!");
        } else {
            let type = array[0].getType();
            for (let j = 1, len = array.length; j < len; j++) {
                if (array[j].getType() !== type) throw new TypeError("数值中NBT元素类型不一致!");
            }
            this._pnxNbt = new ListTag('');
            this._nbt = array;
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
        if (!this._evaluate(index)) {
            throw new RangeError("索引溢出");
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
        if (!this._evaluate(index)) {
            throw new RangeError("索引溢出");
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
     * @return {Array} 对应的数组/列表
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
     * 将NBT对象转换为Json字符串
     * @param space （可选参数）如果要格式化输出的字符串，则传入此参数。代表每个缩进的空格数量，这样生成的字符串更适合人阅读。此参数默认为-1，即不对输出字符串进行格式化
     * @return {String} 对应的Json字符串
     */
    toString(space = -1) {
        if (space === -1) {
            return JSON.stringify(this._preToObject());
        } else {
            return JSON.stringify(this._preToObject(), null, space);
        }
    }

    _preToObject() {
        let tag = this.getTag(0);
        if (tag.getType() === 10) {
            return this._nbt.map(k => k._preToObject());
        } else if (tag.getType() === 9) {
            return this._nbt.map(k => k._preToObject());
        } else if (tag.getType() === 7) {
            return this._nbt.map(k => {
                let str = "";
                let int2array = k.get();
                for (let j = 0, len = int2array.length; j < len; j++) {
                    str += int2array[j];
                }
                return data.toBase64(str);
            });
        } else return this._nbt.map(k => k.get());
    }

    _evaluate(index, tag) {
        if (index) {
            if (index < 0 || index > this.getSize()) {
                return false;
            }
        }
        if (tag) {
            if (tag.getType() !== this._nbt[0].getType()) {
                return false;
            }
        }
        return true;
    }
}
