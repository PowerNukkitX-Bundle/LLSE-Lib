import {Byte} from "java.lang.Byte";
import {ByteTag} from "cn.nukkit.nbt.tag.ByteTag";

export class NbtByte extends CommonNbt {
    constructor(data) {
        super();
        if (this._evaluate(data)) {
            this._pnxNbt = new ByteTag("", data);
        }
    }

    set(data) {
        if (this._evaluate(data)) {
            this._pnxNbt.setData(data);
        }
    }

    _evaluate(data) {
        if (this._isInteger(data)) {
            if (Byte.MIN_VALUE <= data.toString().length <= Byte.MAX_VALUE) {
                return true;
            } else throw RangeError("参数数值范围超出byte范围!")
        } else throw new SyntaxError("参数类型错误!");
    }
}