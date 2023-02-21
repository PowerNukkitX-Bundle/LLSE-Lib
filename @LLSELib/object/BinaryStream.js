import { BinaryStream as PNXBinaryStream } from "cn.nukkit.utils.BinaryStream";
import { Integer } from "java.lang.Integer";
import { Byte } from "java.lang.Byte";
import { Long } from "java.lang.Long";
import { Short } from "java.lang.Short";
import { isBoolean, isNumber, isString } from "../utils/underscore-esm-min.js";
import { FloatPos } from "./FloatPos.js";
import { NbtCompound } from "../nbt/NbtCompound.js";
import { Packet } from "./Packet.js";

export class BinaryStream {

    /**
     * @private
     * @type {cn.nukkit.utils.BinaryStream}
     */
    _PNXBinaryStream

    /**
     * 创建一个二进制流对象
     *
     * @returns {BinaryStream}
     */
    constructor() {
        this._PNXBinaryStream = new PNXBinaryStream();
    }

    /**
     * 重置二进制流
     *
     * @returns {boolean} 是否成功
     */
    reset() {
        this._PNXBinaryStream.reset();
        return true;
    }

    /**
     * 写入一个Bool
     *
     * @param {boolean} value
     * @returns {boolean} 是否成功
     */
    writeBool(value) {
        if (!isBoolean(value)) return false;
        this._PNXBinaryStream.putBoolean(value);
        return true;
    }

    /**
     * 写入一个Byte
     *
     * @param {number} value
     * @returns {boolean} 是否成功
     */
    writeByte(value) {
        if (!isNumber(value)) return false;
        this._PNXBinaryStream.putByte(value);
        return true;
    }

    /**
     * 写入一个Double值
     *
     * @param {number} value
     * @returns {boolean} 是否成功
     */
    writeDouble(value) {
        if (!isNumber(value)) return false;
        this._PNXBinaryStream.putLFloat(value);
        return true;
    }

    /**
     * 写入一个Float
     *
     * @param {number} value
     * @returns {boolean} 是否成功
     */
    writeFloat(value) {
        if (!isNumber(value)) return false;
        this._PNXBinaryStream.putLFloat(value);
        return true;
    }

    /**
     * 以大端字节序写入一个有符号Int值
     *
     * @param {number} value
     * @returns {boolean} 是否成功
     */
    writeSignedBigEndianInt(value) {
        if (!isNumber(value)) return false;
        this._PNXBinaryStream.putInt(value);
        return true;
    }

    /**
     * 写入一个有符号Int值
     *
     * @param {number} value
     * @returns {boolean} 是否成功
     */
    writeSignedInt(value) {
        if (!isNumber(value)) return false;
        this._PNXBinaryStream.putLFloat(value);
        return true;
    }

    /**
     * 写入一个有符号Int64(Long)值
     *
     * @param {number} value
     * @returns {boolean} 是否成功
     */
    writeSignedInt64(value) {
        if (!isNumber(value)) return false;
        this._PNXBinaryStream.putLLong(value);
        return true;
    }

    /**
     * 写入一个有符号Short值
     *
     * @param {number} value
     * @returns {boolean} 是否成功
     */
    writeSignedShort(value) {
        if (!isNumber(value)) return false;
        this._PNXBinaryStream.putLShort(value);
        return true;
    }

    /**
     * 写入一个String
     *
     * @param {string} value
     * @returns {boolean} 是否成功
     */
    writeString(value) {
        if (!isString(value)) return false;
        this._PNXBinaryStream.putString(value);
        return true;
    }

    /**
     * 写入一个UnsignedChar
     *
     * @param {number} value
     * @returns {boolean} 是否成功
     */
    writeUnsignedChar(value) {
        if (!isNumber(value)) return false;
        this._PNXBinaryStream.putByte(Byte.toUnsignedInt(value));
        return true;
    }

    /**
     * 写入一个无符号Int
     *
     * @param {number} value
     * @returns {boolean} 是否成功
     */
    writeUnsignedInt(value) {
        if (!isNumber(value)) return false;
        this._PNXBinaryStream.putLInt(Integer.toUnsignedLong(value));
        return true;
    }

    /**
     * 写入一个无符号Int64
     *
     * @param {number} value
     * @returns {boolean} 是否成功
     */
    writeUnsignedInt64(value) {
        if (!isNumber(value)) return false;
        this._PNXBinaryStream.putLLong(Long.toUnsignedBigInteger(value).longValue());
        return true;
    }

    /**
     * 写入一个无符号Short
     *
     * @param {number} value
     * @returns {boolean} 是否成功
     */
    writeUnsignedShort(value) {
        if (!isNumber(value)) return false;
        this._PNXBinaryStream.putLShort(Short.toUnsignedInt(value));
        return true;
    }

    /**
     * 写入一个无符号VarInt
     *
     * @param {number} value
     * @returns {boolean} 是否成功
     */
    writeUnsignedVarInt(value) {
        if (!isNumber(value)) return false;
        this._PNXBinaryStream.putUnsignedVarInt(value);
        return true;
    }

    /**
     * 写入一个无符号VarInt64
     *
     * @param {number} value
     * @returns {boolean} 是否成功
     */
    writeUnsignedVarInt64(value) {
        if (!isNumber(value)) return false;
        this._PNXBinaryStream.putUnsignedVarLong(value);
        return true;
    }

    /**
     * 写入一个VarInt
     *
     * @param {number} value
     * @returns {boolean} 是否成功
     */
    writeVarInt(value) {
        if (!isNumber(value)) return false;
        this._PNXBinaryStream.putVarInt(value);
        return true;
    }

    /**
     * 写入一个VarInt64
     *
     * @param {number} value
     * @returns {boolean} 是否成功
     */
    writeVarInt64(value) {
        if (!isNumber(value)) return false;
        this._PNXBinaryStream.putVarLong(value);
        return true;
    }

    /**
     * 写入一个FloatPos
     *
     * @param {FloatPos} value
     * @returns {boolean} 是否成功
     */
    writeVec3(value) {
        if (!(value instanceof FloatPos)) return false;
        this._PNXBinaryStream.putVector3f(value.position.asVector3f());
        return true;
    }

    /**
     * 写入一个NbtCompound
     *
     * @param {NbtCompound} value
     * @returns {boolean} 是否成功
     */
    writeCompoundTag(value) {
        if (!(value instanceof NbtCompound)) return false;
        this._PNXBinaryStream.putTag(value._pnxNbt);
        return true;
    }

    /**
     * 通过该二进制流构建数据包
     *
     * @param {number} pktid
     * @returns {Packet} 数据包对象
     */
    createPacket(pktid) {
        return new Packet(pktid, this._PNXBinaryStream.getBuffer());
    }

    reserve(length) {
    }
}