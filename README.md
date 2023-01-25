# LiteLoader-Libs

实现LLSE所有方法的库

## Tips

```git
//clone此厂库请使用下命令
git clone --recursive https://github.com/PowerNukkitX/LiteLoader-Libs
//更新.header
git submodule update --remote
```

## demo

```javascript
import {
    ll,
    mc,
    Format,
    PermType,
    system,
    data,
    i18n,
    logger,
    File,
    JsonConfigFile,
    colorLog,
    log,
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
    NBT
} from '@LiteLoaderLibs/index.js'

export function main() {
	mc.runcmd('say hello!');
}
```

## Docs

[PowerNukkitX仓库](https://github.com/PowerNukkitX/PowerNukkitX/tree/master/src/main/java/)

[PowerNukkitX JS开发文档](https://doc.powernukkitx.cn/zh-cn/plugin-dev/js/%E6%A6%82%E8%BF%B0.html)

[LiteLoader开发文档](https://docs.litebds.com/#/zh_CN/Development/)
