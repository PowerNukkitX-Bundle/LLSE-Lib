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
        if (Double.MIN_VALUE <= data <= Double.MAX_VALUE) {
            return true;
        } else throw RangeError("参数数值范围超出double范围!");
    }
}