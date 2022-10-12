import { assertThat, JSAssert } from '../assert/Assert.js';
import { JsonConfigFile } from "../../@LiteLoaderLibs/index.js";

/**
 * Test suite for the object assertions of jsassert framework.
 */
export const TestJsonConfig = () => {
    //测试环境配置
    var config = new JsonConfigFile("./plugins/Test/test2.json");
    //注册测试套件
    JSAssert.addTestSuite("Test JsonConfig", {
        testMethods: function () {
            assertThat(config.get("test", null)).equals(null, "get函数异常");
            config.init("test1", "hello");
            let test1 = config.get("test1", null);
            assertThat(test1).equals("hello", "init函数异常");
            config.set("test2", "hello2");
            let test2 = config.get("test2", null);
            assertThat(test2).equals("hello2", "set函数异常");
            config.delete("test2");
            test2 = config.get("test2", null);
            assertThat(test2).equals(null, "delete函数异常");
            assertThat(config.getPath()).equals("./plugins/Test/test2.json", "getPath函数异常");
            config.set("test3", "hello3");
            let test3 = config.get("test2", null);
            config.delete("test3");
            config.reload();
            assertThat(test3).equals(null, "reload函数异常");
            config.set("test4", "hello4");
            assertThat(config.read()).equals(`{"test1":"hello","test4":"hello4"}`, "read函数异常");
            config.write(`{"test1":"hello","test2":"hello2"}`);
            assertThat(config.read()).equals(`{"test1":"hello","test2":"hello2"}`, "write函数异常");
            assertThat(config.close()).equals(true, "close函数异常");
        }
    });
};