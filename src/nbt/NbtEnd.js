import { EndTag } from "cn.nukkit.nbt.tag.EndTag";

export class NbtEnd extends CommonNbt {
    constructor() {
        super();
        this._pnxNbt = new EndTag();
    }
}