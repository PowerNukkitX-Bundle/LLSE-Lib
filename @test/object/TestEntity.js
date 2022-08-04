import { assertThat, JSAssert } from '../assert/Assert.js';
import { getLevels } from "../../@LiteLoaderLibs/utils/Mixins.js";
import { Entity as JEntity } from 'cn.nukkit.entity.Entity'
import { Entity } from '../../@LiteLoaderLibs/object/Entity.js'
import { Vector3 } from 'cn.nukkit.math.Vector3';
import { isNumber } from "../../@LiteLoaderLibs/utils/underscore-esm-min.js";
import { UUID } from "java.util.UUID";

/**
 * Test suite for the object assertions of jsassert framework.
 */
export const TestEntity = () => {
    //测试环境配置
    //12是猪的network id
    var pnxEntity = JEntity.createEntity("12", getLevels()[0].getChunk(0, 0, true), JEntity.getDefaultNBT(new Vector3(0, 300, 0)));
    var entity = new Entity(pnxEntity);
    //注册测试套件
    JSAssert.addTestSuite("Test Entity", {
        testProperty: function () {
            assertThat(entity.name).equals("Pig", "name属性读取异常");
            assertThat(entity.type).equals("Pig", "type属性读取异常");
            assertThat(isNumber(entity.id)).isTrue("id属性读取异常");
            assertThat(entity.pos.toString()).equals(`{"x":0,"y":300,"z":0,"dim":"world","dimid":0}`, "pos属性读取异常");
            assertThat(entity.blockPos.toString()).equals(`{"x":0,"y":300,"z":0,"dim":"world","dimid":0}`, "blockPos属性读取异常");
            assertThat(entity.maxHealth).equals(10, "maxHealth属性读取异常");
            assertThat(entity.health).equals(20, "health属性读取异常");
            assertThat(entity.inAir).equals(true, "inAir属性读取异常");
            assertThat(entity.inWater).equals(false, "inWater属性读取异常");
            assertThat(entity.speed).equals(0.10000000149011612, "speed属性读取异常");
            assertThat(entity.direction.toString()).equals(`{"pitch":0,"yaw":0,"facing":2}`, "direction属性读取异常");
            // assertThat(entity.uniqueId).equals(false,"inWater属性读取异常");
            try {
                UUID.fromString(entity.uniqueId);
            } catch (e) {
                assertThat(false).isTrue("uniqueId属性异常");
            }
        }
    });
};