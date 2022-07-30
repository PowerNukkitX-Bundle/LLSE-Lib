import { StringTag } from "cn.nukkit.nbt.tag.StringTag";

export class NbtString extends CommonNbt {
    constructor(data) {
        super();
        if (this._evaluate(data)) {
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

    _evaluate(data) {
        if (typeof this === "string") {
            return true;
        } else throw new SyntaxError("参数类型错误!");
    }
}