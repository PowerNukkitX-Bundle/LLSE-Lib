import { JSAssert } from './assert/Assert.js';
import { TestNbt } from "./nbt/TestNbt.js";
import { TestBlock } from "./object/TestBlock.js";
import { TestKVDatabase } from "./database/TestKVDatabase.js";
import { TestEntity } from "./object/TestEntity.js";
import { TestIniConfig } from './config/TestIniConfig.js';
import { colorLog, File, log } from "../@LiteLoaderLibs/index.js";
import { TestDBSession } from './database/TestDBSession.js';
import { TestPlayer } from './object/TestPlayer.js';
import { TestJsonConfig } from './config/TestJsonConfig.js';
import { TestItem } from './object/TestItem.js'

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
    TestPlayer();
    TestKVDatabase();
    TestIniConfig();
    TestDBSession();
    TestJsonConfig();
    TestItem();
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
            colorLog("blue", "\t\t\t\t\t全部套件测试完成\t\t\t§b");
            let success = "\t\t\t\t\t总成功数:§a " + passed;
            success = success + " ".repeat(20 - success.length) + "\t\t\t";
            let lose = "\t\t\t\t\t总失败数:§c " + failed;
            lose = lose + " ".repeat(20 - lose.length) + "\t\t\t";
            let time = "\t\t\t\t\t总耗时: " + duration + "ms";
            time = time + " ".repeat(20 - time.length) + "\t\t\t";
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
    File.delete('./plugins/Test');
}