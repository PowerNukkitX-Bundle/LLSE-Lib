import {Container} from "./Container.js";
import {Item} from "../object/Item.js";

/**
 * @todo 测试
 */
class PlayerArmorContainer extends Container {
    constructor(PlayerInventory) {
        super(PlayerInventory);
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
        return this._setArmor(item);
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
                pnxInv.clear(pnxInv.getSize());
                return true;
            }
            return false;
        } else if (item._PNXItem.isChestplate()) {
            if (item._PNXItem.equals(pnxInv.getChestplate(), checkDamage, checkTag)) {
                pnxInv.clear(pnxInv.getSize() + 1);
                return true;
            }
            return false;
        } else if (item._PNXItem.isLeggings()) {
            if (item._PNXItem.equals(pnxInv.getLeggings(), checkDamage, checkTag)) {
                pnxInv.clear(pnxInv.getSize() + 2);
                return true;
            }
            return false;
        } else if (item._PNXItem.isBoots()) {
            if (item._PNXItem.equals(pnxInv.getBoots(), checkDamage, checkTag)) {
                pnxInv.clear(pnxInv.getSize() + 3);
                return true;
            }
            return false;
        }
        return false;
    }

    getItem(index) {
        if (index < 0 || index > 3) throw '玩家盔甲栏的索引超出范围(0-3)';
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
        if (index < 0 || index > 3) throw '玩家盔甲栏的索引超出范围(0-3)';
        return this._PNXInv.setItem(this._PNXInv.getSize() + index, item._PNXItem);
    }

    getAllItems() {
        let allItems = [];
        for (let item of this._PNXInv.getArmorContents()) {
            allItems.push(new Item(item, null));
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