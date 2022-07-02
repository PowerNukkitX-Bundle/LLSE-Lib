 import { ListTag } from "cn.nukkit.nbt.tag.ListTag";

export class NbtCompound {
	constructor (obj) {
		this._nbt = new ListTag('');
		for (let value of obj) {
			this._nbt.add(value);
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
	 * @param snbt {string} 要解析的 SNBT 字符串
	 * 
	 * @returns {cn.nukkit.nbt.tag.CompoundTag} 生成的 NBT 对象
	 */
	setTag(key,tag) {
		//
	}
	/**
	 * 读取键对应的 NBT 对象
	 * @param snbt {string} 要解析的 SNBT 字符串
	 * @returns {cn.nukkit.nbt.tag.CompoundTag} 生成的 NBT 对象
	 */
	getTag(key) {
		//
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