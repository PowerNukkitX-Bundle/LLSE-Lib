import { CommonNbt } from "./CommonNbt.js";
import { StringTag } from "cn.nukkit.nbt.tag.StringTag";
import { NbtTypeEnum } from "./NbtTypeEnum.js"

export class NbtString extends CommonNbt {
    constructor(data) {
        super();
        if (data instanceof StringTag) {
            this._pnxNbt = data;
        } else if (this._evaluate(data)) {
            this._pnxNbt = new StringTag("", data);
        }
    }

    set(data) {
        if (this._evaluate(data)) {
            this._pnxNbt.data = data;
            return true;
        }
        return false;
    }

    get() {
        return this._pnxNbt.data;
    }

    getType() {
        return NbtTypeEnum.String;
    }

    _evaluate(data) {
        return typeof data === "string";
    }
}