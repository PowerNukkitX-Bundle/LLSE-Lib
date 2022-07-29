import {Container} from "./Container.js";
import {Item} from "../object/Item.js";

/**
 * @todo 测试
 */
export class EntityArmorContainer extends Container {
    constructor(EntityInventory) {
        super(EntityInventory);
    }

    get size() {
        return 4;
    }

    _setArmor(item) {
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

    addItem(item) {
        return this._setArmor(item);
    }

    addItemToFirstEmptySlot(item) {
        if (this.hasRoomFor(item)) {
            return this._setArmor(item);
        }
        return false;
    }

    hasRoomFor(item) {
        if (item._PNXItem.isHelmet()) {
            return this._PNXInv.getHelmet().isNull();
        } else if (item._PNXItem.isChestplate()) {
            return this._PNXInv.getChestplate().isNull();
        } else if (item._PNXItem.isLeggings()) {
            return this._PNXInv.getLeggings().isNull();
        } else if (item._PNXItem.isBoots()) {
            return this._PNXInv.getBoots().isNull();
        }
        return false;
    }

    removeItem(item, count) {
        let checkDamage = item._PNXItem.hasMeta();
        let checkTag = item._PNXItem.getCompoundTag() != null;
        let pnxInv = this._PNXInv;
        if (item._PNXItem.isHelmet()) {
            if (item._PNXItem.equals(pnxInv.getHelmet(), checkDamage, checkTag)) {
                pnxInv.clear(0);
                return true;
            }
            return false;
        } else if (item._PNXItem.isChestplate()) {
            if (item._PNXItem.equals(pnxInv.getChestplate(), checkDamage, checkTag)) {
                pnxInv.clear(1);
                return true;
            }
            return false;
        } else if (item._PNXItem.isLeggings()) {
            if (item._PNXItem.equals(pnxInv.getLeggings(), checkDamage, checkTag)) {
                pnxInv.clear(2);
                return true;
            }
            return false;
        } else if (item._PNXItem.isBoots()) {
            if (item._PNXItem.equals(pnxInv.getBoots(), checkDamage, checkTag)) {
                pnxInv.clear(3);
                return true;
            }
            return false;
        }
        return false;
    }

    getItem(index) {
        if (index < 0 || index > 3) throw '实体盔甲栏的索引超出范围(0-3)';
        switch (index) {
            case 0:
                return new Item(this._PNXInv.getHelmet(), null);
            case 1:
                return new Item(this._PNXInv.getChestplate(), null);
            case 2:
                return new Item(this._PNXInv.getLeggings(), null);
            case 3:
                return new Item(this._PNXInv.getBoots(), null);
        }
        return null;
    }

    setItem(index, item) {
        if (index < 0 || index > 3) throw '实体盔甲栏的索引超出范围(0-3)';
        return this._PNXInv.setItem(index, item._PNXItem);
    }

    getAllItems() {
        let allItems = [];
        allItems.push(new Item(this._PNXInv.getHelmet(), null));
        allItems.push(new Item(this._PNXInv.getChestplate(), null));
        allItems.push(new Item(this._PNXInv.getLeggings(), null));
        allItems.push(new Item(this._PNXInv.getBoots(), null));
        return allItems;
    }
}