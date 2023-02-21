import { CommonNbt } from "./CommonNbt.js";
import { NbtTypeEnum } from "./NbtTypeEnum.js"
import { Byte } from "java.lang.Byte";
import { ByteArrayTag } from 'cn.nukkit.nbt.tag.ByteArrayTag'
import { data } from '../utils/data.js'

const ByteArray = Java.type("byte[]");

export class NbtByteArray extends CommonNbt {
    /**
     * @param data {Int8Array | Int16Array | any} 字节数组
     */
    constructor(data) {
        super();
        if (data instanceof ByteArrayTag) {
            this._pnxNbt = data;
        } else if (this._evaluate(data)) {
            let byteArray = new ByteArray(data.length);
            for (let j = 0, len = data.length; j < len; j++) {
                byteArray[j] = data[j];
            }
            this._pnxNbt = new ByteArrayTag("", byteArray);
        }
    }

    get() {
        let buffer = new ArrayBuffer(this._pnxNbt.data.length);
        let result = new Int8Array(buffer);
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

    toString(space = -1) {
        let str = "";
        let int2array = this.get();
        for (let j = 0, len = int2array.length; j < len; j++) {
            str += int2array[j];
        }
        let result = data.toBase64(str);
        if (space === -1) return JSON.stringify(result);
        else return JSON.stringify(result, null, space);
    }

    _evaluate(data) {
        if (data instanceof Int8Array || data instanceof Int16Array) {
            var suc = true;
            data.forEach(elem => {
                if (Byte.MIN_VALUE > elem || elem > Byte.MAX_VALUE) {
                    suc = false;
                }
            });
        }
        return suc;
    }
}