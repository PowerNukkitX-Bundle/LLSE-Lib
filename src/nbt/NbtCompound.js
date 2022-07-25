import {CompoundTag} from "cn.nukkit.nbt.tag.CompoundTag";
import {NBTIO} from "cn.nukkit.nbt.NBTIO";
import {ByteOrder} from "java.nio.ByteOrder";

export class NbtCompound {
    constructor(obj) {
        if (obj instanceof CompoundTag) {
            this._nbt = obj;
            return this;
        }
        this._nbt = new CompoundTag('');
        for (let key in obj) {
            this._nbt.put(key, obj[key]._nbt);
        }
    }

    /**
     * 获取所有的键
     * @param snbt {string} 要解析的 SNBT 字符串
     * @returns {cn.nukkit.nbt.tag.CompoundTag} 生成的 NBT 对象
     */
    getKeys() {
        return this._nbt.getTags().keySet();
    }

    getTypeOf(key) {
        //
    }

    /**
     * 设置键对应的 NBT 对象
     * @param key {string} 要操作的键名
     * @param tag {string} 要操作的键名
     * @returns {NbtCompound} 处理完毕的 NBT 对象
     */
    setTag(key, tag) {
        if (this._nbt.exist(key)) {
            this._nbt.remove(key);
        }
        this._nbt.put(key, tag._nbt);
    }

    /**
     * 读取键对应的 NBT 对象
     * @param key {string} 要操作的键名
     * @returns {cn.nukkit.nbt.tag} 生成的 NBT 对象
     * @todo 将返回修改为LLSE类型
     */
    getTag(key) {
        return this._nbt.get(key);
    }

    /**
     * 读取键对应的 NBT 对象
     * @param key {string} 要操作的键名。键名必须已经存在
     * @returns {NbtCompound} 处理完毕的 NBT 对象
     */
    removeTag(key) {
        this._nbt.remove(key);
        return this;
    }

    /**
     * 读取键对应的 NBT 对象
     * @param key {string} 要操作的键名
     * @returns {cn.nukkit.nbt.tag} 生成的 NBT 对象
     * @todo 将返回修改为LLSE类型
     */
    getData(key) {
        return this._nbt.getTag(key);
    }

    /**
     * 将 NBT 标签对象 序列化为 SNBT
     * @param space {number} 空格数量。如果要格式化输出的字符串，则传入此参数。
     * @returns {string} 对应的 SNBT 字符串
     */
    toSNBT() {
        return this._nbt.toSnbt().substr(3);
    }

    /**
     * 将 NBT 标签对象 转换为 Object
     * @returns {object} 对应的对象/表
     */
    toObject() {
        return JSON.parse(this._nbt.toSnbt().replaceAll('_bit":0b', '_bit":false').replaceAll('_bit":1b', '_bit":true'));
    }

    /**
     * 将 NBT 标签对象 序列化为二进制 NBT
     * @returns {Int8Array}
     */
    toBinaryNBT() {
        return new Int8Array(NBTIO.write(this._nbt, ByteOrder.LITTLE_ENDIAN, false));
    }

    toString() {
        return this.toSNBT().replaceAll('_bit":0b', '_bit":false').replaceAll('_bit":1b', '_bit":true');
    }
}
