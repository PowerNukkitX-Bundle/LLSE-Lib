import {
    NBT,
    NbtByte,
    NbtByteArray,
    NbtCompound,
    NbtDouble,
    NbtEnd,
    NbtFloat,
    NbtInt,
    NbtList,
    NbtLong,
    NbtShort,
    NbtString
} from '../../@LiteLoaderLibs/index.js'
import { assertThat, JSAssert } from '../assert/Assert.js'

/**
 * Test suite for the object assertions of jsassert framework.
 */

export const TestNbt = () => {
    //测试环境配置
    var buffer = new ArrayBuffer(5);
    var array = new Int8Array(buffer);
    array.fill(5)
    var oldNBT = new NbtCompound({
        "name1": new NbtInt(3),
        "name2": new NbtString("test"),
        "name3": new NbtList([
            new NbtFloat(4.0),
            new NbtFloat(6.0)
        ]),
        "name4": new NbtLong(66666),
        "name5": new NbtCompound({
            "k3": new NbtDouble(5.0),
            "k4": new NbtByte(2),
            "k5": new NbtByteArray(array),
            "k6": new NbtEnd(),
            "k7": new NbtShort(8),
            "k8": new NbtCompound({
                "m1": new NbtInt(3),
                "m2": new NbtInt(3)
            })
        })
    });
    var object = {
        name1: 3,
        name2: "test",
        name3: [4, 6],
        name4: 66666,
        name5: {k3: 5, k4: 2, k5: array, k6: null, k7: 8, k8: {m1: 3, m2: 3}}
    };
    //注册测试套件
    JSAssert.addTestSuite("Test NBT", {
        testNBTOutput: function () {
            assertThat(oldNBT.toSNBT()).equals(`{"name5":{"k3":5.0d,"k4":2b,"k5":[B;5,5,5,5,5],"k6":,"k7":8s,"k8":{"m1":3,"m2":3}},"name4":66666L,"name3":[4.0f,6.0f],"name2":"test","name1":3}`, "toSNBT异常");
            assertThat(oldNBT.toObject()).equals(object, "toObject异常");
            assertThat(oldNBT.toString()).equals(`{"name5":{"k3":5,"k4":2,"k5":"NTU1NTU=","k6":null,"k7":8,"k8":{"m1":3,"m2":3}},"name4":66666,"name3":[4,6],"name2":"test","name1":3}`, "toString异常");
        },
        testDeserialization: function () {
            let oldSNBT = oldNBT.toSNBT()
            let newNBT = NBT.parseSNBT(oldSNBT);
            let newSNBT = newNBT.toSNBT();
            assertThat(newSNBT).equals(oldSNBT, "新旧SNBT不等");
            assertThat(newNBT).equals(oldNBT, "新旧NBT不等");
        },
        testCreateCompound: function () {
            let nbt = new NbtCompound();
            nbt.setInt("name1", 2)
                .setFloat("name2", 1, 11111)
                .setDouble("name3", 2.32342)
                .setByte("name4", 1)
                .setShort("name5", 128)
                .setString("name6", "test1")
                .setLong("name7", 99999)
                .setByteArray("name8", array)
                .setEnd("name9");
            nbt.setTag("s1", new NbtList([new NbtInt(1), new NbtInt(2)]))
                .setTag("s2", new NbtCompound({
                    p1: new NbtString("hahaha"),
                    p2: new NbtString("lalala")
                }));
            assertThat(nbt.toSNBT()).equals(`{"name6":"test1","name5":128s,"name4":1b,"name3":2.32342d,"name9":,"name8":[B;5,5,5,5,5],"name7":99999L,"name2":1.0f,"name1":2,"s1":[1,2],"s2":{"p1":"hahaha","p2":"lalala"}}`, "创建Compound异常");
        },
        testFunctionCompound: function () {
            assertThat(oldNBT.getKeys()).equals(["name5", "name4", "name3", "name2", "name1"], "getKeys方法异常");
        }
    });
};