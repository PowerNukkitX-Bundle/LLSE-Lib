import { Block as PNXBlock } from 'cn.nukkit.block.Block';
import { BlockButton } from 'cn.nukkit.block.BlockButton';
import { BlockCrops } from 'cn.nukkit.block.BlockCrops';
import { BlockDoor } from 'cn.nukkit.block.BlockDoor';
import { NbtCompound } from '../nbt/NbtCompound.js';
import { NbtString } from '../nbt/NbtString.js';
import { NbtByte } from '../nbt/NbtByte.js';
import { NbtInt } from '../nbt/NbtInt.js';
import { IntPos } from './IntPos.js';
import { BlockState } from 'cn.nukkit.blockstate.BlockState';
import { InventoryHolder } from 'cn.nukkit.inventory.InventoryHolder';
import { Container } from '../container/Container.js';
import { BlockFence } from 'cn.nukkit.block.BlockFence';
import { BlockFenceGate } from 'cn.nukkit.block.BlockFenceGate';
import { BlockGrass } from 'cn.nukkit.block.BlockGrass';
import { BlockFlower } from 'cn.nukkit.block.BlockFlower';
import { BlockSlab } from 'cn.nukkit.block.BlockSlab';
import { BlockTransparentMeta } from 'cn.nukkit.block.BlockTransparentMeta';
import { BlockEntity } from "./BlockEntity.js";

const type = PNXBlock;

export class Block {
    /**
     * 生产新的 Block 方法对象
     * @returns {PNXBlock} 物品对象 如返回值为 Null 则表示生成失败
     */
    constructor(block) {
        this._PNXBlock = block;
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
     * The block variant
     * todo 弄懂这是啥然后实现
     * @returns {number}
     */
    get variant() {
        return -1;
    }

    /**
     * 方块透明度
     * @returns {number}
     */
    get translucency() {
        return 15 - this._PNXBlock.getLightFilter();
    }

    /**
     * 方块厚度
     * @returns {number}
     */
    get thickness() {
        return this._PNXBlock.getMaxY() - this._PNXBlock.getMinY();
    }

    /**
     * 方块是否为空气
     * @returns {boolean}
     */
    get isAir() {
        return this._PNXBlock.getId() === 0;
    }

    /**
     * 是否为可弹跳方块
     * @returns {boolean}
     */
    get isBounceBlock() {
        return this._PNXBlock.getId() === 165;
    }

    /**
     * 是否为按钮方块
     * @returns {boolean}
     */
    get isButtonBlock() {
        return this._PNXBlock instanceof BlockButton;
    }

    /**
     * 是否为农作物方块
     * @returns {boolean}
     */
    get isCropBlock() {
        return this._PNXBlock instanceof BlockCrops;
    }

    /**
     * 是否为门方块
     * @returns {boolean}
     */
    get isDoorBlock() {
        return this._PNXBlock instanceof BlockDoor;
    }

    /**
     * 是否为栅栏方块
     * @returns {boolean}
     */
    get isFenceBlock() {
        return this._PNXBlock instanceof BlockFence;
    }

    /**
     * 是否为栅栏门方块
     * @returns {boolean}
     */
    get isFenceGateBlock() {
        return this._PNXBlock instanceof BlockFenceGate;
    }

    /**
     * 是否为细栅栏方块
     * @returns {boolean}
     */
    get isThinFenceBlock() {
        return false;
    }

    /**
     * 是否为重的方块
     * todo 理解为可下落的方块？
     * @returns {boolean}
     */
    get isHeavyBlock() {
        return false;
    }

    /**
     * 是否为植物类方块
     * @returns {boolean}
     */
    get isStemBlock() {
        return this._PNXBlock instanceof BlockFlower || this._PNXBlock instanceof BlockGrass || this._PNXBlock instanceof BlockTallGrass;
    }

    /**
     * 是否为半砖方块
     * @returns {boolean}
     */
    get isSlabBlock() {
        return this._PNXBlock instanceof BlockSlab;
    }

    /**
     * 方块是否为不可破坏
     * @returns {boolean}
     */
    get isUnbreakable() {
        return this._PNXBlock.getHardness() === -1;
    }

    /**
     * 方块是否可阻挡水
     * @returns {boolean}
     */
    get isWaterBlockingBlock() {
        return !this._PNXBlock instanceof BlockTransparentMeta;
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
        let result = { name: new NbtString(property[0]), states: new NbtCompound(states) };
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

    /**
     * 判断方块是否拥有容器
     * @returns {Boolean} 这个方块是否拥有容器
     */
    hasContainer() {
        const entity = this._PNXBlock.getLevelBlockEntity();
        if (entity !== null && entity instanceof InventoryHolder) {
            return true;
        } else return false;
    }

    /**
     * 获取方块所拥有的容器对象
     * @returns {Container} 这个方块所拥有的容器对象
     */
    getContainer() {
        if (this.hasContainer()) {
            return new Container(this._PNXBlock.getLevelBlockEntity().getInventory());
        }
        return null
    }

    /**
     * 获取一个方块实体对象
     *
     * @returns {BlockEntity} 如返回值为 Null 则表示获取方块实体对象失败，或者此方块没有对应的实体对象
     */
    getBlockEntity() {
        let entity = this._PNXBlock.getLevelBlockEntity();
        if (entity == null) return null;
        else return new BlockEntity(entity);
    }

    toString() {
        return `{"name": "${this.name}", "type": "${this.type}", "pos": ${this.pos}, "id": ${this.id}, "tileData": ${this.tileData}, "translucency": ${this.translucency}, "thickness": ${this.thickness}}`;
    }
}
