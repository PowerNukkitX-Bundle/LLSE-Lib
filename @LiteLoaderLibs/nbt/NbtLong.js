import { CommonNbt } from "./CommonNbt.js";
import { LongTag } from "cn.nukkit.nbt.tag.LongTag";
import { Long } from "java.lang.Long";
import { NbtTypeEnum } from "./NbtTypeEnum.js"

export class NbtLong extends CommonNbt {
    constructor(data) {
        super();
        if (data instanceof LongTag) {
            this._pnxNbt = data;
        } else if (this._evaluate(data)) {
            this._pnxNbt = new LongTag("", data);
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
        return NbtTypeEnum.Long;
    }

    _evaluate(data) {
        return this._isInteger(data) && Long.MIN_VALUE <= data <= Long.MAX_VALUE;
    }
}