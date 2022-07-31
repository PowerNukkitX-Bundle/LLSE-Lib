import {
    NbtEnd,
    NbtShort,
    NbtInt,
    NbtFloat,
    NbtDouble,
    NbtCompound,
    NbtList,
    NbtLong,
    NbtByte,
    NbtByteArray,
    NbtString,
    NBT, log, colorLog
} from '../../@LiteLoaderLibs/index.js'

export function TestNbt() {
    let buffer = new ArrayBuffer(5);
    let array = new Int8Array(buffer);
    array.fill(5)
    let nbt = new NbtCompound({
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
    colorLog("yellow", "下面测试toSNBT");
    log(nbt.toSNBT());
    colorLog("yellow", "下面测试toObject");
    log(nbt.toObject());
    colorLog("yellow", "下面测试toString");
    log(nbt.toString());
    colorLog("yellow", "下面测试toSNBT 格式化");
    log(nbt.toSNBT(4));
    colorLog("yellow", "下面测试toString 格式化");
    log(nbt.toString(4));
}