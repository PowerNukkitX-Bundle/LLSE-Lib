import { NbtCompound } from "./NbtCompound.js";
import { ByteOrder } from "java.nio.ByteOrder";
import { NBTIO } from "cn.nukkit.nbt.NBTIO";
import { SNBTParser } from "cn.nukkit.nbt.SNBTParser";

const ByteArray = Java.type("byte[]");

export class NBT {
    /**
     * 从 SNBT 字符串生成 NBT 标签对象
     * @param snbt {String} 要解析的 SNBT 字符串
     * @returns {NbtCompound} 生成的 NBT 对象
     */
    static parseSNBT(snbt) {
        return new NbtCompound(SNBTParser.parse(snbt));
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
