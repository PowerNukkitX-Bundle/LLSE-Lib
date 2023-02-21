import { Container } from "./Container.js";
import { Item } from "../object/Item.js";

/**
 * @todo 测试
 */
export class PlayerArmorContainer extends Container {
    constructor(PlayerInventory) {
        super(PlayerInventory);
    }

    get size() {
        return 4;
    }

    addItem(item) {
        if (item._PNXItem.isHelmet()) {
            return this._PNXInv.setHelmet(item);
        } else if (item._PNXItem.isChestplate()) {
            return this._PNXInv.setChestplate();
        } else if (item._PNXItem.isLeggings()) {
            return this._PNXInv.setLeggings();
        } else if (item._PNXItem.isBoots()) {
            return this._PNXInv.setBoots();
        }
        return false;
    }

    addItemToFirstEmptySlot(item) {
        let index;
        for (let i = this._PNXInv.getSize(), len = 4; i < len; ++i) {
            if (this._PNXInv.getItem(i).getId() === 0) {
                index = i;
                break;
            }
        }
        return this.setItem(index, item);
    }

    hasRoomFor(item) {
        let item2 = item.clone();
        let checkDamage = item2._PNXItem.hasMeta();
        let checkTag = item2._PNXItem.getCompoundTag() != null;
        for (let i = 0, len = 4; i < len; ++i) {
            let slot = this._PNXInv.getItem(this._PNXInv.getSize() + i);
            if (item2._PNXItem.equals(slot, checkDamage, checkTag)) {
                let diff;
                if ((diff = Math.min(slot.getMaxStackSize(), this._PNXInv.getMaxStackSize()) - slot.getCount()) > 0) {
                    item2._PNXItem.setCount(item2._PNXItem.getCount() - diff);
                }
            } else if (slot.getId() === 0) {
                item2._PNXItem.setCount(item2._PNXItem.getCount() - Math.min(slot.getMaxStackSize(), this._PNXInv.getMaxStackSize()));
            }

            if (item2._PNXItem.getCount() <= 0) {
                return true;
            }
        }
        return false;
    }

    removeItem(index, count) {
        if (index < 0 || index > 3) return null;
        let item = this._PNXInv.getItem(this._PNXInv.getSize() + index);
        if (item.getCount() > 0) {
            item.count -= count;
            this._PNXInv.setItem(this._PNXInv.getSize() + index, item);
        }
        return true;
    }

    getItem(index) {
        if (index < 0 || index > 3) return null;
        switch (index) {
            case 0:
                return new Item(this._PNXInv.getHelmet());
            case 1:
                return new Item(this._PNXInv.getChestplate());
            case 2:
                return new Item(this._PNXInv.getLeggings());
            case 3:
                return new Item(this._PNXInv.getBoots());
        }
        return null;
    }

    setItem(index, item) {
        if (index < 0 || index > 3) return null;
        return this._PNXInv.setItem(this._PNXInv.getSize() + index, item._PNXItem);
    }

    getAllItems() {
        let allItems = [];
        for (let item of this._PNXInv.getArmorContents()) {
            allItems.push(new Item(item));
        }
        return allItems;
    }

    removeAllItems() {
        let c1 = this._PNXInv.clear(this._PNXInv.getSize());
        let c2 = this._PNXInv.clear(this._PNXInv.getSize() + 1);
        let c3 = this._PNXInv.clear(this._PNXInv.getSize() + 2);
        let c4 = this._PNXInv.clear(this._PNXInv.getSize() + 3);
        return c1 && c2 && c3 && c4;
    }

    isEmpty() {
        let c1 = this._PNXInv.getHelmet().isNull();
        let c2 = this._PNXInv.getChestplate().isNull();
        let c3 = this._PNXInv.getLeggings().isNull();
        let c4 = this._PNXInv.getBoots().isNull();
        return c1 && c2 && c3 && c4;
    }
}