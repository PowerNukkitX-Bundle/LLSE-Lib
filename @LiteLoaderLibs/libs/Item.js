import { Item as JItem } from 'cn.nukkit.item.Item';
import { EnumLevel } from 'cn.nukkit.level.EnumLevel';
import { Position } from 'cn.nukkit.level.Position';
import { Vector3 } from 'cn.nukkit.math.Vector3';

export class Item {
	/**
	* 生产新的 Item 方法对象
	* @returns {Item} 物品对象 如返回值为 Null 则表示生成失败
	*/
	constructor(name, count) {
		this._PNXItem = name instanceof JItem ? name : JItem.fromString(name);
		if (count) {
			this._PNXItem.setCount(count);
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
		switch(this._reference[1]) {
		    case 'hand': {
				this._reference[0].getInventory().setItem(this._reference[2], this._PNXItem);
				break;
		    }
		    case 'offhand': {
				this._reference[0].getOffhandInventory().setItem(this._reference[2], this._PNXItem);
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
		return Item.newItem(this._PNXItem.clone());
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
		} else if (item instanceof JItem) {
			this._PNXItem = item;
			succ = true;
		} else {
			succ = false;
		}
		if (succ) {
			_changeItem();
		}
		return succ;
	}
	/**
	 * 获取物品对应的 NBT 对象
	 * @todo 改为LLSE类型
	 * @returns {NbtCompound} 
	 */
	getNbt() {
		return this._PNXItem.getNamedTag();
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
		var arg1, arg2;
		if (arguments.length === 5) {
			arg1 = Position.fromObject(new Vector3(arguments[1], arguments[2], arguments[3]), Number(getLevels()[arguments[4]]));
		} else if (arguments.length === 2) {
			if (pos instanceof Position) {
				arg1 = pos;
			} else {
				arg1 = pos._PNXPos;
			}
		} else {
			throw 'Wrong number of parameters.';
		}
		if (item instanceof JItem) {
			arg2 = item;
		} else if (item instanceof Item) {
			arg2 = item._PNXItem;
		}
		arg1.getLevel().dropItem(arg1, arg2, new Vector3(0, 0, 0));
		return true;
	}
	toString() {
		return JSON.stringify({name: this.name, id: this.id, count: this.count, aux: this.aux, type: this.type});
	}
}
export function getLevels() {
	return [
		EnumLevel.OVERWORLD.getLevel().getName(),
		EnumLevel.NETHER.getLevel().getName(),
		EnumLevel.THE_END.getLevel().getName()
	];
}
