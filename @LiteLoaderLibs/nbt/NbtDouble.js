import { CommonNbt } from "./CommonNbt.js";
import { Double } from "java.lang.Double";
import { DoubleTag } from "cn.nukkit.nbt.tag.DoubleTag";
import { NbtTypeEnum } from "./NbtTypeEnum.js"

export class NbtDouble extends CommonNbt {
    constructor(data) {
        super();
        if (data instanceof DoubleTag) {
            this._pnxNbt = data;
        } else if (this._evaluate(data)) {
            this._pnxNbt = new DoubleTag("", data);
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
        return NbtTypeEnum.Double;
    }

    _evaluate(data) {
        return Double.MIN_VALUE <= data <= Double.MAX_VALUE;
    }
}