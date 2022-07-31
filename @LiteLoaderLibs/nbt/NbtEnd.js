import { CommonNbt } from "./CommonNbt.js";
import { EndTag } from "cn.nukkit.nbt.tag.EndTag";
import { NbtTypeEnum } from "./NbtTypeEnum.js"

export class NbtEnd extends CommonNbt {
    constructor() {
        super();
        this._pnxNbt = new EndTag();
    }

    getType() {
        return NbtTypeEnum.End;
    }

    get() {
        return null;
    }

    toString(space = -1) {
    }
}