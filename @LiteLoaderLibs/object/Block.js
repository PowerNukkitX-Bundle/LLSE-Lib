import { Block as JBlock } from 'cn.nukkit.block.Block';
import { NBT } from '../nbt/NBT.js';
import { EnumLevel } from 'cn.nukkit.level.EnumLevel';
import { Position } from 'cn.nukkit.level.Position';
import { Vector3 } from 'cn.nukkit.math.Vector3';

export class Block {
    /**
     * 生产新的 Block 方法对象
     * @returns {Block} 物品对象 如返回值为 Null 则表示生成失败
     */
    constructor(block) {
        this._PNXBlock = block instanceof JBlock ? block : null;
    }

    /**
     * 获取Block
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
     * @returns {Int}
     */
    get pos() {
        return this._PNXBlock.clone();
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
     * @todo 改为LLSE类型，目前为snbt
     * @returns {NbtCompound}
     */
    getNbt() {
        var property = this._PNXBlock.getStateId().split(';');
        var data = {name: property[0], states: {}};
        if (property.length === 1) {
            return data;
        }
        for (let i = 1; i < property.length; i++) {
            let state = property[i].split('=');
            if (!isNaN(state[1])) {
                state[1] = Number(state[1]);
            }
            data.states[state[0]] = state[0].indexOf('_bit') > -1 ? Boolean(state[1]) : state[1];
        }
        return NBT.parseSNBT(JSON.stringify(data).replaceAll('_bit":false', '_bit":0b').replaceAll('_bit":true', '_bit":1b'));
    }

    /**
     * 写入方块对应的 NBT 对象
     * @todo 未实现
     * @param nbt {NbtCompound} NBT 对象
     * @returns {boolean}
     */
    setNbt(nbt) {
        // more code...
        return false;
    }

    toString() {
        return JSON.stringify({name: this.name, type: this.type, pos: this.pos, tileData: this.tileData});
    }
}

export function getLevels() {
    return [
        EnumLevel.OVERWORLD.getLevel().getName(),
        EnumLevel.NETHER.getLevel().getName(),
        EnumLevel.THE_END.getLevel().getName()
    ];
}
