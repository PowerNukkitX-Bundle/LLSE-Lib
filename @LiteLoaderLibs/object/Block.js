import { Block as JBlock } from 'cn.nukkit.block.Block';
import { NbtCompound } from '../nbt/NbtCompound.js'
import { NbtString } from '../nbt/NbtString.js'
import { NbtByte } from '../nbt/NbtByte.js'
import { NbtInt } from '../nbt/NbtInt.js'
import { IntPos } from './IntPos.js'
import { BlockState } from 'cn.nukkit.blockstate.BlockState'

export class Block {
    /**
     * 生产新的 Block 方法对象
     * @returns {Block} 物品对象 如返回值为 Null 则表示生成失败
     */
    constructor(block) {
        this._PNXBlock = block instanceof JBlock ? block : null;
    }

    /**
     * 获取LLSE版本Block
     * @pnxonly
     * @returns {Block} 物品对象 如返回值为 Null 则表示生成失败
     */
    static get(block) {
        return new Block(block);
    }

    /**
     * 游戏内显示的方块名称
     * @readonly
     * @returns {string}
     */
    get name() {
        return this._PNXBlock.getName();
    }

    /**
     * 方块标准类型名
     * @readonly
     * @returns {string}
     */
    get type() {
        return this._PNXBlock.getPersistenceName();
    }

    /**
     * 方块所在坐标
     * @readonly
     * @returns {IntPos}
     */
    get pos() {
        return new IntPos(this._PNXBlock);
    }

    /**
     * 方块数字ID
     * @readonly
     * @returns {number}
     */
    get id() {
        return this._PNXBlock.getId();
    }

    /**
     * 方块数据值
     * @readonly
     * @returns {number}
     */
    get tileData() {
        return this._PNXBlock.getDamage();
    }

    /**
     * 获取物品对应的 NBT 对象
     * @todo 待测试
     * @returns {NbtCompound} NBT对象
     */
    getNbt() {
        let property = this._PNXBlock.getStateId().split(';');
        if (property.length === 1) {
            return new NbtCompound({
                name: new NbtString(property[0])
            });
        }
        let states = {};
        for (let i = 1; i < property.length; i++) {
            let state = property[i].split('=');
            let key = state[0];
            let value = state[1];
            if (key.indexOf("_bit") !== -1) {
                states[key] = new NbtByte(Number(value));
            } else if (!isNaN(value)) {
                states[key] = new NbtInt(Number(value));
            } else {
                states[key] = new NbtString(value);
            }
        }
        let result = {name: new NbtString(property[0]), states: new NbtCompound(states)};
        return new NbtCompound(result);
    }

    /**
     * 写入方块对应的 NBT 对象
     * @todo 待测试
     * @param nbt {NbtCompound} NBT 对象
     * @returns {boolean}
     */
    setNbt(nbt) {
        if (nbt.getData("name") !== this.type) return false;
        let state = nbt.getData('name');
        let states = nbt.getData('states');//还是NBTCompound
        for (let key of states.getKeys()) {
            let tag = states.getTag(key);
            if (tag instanceof NbtByte) {
                state += ';' + key + '=' + tag.get() + "b";
            } else {
                let value = tag.get();
                let res = isNaN(value) ? value : Number(value);
                state += ';' + key + '=' + String(res);
            }
        }
        try {
            var _block = BlockState.of(state).getBlock();
        } catch (err) {
            console.error('Unknow states: ' + state);
            return false;
        }
        this._PNXBlock.getLevel().setBlock(this.pos.position, _block);
        this._PNXBlock = this._PNXBlock.getLevel().getBlock(this.pos.position);
        return true;
    }

    toString() {
        return `{"name": "${this.name}", "type": "${this.type}", "pos": ${this.pos}, "id": ${this.id}, "tileData": ${this.tileData}}`;
    }
}
