import { JSAssert } from './assert/Assert.js'
//激活测试套件(不要优化这个import)
import { TestNbt } from "./nbt/TestNbt.js";
import { colorLog, log } from "../@LiteLoaderLibs/index.js"

/***
 * 总测试入口
 * 测试由多个套件注册,每个套件由多个单元组成
 * 每个套件对应一个js文件,每个单元对应套件中的每个测试函数
 */
export function main() {
    JSAssert.execute({
        onSuiteStarted: function ({name, id}) {
            colorLog("blue", `${id}号套件${name}测试开始\n`);
        },
        onSuiteEnded: function ({id, name, passed, failed, duration}) {
            colorLog("blue", `${id}号套件${name}测试结束`);
            log(`§b成功测试单元:§a${passed}个§b,失败测试单元:§c${failed}个`);
            colorLog("blue", "该套件测试用时" + duration + "ms\n");
        },
        onTestEnded: function ({id, name, success, error, duration}) {
            colorLog("blue", `${id}号单元${name}测试完成`);
            if (success) {
                log("§a测试成功");
            } else {
                log("§c测试失败,失败信息:" + error);
            }
            colorLog("blue", "该单元测试用时" + duration + "ms\n");
        },
        onFinished: function ({passed, failed, duration}) {
            colorLog("blue", "全部套件测试完成");
            colorLog("blue", "总结:");
            colorLog("blue", "总成功数:§a" + passed);
            colorLog("blue", "总失败数:§c" + failed);
            colorLog("blue", "总耗时:" + duration + "ms");
        }
    });
}

export function close() {

}