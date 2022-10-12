import { assertThat, JSAssert } from '../assert/Assert.js';
import { IniConfigFile } from "../../@LiteLoaderLibs/index.js";

/**
 * Test suite for the object assertions of jsassert framework.
 */
export const TestIniConfig = () => {
    //测试环境配置
    var config = new IniConfigFile("./plugins/Test/test1.ini");
    //注册测试套件
    JSAssert.addTestSuite("Test IniConfig", {
        testMethods: function () {
            config.init("key1.test", "test1", 1);
            assertThat(config.read()).equals("[key1.test]\ntest1=1\n", "init函数异常");
            config.set("key2", "test2", 2);
            assertThat(config.read()).equals("[key1.test]\ntest1=1\n\n[key2]\ntest2=2\n", "set函数异常");
            assertThat(config.getInt("key1.test", "test1")).equals(1, "getInt函数异常");
            config.set("key3", "test3", 2.123);
            config.set("key4", "test4", true);
            config.set("key5", "test5", "ha!");
            assertThat(config.getFloat("key3", "test3")).equals(2.123, "getFloat函数异常");
            assertThat(config.getBool("key4", "test4")).equals(true, "getBool函数异常");
            assertThat(config.getStr("key5", "test5")).equals("ha!", "getStr函数异常");
            config.delete("key2", "test2");
            config.delete("key3", "test3");
            config.delete("key4", "test4");
            config.delete("key5", "test5");
            assertThat(config.read()).equals("[key1.test]\ntest1=1\n", "delete函数异常");
            assertThat(config.getPath()).equals("./plugins/Test/test1.ini", "getPath函数异常");
            assertThat(config.reload()).isTrue("reload函数异常");
            config.write("")
            assertThat(config.read()).equals("", "write函数异常");
            assertThat(config.close()).isTrue("close函数异常");
        }
    });
};