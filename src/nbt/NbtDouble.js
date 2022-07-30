import { CommonNbt } from "./CommonNbt.js";
import { Double } from "java.lang.Double";
import { DoubleTag } from "cn.nukkit.nbt.tag.DoubleTag";
import { NbtTypeEnum } from "./NbtTypeEnum.js"
export class NbtDouble extends CommonNbt {
    constructor(data) {
        super();
        if (this._evaluate(data)) {
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

    _evaluate(data) {
        if (this._isFloating(data)) {
            if (Double.MIN_VALUE <= data.toString().length <= Double.MAX_VALUE) {
                return true;
            } else throw RangeError("参数数值范围超出double范围!")
        } else throw new SyntaxError("参数类型错误!");
    }
}