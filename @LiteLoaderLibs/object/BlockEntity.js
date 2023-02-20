import { BlockEntity as PNXBlockEntity } from "cn.nukkit.blockentity.BlockEntity";
import { IntPos } from "./IntPos.js";
import { BlockActorType } from "./BlockActorType.js";
import { NbtCompound } from "../nbt/NbtCompound.js";
import { Block } from "./Block.js";

const type = PNXBlockEntity;

export class BlockEntity {

    constructor(PNXBlockEntity) {
        this._PNXBlockEntity = PNXBlockEntity;
    }

    /**
     * 方块实体对应方块所在的坐标
     * @returns {IntPos}
     */
    get pos() {
        return new IntPos(this._PNXBlockEntity);
    }

    /**
     * 方块实体对象的类型ID
     * @returns {number}
     */
    get type() {
        return BlockActorType[this._PNXBlockEntity.getSaveId()];
    }

    /**
     * 获取方块实体对应的NBT对象
     * @returns {NbtCompound}
     */
    getNbt() {
        return new NbtCompound(this._PNXBlockEntity.namedTag);
    }

    /**
     * 写入方块实体对应的NBT对象
     *
     * @param {NbtCompound} nbt NBT对象
     * @returns {Boolean} 是否成功写入
     */
    setNbt(nbt) {
        this._PNXBlockEntity.namedTag = nbt._pnxNbt;
    }

    /**
     * 获取方块实体对应的方块对象
     * @returns {Block}
     */
    getBlock() {
        return new Block(this._PNXBlockEntity.getBlock());
    }
}