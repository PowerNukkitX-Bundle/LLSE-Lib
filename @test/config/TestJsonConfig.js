import { assertThat, JSAssert } from '../assert/Assert.js'
import { JsonConfigFile } from "../../@LiteLoaderLibs/index.js";

/**
 * Test suite for the object assertions of jsassert framework.
 */
export const TestJsonConfig = () => {
    //测试环境配置
    var config = new JsonConfigFile("config/test1.ini");
    //注册测试套件
    JSAssert.addTestSuite("Test JsonConfig", {
        testMethods: function () {

        }
    });
};