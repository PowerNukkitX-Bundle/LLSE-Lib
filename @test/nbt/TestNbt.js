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

export const TestNbt = JSAssert.addTestSuite("Test NBT", (function () {
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

    // Expose test cases
    return {
        testNBTOutput: function () {
            assertThat(oldNBT.toSNBT()).equals(`"":{"name5":{"k3":5.0d,"k4":2b,"k5":[B;5, 5, 5, 5, 5],"k6":,"k7":8s,"k8":{"m1":3,"m2":3}},"name4":66666L,"name3":[4.0f,6.0f],"name2":"test","name1":3}`, "toSNBT异常");
            assertThat(oldNBT.toObject()).equals(object, "toObject异常");
            assertThat(oldNBT.toString()).equals(`{"name1":3,"name2":"test","name3":[4,6],"name4":66666,"name5":{"k3":5,"k4":2,"k5":"NTU1NTU=","k6":null,"k7":8,"k8":{"m1":3,"m2":3}}}`, "toString异常");
        },
        testDeserialization: function () {
            let oldSNBT = oldNBT.toSNBT()
            let newNBT = NBT.parseSNBT(oldSNBT);
            let newSNBT = newNBT.toSNBT();
            assertThat(newSNBT).equals(oldSNBT, "新旧SNBT不等");
            assertThat(newNBT).equals(oldNBT, "新旧NBT不等");
        }
    };
}()));