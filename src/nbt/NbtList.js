import { ListTag } from "cn.nukkit.nbt.tag.ListTag";
import { NbtTypeEnum } from "./NbtTypeEnum.js"
import { Byte } from 'java.lang.Byte'
import { CommonNbt } from './CommonNbt.js'
import { ArrayList } from 'java.util.ArrayList'

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
        if (index < 0 || index > this.getSize() || tag.getType() !== this._nbt.getType()) {
            return throw new SyntaxError("参数类型错误!");
        }
        this._nbt[index] = tag;
        let tags = new ArrayList();
        for (let j of this._nbt) {
            tags.add(j._pnxNbt);
        }
        this._pnxNbt.setAll(tags);
        return this;
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

    /**
     * 获取NBT对象储存的数据类型
     * @return {Enum} 此NBT对象储存的数据类型
     */
    getType() {
        return NbtTypeEnum.List;
    }

    /**
     * 从 SNBT 字符串生成 NBT 标签对象
     * @param snbt {string} 要解析的 SNBT 字符串
     * @returns {cn.nukkit.nbt.tag.CompoundTag} 生成的 NBT 对象
     */
    toSNBT() {
        //
    }
}