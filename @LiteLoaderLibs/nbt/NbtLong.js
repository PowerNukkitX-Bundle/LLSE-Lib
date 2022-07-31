import { CommonNbt } from "./CommonNbt.js";
import { LongTag } from "cn.nukkit.nbt.tag.LongTag";
import { Long } from "java.lang.Long";
import { NbtTypeEnum } from "./NbtTypeEnum.js"

export class NbtLong extends CommonNbt {
    constructor(data) {
        super();
        if (this._evaluate(data)) {
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
        if (this._isInteger(data)) {
            if (Long.MIN_VALUE <= data <= Long.MAX_VALUE) {
                return true;
            } else throw RangeError("参数数值范围超出Short范围!")
        } else throw new SyntaxError("参数类型错误!");
    }
}