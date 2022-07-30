import { mc, WSClient, NBT, File } from '../@LiteLoaderLibs/index.js'
import { Assertions } from 'org.junit.jupiter.api.Assertions'

export function close() {
    log("测试插件关闭");
}

export function main() {
    log("测试插件开启");
    colorLog("red", "测试红色");
}