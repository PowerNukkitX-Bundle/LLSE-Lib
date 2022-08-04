import { assertThat, JSAssert } from '../assert/Assert.js'
import { KVDatabase } from "../../@LiteLoaderLibs/database/KVDatabase.js";

/**
 * Test suite for the object assertions of jsassert framework.
 */
export const TestKVDatabase = () => {
    //测试环境配置
    var db = new KVDatabase("database/test.db");
    //注册测试套件
    JSAssert.addTestSuite("Test KVDatabase", {
        testMethods: function () {
            try {
                assertThat(db.set("test1", 1)).isTrue("set异常");
                assertThat(db.set("test2", 333)).isTrue("set异常");
                assertThat(db.set("test3", 3.2222)).isTrue("set异常");
                assertThat(db.get("test1")).equals(1, "get异常");
                assertThat(db.delete("test1")).isTrue("delete异常");
                assertThat(db.listKey()).equals(["test2", "test3"], "listKey异常");
            } catch (e) {
                console.error(e);
            } finally {
                assertThat(db.close()).isTrue("close异常");
            }
        }
    });
};