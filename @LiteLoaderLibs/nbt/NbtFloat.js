import { CommonNbt } from "./CommonNbt.js";
import { FloatTag } from "cn.nukkit.nbt.tag.FloatTag";
import { Float } from "java.lang.Float";
import { NbtTypeEnum } from "./NbtTypeEnum.js"

export class NbtFloat extends CommonNbt {
    constructor(data) {
        super();
        if (data instanceof FloatTag) {
            this._pnxNbt = data;
        } else if (this._evaluate(data)) {
            this._pnxNbt = new FloatTag("", data);
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
        return NbtTypeEnum.Float;
    }

    _evaluate(data) {
        return Float.MIN_VALUE <= data <= Float.MAX_VALUE;
    }
}