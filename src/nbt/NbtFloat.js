import { FloatTag } from "cn.nukkit.nbt.tag.FloatTag";
import { Float } from "java.lang.Float";

export class NbtFloat extends CommonNbt {
    constructor(data) {
        super();
        if (this._evaluate(data)) {
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

    _evaluate(data) {
        if (this._isFloating(data)) {
            if (Float.MIN_VALUE <= data.toString().length <= Float.MAX_VALUE) {
                return true;
            } else throw RangeError("参数数值范围超出float范围!")
        } else throw new SyntaxError("参数类型错误!");
    }
}