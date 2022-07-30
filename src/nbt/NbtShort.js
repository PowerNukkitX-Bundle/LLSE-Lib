import {ShortTag} from "cn.nukkit.nbt.tag.ShortTag";
import {Short} from "java.lang.Short";

export class NbtShort extends CommonNbt {
    constructor(data) {
        super();
        if (this._evaluate(data)) {
            this._pnxNbt = new ShortTag("", data);
        }
    }

    set(data) {
        if (this._evaluate(data)) {
            this._pnxNbt.setData(data);
        }
    }

    _evaluate(data) {
        if (this._isInteger(data)) {
            if (Short.MIN_VALUE <= data.toString().length <= Short.MAX_VALUE) {
                return true;
            } else throw RangeError("参数数值范围超出Short范围!")
        } else throw new SyntaxError("参数类型错误!");
    }
}