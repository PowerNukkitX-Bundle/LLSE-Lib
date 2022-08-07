import { JSAssert } from './assert/Assert.js';
import { TestNbt } from "./nbt/TestNbt.js";
import { TestBlock } from "./object/TestBlock.js";
import { TestKVDatabase } from "./database/TestKVDatabase.js";
import { TestEntity } from "./object/TestEntity.js";
import { colorLog, File, log } from "../@LiteLoaderLibs/index.js";

/***
 * 总测试入口
 * 测试由多个套件注册,每个套件由多个单元组成
 * 每个套件对应一个js文件,每个单元对应套件中的每个测试函数
 */
export function main() {
    //套件列表
    TestNbt();
    TestBlock();
    TestEntity();
    TestKVDatabase();
    //执行测试,传入配置参数
    JSAssert.execute({
        onSuiteStarted: function ({name, id}) {
            colorLog("yellow", "━".repeat(28));
            colorLog("blue", `${id + 1}号套件${name}测试开始`);
            log('');
        },
        onSuiteEnded: function ({id, name, passed, failed, duration}) {
            log('');
            colorLog("blue", `${id + 1}号套件${name}测试结束`);
            log(`§b成功测试单元:§a${passed}个§b,失败测试单元:§c${failed}个`);
            colorLog("blue", "该套件测试用时" + duration + "ms");
        },
        onTestEnded: function ({id, name, success, error, duration}) {
            colorLog("blue", `${id}号单元${name}测试完成`);
            if (success) {
                log("§a测试成功");
            } else {
                log("§c测试失败,失败信息:" + error);
            }
            colorLog("blue", "该单元测试用时" + duration + "ms");
        },
        onFinished: function ({passed, failed, duration}) {
            colorLog("yellow", "━".repeat(28));
            log('');
            colorLog("blue", "━".repeat(28));
            colorLog("blue", "┃\t\t全部套件测试完成\t\t§b┃");
            let success = "┃\t\t总成功数:§a " + passed;//支持9位passed制表
            success = success + " ".repeat(20 - success.length) + "\t§b┃";
            let lose = "┃\t\t总失败数:§c " + failed;//支持9位failed制表
            lose = lose + " ".repeat(20 - lose.length) + "\t§b┃";
            let time = "┃\t\t总耗时: " + duration + "ms";//支持10位ms制表,超出异常RangeError: illegal repeat count
            time = time + " ".repeat(20 - time.length) + "\t§b┃";
            colorLog("blue", success);
            colorLog("blue", lose);
            colorLog("blue", time);
            colorLog("blue", "━".repeat(28));
            File.writeTo("result.txt", `${passed};${failed}`);
        }
    });
    File.writeLine("control.txt", "stop");
}

export function close() {
}