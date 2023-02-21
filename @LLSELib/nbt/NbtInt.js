import { CommonNbt } from "./CommonNbt.js";
import { Integer } from "java.lang.Integer";
import { IntTag } from "cn.nukkit.nbt.tag.IntTag";
import { NbtTypeEnum } from "./NbtTypeEnum.js"

export class NbtInt extends CommonNbt {
    constructor(data) {
        super();
        if (data instanceof IntTag) {
            this._pnxNbt = data;
        } else if (this._evaluate(data)) {
            this._pnxNbt = new IntTag("", data);
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
        return NbtTypeEnum.Int;
    }

    _evaluate(data) {
        return this._isInteger(data) && Integer.MIN_VALUE <= data <= Integer.MAX_VALUE;
    }
}