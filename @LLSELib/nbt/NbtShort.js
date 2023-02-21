import { CommonNbt } from "./CommonNbt.js";
import { ShortTag } from "cn.nukkit.nbt.tag.ShortTag";
import { Short } from "java.lang.Short";
import { NbtTypeEnum } from "./NbtTypeEnum.js"

export class NbtShort extends CommonNbt {
    constructor(data) {
        super();
        if (data instanceof ShortTag) {
            this._pnxNbt = data;
        } else if (this._evaluate(data)) {
            this._pnxNbt = new ShortTag("", data);
        }
    }

    set(data) {
        if (this._evaluate(data)) {
            this._pnxNbt.setData(data);
            return true;
        }
        return false;
    }

    getType() {
        return NbtTypeEnum.Short;
    }

    _evaluate(data) {
        return this._isInteger(data) && Short.MIN_VALUE <= data <= Short.MAX_VALUE;
    }
}