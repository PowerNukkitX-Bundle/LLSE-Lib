import {Float} from "java.lang.Float";
import {FloatTag} from "cn.nukkit.nbt.tag.FloatTag";
import {Double} from "java.lang.Double";
import {DoubleTag} from "cn.nukkit.nbt.tag.DoubleTag";
import {CommonNbt} from "./CommonNbt";
import {EndTag} from "cn.nukkit.nbt.tag.EndTag";

export class NbtEnd extends CommonNbt {
    constructor() {
        super();
        this._pnxNbt = new EndTag();
    }
}