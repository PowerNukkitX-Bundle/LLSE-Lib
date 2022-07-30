import {CommonNbt} from "./CommonNbt";
import {Double} from "java.lang.Double";
import {DoubleTag} from "cn.nukkit.nbt.tag.DoubleTag";
import {FloatTag} from "cn.nukkit.nbt.tag.FloatTag";
import {Float} from "java.lang.Float";

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
        }
    }

    _evaluate(data) {
        if (this._isFloating(data)) {
            if (Double.MIN_VALUE <= data.toString().length <= Double.MAX_VALUE) {
                return true;
            } else throw RangeError("参数数值范围超出double范围!")
        } else throw new SyntaxError("参数类型错误!");
    }
}