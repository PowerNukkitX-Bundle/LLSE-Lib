import { assertThat, JSAssert } from '../assert/Assert.js';
import { mc } from '../../@LiteLoaderLibs/index.js';

/**
 * Test suite for the object assertions of jsassert framework.
 */
export const TestItem = () => {
    //测试环境配置
    let item = mc.newItem("minecraft:bread", 1);
    //注册测试套件
    JSAssert.addTestSuite("Test Entity", {
        testProperty: function () {
            assertThat(item.name).equals("Bread", "name属性读取异常");
            assertThat(item.type).equals("minecraft:bread", "type属性读取异常");
            assertThat(item.id).equals(297, "id属性读取异常");
            assertThat(item.count).equals(1, "count属性读取异常");
            assertThat(item.aux).equals(0, "aux属性读取异常");
            assertThat(item.damage).equals(-1, "damage属性读取异常");
            assertThat(item.attackDamage).equals(1, "attackDamage属性读取异常");
            assertThat(item.maxDamage).equals(-1, "maxDamage属性读取异常");
            assertThat(item.isArmorItem).equals(false, "isArmorItem属性读取异常");
            assertThat(item.isBlock).equals(false, "isBlock属性读取异常");
            assertThat(item.isDamageableItem).equals(true, "isDamageableItem属性读取异常");
            assertThat(item.isDamaged).equals(false, "isDamaged属性读取异常");
            assertThat(item.isEnchanted).equals(false, "isEnchanted属性读取异常");
            assertThat(item.isEnchantingBook).equals(false, "isEnchantingBook属性读取异常");
            assertThat(item.isFireResistant).equals(false, "isFireResistant属性读取异常");
            assertThat(item.isFullStack).equals(false, "isFullStack属性读取异常");
            assertThat(item.isGlint).equals(false, "isGlint属性读取异常");
            assertThat(item.isHorseArmorItem).equals(false, "isHorseArmorItem属性读取异常");
            assertThat(item.isMusicDiscItem).equals(false, "isMusicDiscItem属性读取异常");
            assertThat(item.isOffhandItem).equals(false, "isOffhandItem属性读取异常");
            assertThat(item.isPotionItem).equals(false, "isPotionItem属性读取异常");
            assertThat(item.isStackable).equals(true, "isStackable属性读取异常");
            assertThat(item.isWearableItem).equals(false, "isWearableItem属性读取异常");
        },
        testFunction: function () {
        },
        testNBT: function () {
        }
    });
};