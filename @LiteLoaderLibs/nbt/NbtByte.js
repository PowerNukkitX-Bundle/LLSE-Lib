import { CommonNbt } from "./CommonNbt.js";
import { Byte } from "java.lang.Byte";
import { ByteTag } from "cn.nukkit.nbt.tag.ByteTag";
import { NbtTypeEnum } from "./NbtTypeEnum.js"

export class NbtByte extends CommonNbt {
    constructor(data) {
        super();
        if (data instanceof ByteTag) {
            this._pnxNbt = data;
        } else if (this._evaluate(data)) {
            this._pnxNbt = new ByteTag("", data);
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
        return NbtTypeEnum.Byte;
    }

    _evaluate(data) {
        if (this._isInteger(data)) {
            if (Byte.MIN_VALUE <= data <= Byte.MAX_VALUE) {
                return true;
            } else throw RangeError("参数数值范围超出byte范围!")
        } else throw new SyntaxError("参数类型错误!");
    }

    toString(space = -1) {
        let result;
        if (this.get() === 1) {
            result = true;
        } else if (this.get() === 0) {
            result = false;
        } else result = this.get();
        if (space === -1) {
            return JSON.stringify(result);
        } else return JSON.stringify(result, null, space);
    }
}