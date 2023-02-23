import { Item } from '../object/Item.js';
import { Item as PNXItem } from 'cn.nukkit.item.Item';

/**
 * @todo 测试
 */
export class Container {
    /**
     * 生产新的 Item 方法对象
     * @returns {Container} Container 容器对象
     */
    constructor(inv) {
        this._PNXInv = inv;
    }

    /**
     * 大小
     * @returns {number}
     */
    get size() {
        return this._PNXInv.getSize();
    }

    /**
     * 类型
     * @returns {string}
     */
    get type() {
        return this._PNXInv.getType().getDefaultTitle();
    }

    /**
     * 放入物品对象到容器中
     * @param {Item} item 待放入的物品对象
     * @returns {boolean}
     */
    addItem(item) {
        if (item instanceof Item) {
            if (this.hasRoomFor(item._PNXItem)) {
                this._PNXInv.addItem(item._PNXItem);
                return true;
            }
        } else if (item instanceof PNXItem) {
            if (this.hasRoomFor(item)) {
                this._PNXInv.addItem(item);
                return true;
            }
        }
        return false;
    }

    /**
     * 放入物品对象到容器的第一个空格子
     * @param {Item} item 待增加的物品对象
     * @returns {boolean}
     */
    addItemToFirstEmptySlot(item) {
        let index = this._PNXInv.firstEmpty();
        return this.setItem(index, item);
    }

    /**
     * 检查容器中是否（有空间）可以放入此物品
     * @param {Item} item 待放入的物品对象
     * @returns {boolean}
     */
    hasRoomFor(item) {
        if (item instanceof Item) {
            return this._PNXInv.canAddItem(item._PNXItem);
        } else if (item instanceof PNXItem) {
            return this._PNXInv.canAddItem(item);
        }
        return false;
    }

    /**
     * 减少容器中的某个物品对象
     * @param {number} index 减少的物品对象所在的格子序号
     * @param {Number} count 减少的数量。如果大于等于此格子物品堆叠的数量，则物品堆将被整个清除
     * @returns {boolean}
     */
    removeItem(index, count) {
        if (index < 0 || index >= this.size) {
            return false;
        }
        let item = this._PNXInv.getItem(index);
        if (item.getCount() > 0) {
            item.count -= count;
            this._PNXInv.setItem(index, item);
        }
        return true;
    }

    /**
     * 获取容器某个格子的物品对象
     * @param {number} index 格子序号
     * @returns {Item}
     */
    getItem(index) {
        if (index < 0 || index >= this.size) {
            return false;
        }
        return this._PNXInv.getItem(index);
    }

    /**
     * 设置容器某个格子的物品对象
     * @param {number} index 待设置的格子序号
     * @param {Item} item 物品对象
     * @returns {boolean}
     */
    setItem(index, item) {
        if (index < 0 || index >= this.size) {
            return false;
        }
        if (item instanceof Item) {
            this._PNXInv.setItem(index, item._PNXItem);
        } else if (item instanceof PNXItem) {
            this._PNXInv.setItem(index, item);
        } else {
            return false;
        }
        return true;
    }

    /**
     * 获取容器所有格子的物品对象列表
     *
     * @returns {Array<Item>} 容器中所有的物品对象
     */
    getAllItems() {
        let slots = [];
        for (const item of this._PNXInv.getContents().values()) {
            slots.push(new Item(item));
        }
        return slots;
    }

    /**
     * 清空容器
     *
     * @returns {boolean}
     */
    removeAllItems() {
        this._PNXInv.clearAll();
        return this.isEmpty();
    }

    /**
     * 判断容器是否为空
     * @returns {boolean}
     */
    isEmpty() {
        return this._PNXInv.isEmpty();
    }
}