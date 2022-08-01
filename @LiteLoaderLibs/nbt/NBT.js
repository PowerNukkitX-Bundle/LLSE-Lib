import { NbtCompound } from "./NbtCompound.js";
import { ByteOrder } from "java.nio.ByteOrder";
import { Integer } from 'java.lang.Integer';
import { Long } from 'java.lang.Long';
import { Float } from 'java.lang.Float';
import { Double } from 'java.lang.Double';
import { NBTIO } from "cn.nukkit.nbt.NBTIO";
import { ByteTag } from "cn.nukkit.nbt.tag.ByteTag";
import { CompoundTag } from "cn.nukkit.nbt.tag.CompoundTag";
import { DoubleTag } from "cn.nukkit.nbt.tag.DoubleTag";
import { FloatTag } from "cn.nukkit.nbt.tag.FloatTag";
import { IntTag } from "cn.nukkit.nbt.tag.IntTag";
import { ListTag } from "cn.nukkit.nbt.tag.ListTag";
import { LongTag } from "cn.nukkit.nbt.tag.LongTag";
import { StringTag } from "cn.nukkit.nbt.tag.StringTag";

const ByteArray = Java.type("byte[]");

export class NBT {
    /**
     * 从 SNBT 字符串生成 NBT 标签对象
     * @param snbt {string} 要解析的 SNBT 字符串
     * @returns {cn.nukkit.nbt.tag.CompoundTag} 生成的 NBT 对象
     */
    static parseSNBT(snbt) {
        let root = JSON.parse(snbt.replaceAll('_bit":0b', '_bit":false').replaceAll('_bit":1b', '_bit":true'));
        const results = new CompoundTag('');// 最后生成的 Compound 对象
        let loopState = true;// 循环状态

        let currIndex = [0, 0];// 当前层的下标，当前层数
        let layerKeys = [Object.keys(root)];// 层索引的Keys
        let layerIndex = [0];// 层索引
        let lens = layerKeys[0];// 获取对象或数组的keys, lens.length获取当前的长度
        let tempres = JSON.parse(JSON.stringify(root));// 临时存储 当前对象
        let temptag = results;
        while (loopState) {
            if (currIndex[0] + 1 > lens.length) {// 当前层遍历完成时 回退
                tempres = JSON.parse(JSON.stringify(root));
                temptag = results;
                currIndex[1]--;
                lens = layerKeys[currIndex[1]];
                currIndex[0] = layerIndex[currIndex[1]];// 访问过的index

                if (currIndex[1] < 0) {// 结束，当最后一个不是 array|object 时
                    //currIndex: [undefined, -1]
                    break;
                }
                if (currIndex[1] === 0 && currIndex[0] + 1 > lens.length) {// 结束
                    //currIndex: [maxIndex, 0]
                    break;
                }

                if (currIndex[1] > 0) {// 当前层大于0时
                    for (let i = 0; i < currIndex[1]; i++) {
                        let index = layerIndex[i] - 1;
                        let key = layerKeys[i][index];
                        tempres = tempres[key];// 更新当前对象
                        if (isNaN(key)) {// 数组方法添加
                            temptag = temptag.get(key);// 更新tag临时变量
                        } else {
                            temptag = temptag.get(Number(key));// 更新tag临时变量
                        }
                    }
                    // 跳出本次循环，判断新的层是否已经遍历完成
                    continue;
                }
            }
            let key = layerKeys[currIndex[1]][currIndex[0]];// string|number
            let ele = tempres[key];
            if (typeof (ele) === 'object') {// 如果是object和array
                if (tempres.constructor.name === 'Array') {// 数组方法添加
                    temptag.add(toNBTType(key, ele));
                    temptag = temptag.get(Number(key));// 更新tag临时变量
                } else {
                    temptag.put(key, toNBTType(key, ele));
                    temptag = temptag.get(key);// 更新tag临时变量
                }
                tempres = tempres[layerKeys[currIndex[1]][currIndex[0]]];// 更新父
                lens = Object.keys(tempres);
                currIndex[1]++;// 注意：此时当前层 +1
                layerKeys[currIndex[1]] = lens;
                currIndex[0] = 0;
                layerIndex[currIndex[1] - 1]++;
                layerIndex[currIndex[1]] = currIndex[0];// 更新层索引防止回头
                continue;
            }
            if (tempres.constructor.name === 'Array') {// 数组方法添加
                temptag.add(toNBTType(key, ele));
            } else {
                temptag.put(key, toNBTType(key, ele));
            }
            currIndex[0]++;
            layerIndex[currIndex[1]]++;// 更新层索引防止回头
        }
        return new NbtCompound(results);
    }

    /**
     * 从二进制 NBT 数据生成 NBT 标签对象
     * @param nbt {ByteBuffer} 你要解析的二进制 NBT 数据
     * @returns {cn.nukkit.nbt.tag.CompoundTag} 生成的 NBT 对象
     */
    static parseBinaryNBT(nbt) {
        return NBT.parseLittleBinaryNBT(nbt);
    }

    /**
     * @since future
     */
    static parseLittleBinaryNBT(binary) {// 低位字节，未压缩的，be常用
        const bytes = Java.to(new Int8Array(binary), "byte[]");
        return new NbtCompound(NBTIO.read(bytes, ByteOrder.LITTLE_ENDIAN));
    }

    /**
     * @since future
     */
    static parseBigBinaryNBT(binary) {// 高位字节，zlib压缩的，je常用
        const bytes = Java.to(new Int8Array(binary), "byte[]");
        return new NbtCompound(NBTIO.read(bytes, ByteOrder.BIG_ENDIAN));
    }
}

/**
 * 将普通js数据转换为nukkit的nbt标签
 * @pnxonly
 * @param name {string} 键名
 * @param value {any} 被转换的值
 * @returns {cn.nukkit.nbt.tag}
 */
function toNBTType(name, value) {
    switch (typeof (value)) {
        case 'number': {
            if (Number.isInteger(value)) {
                if (value >= Integer.MIN_VALUE && value <= Integer.MAX_VALUE) {
                    return new IntTag(name, value);
                } else if (value >= Long.MIN_VALUE && value <= Long.MAX_VALUE) {
                    return new LongTag(name, value);
                }
            }
            if (value >= Float.MIN_VALUE && value <= Float.MAX_VALUE) {
                return new FloatTag(name, value);
            } else if (value >= Double.MIN_VALUE && value <= Double.MAX_VALUE) {
                return new DoubleTag(name, value);
            }
            break;
        }
        case 'string': {
            return new StringTag(name, value);
            break;
        }
        case 'boolean': {
            return new ByteTag(name, Number(value));
            break;
        }
        case 'object': {
            if (value.constructor.name === 'Array') {
                return new ListTag(name);
            } else if (value.constructor.name === 'Object') {
                return new CompoundTag(name);
            }
            break;
        }
        default: {
            console.error('toNBTType(' + arguments + ')遇到了错误的数据类型: ' + typeof (value));
        }
    }
    return null;
}
