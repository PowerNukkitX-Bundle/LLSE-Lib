import { CommonNbt } from "./CommonNbt.js";
import { Byte } from "java.lang.Byte";
import { ByteTag } from "cn.nukkit.nbt.tag.ByteTag";
import { NbtTypeEnum } from "./NbtTypeEnum.js"

const ByteArray = Java.type("byte[]");

export class NbtByteArray extends CommonNbt {
    /**
     * @param data {Array} 字节数组
     */
    constructor(data) {
        super();
        if (this._evaluate(data)) {
            let byteArray = new ByteArray(data.length);
            for (let j = 0, len = data.length; j < len; j++) {
                byteArray[j] = data[j];
            }
            this._pnxNbt = new ByteTag("", byteArray);
        }
    }

    get() {
        let result = new Array(this._pnxNbt.data.length);
        for (let j = 0, len = this._pnxNbt.data.length; j < len; j++) {
            result[j] = this._pnxNbt.data[j];
        }
        return result;
    }

    getType() {
        return NbtTypeEnum.ByteArray;
    }

    set(data) {
        if (this._evaluate(data)) {
            let byteArray = new ByteArray(data.length);
            for (let j = 0, len = data.length; j < len; j++) {
                byteArray[j] = data[j];
            }
            this._pnxNbt.data = byteArray;
            return true;
        }
        return false;
    }

    _evaluate(data) {
        if (data instanceof Array) {
            let suc = true;
            data.forEach(elem => {
                if (Byte.MIN_VALUE > elem.toString().length || elem.toString().length > Byte.MAX_VALUE) {
                    suc = false;
                }
            });
            if (suc) {
                return true;
            } else throw SyntaxError("数组内必须全为byte!");
        } else throw new SyntaxError("参数类型错误!");
    }
}