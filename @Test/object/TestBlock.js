import { assertThat, JSAssert } from '../assert/Assert.js';
import { Block } from '../../@LiteLoaderLibs/object/Block.js';
import { getLevels } from "../../@LiteLoaderLibs/utils/Mixins.js";
import { NBT } from '../../@LiteLoaderLibs/index.js';
import { Block as PNXBlock } from 'cn.nukkit.block.Block';

/**
 * Test suite for the object assertions of jsassert framework.
 */
export const TestBlock = () => {
    //测试环境配置
    var pnxBlock = PNXBlock.get(54);
    pnxBlock.setX(100);
    pnxBlock.setY(100);
    pnxBlock.setZ(100);
    pnxBlock.setLevel(getLevels()[0]);
    var block = new Block(pnxBlock);
    //注册测试套件
    JSAssert.addTestSuite("Test Block", {
        testProperty: function () {
            assertThat(block.name).equals("Chest", "name属性异常");
            assertThat(block.type).equals("minecraft:chest", "type属性异常");
            assertThat(block.id).equals(54, "id属性异常");
            assertThat(block.pos.toString()).equals(`{"x":100,"y":100,"z":100,"dim":"world","dimid":0}`, "pos属性异常");
            assertThat(block.tileData).equals(0, "tileData属性异常");
        },
        testNBT: function () {
            assertThat(block.getNbt().toSNBT()).equals(`{"name":"minecraft:chest","states":{"facing_direction":0}}`, "getNbt异常");
            let nbt = NBT.parseSNBT(`{"name":"minecraft:chest","states":{"facing_direction":"0"}}`);
            nbt = nbt.setTag("states", nbt.getData("states").setInt("facing_direction", 2))
            block.setNbt(nbt);
            assertThat(block.tileData).equals(2, "setNbt异常");
        }
    });
};