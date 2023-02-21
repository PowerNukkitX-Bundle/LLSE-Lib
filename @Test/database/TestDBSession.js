import { assertThat, JSAssert } from '../assert/Assert.js'
import { DBSession } from "@LLSELib/database/DBSession.js";

/**
 * Test suite for the object assertions of jsassert framework.
 */
export const TestDBSession = () => {
    //测试环境配置
    var db = new DBSession("sqlite3", { path: "./plugins/Test/sqlite.db" });
    //注册测试套件
    JSAssert.addTestSuite("Test DBSession", {
        testMethods: function () {
            //测试创建一张表
            db.exec(`CREATE TABLE Persons
                     (
                         LastName  varchar(255),
                         FirstName varchar(255),
                         Address   varchar(255),
                         Nation    varchar(255)
                     );`);
            assertThat(db.query("SELECT COUNT(*) FROM sqlite_master where type ='table' and name ='Persons'")[1][0]).equals(1, "exec(数据表创建)异常");

            //测试插入一条数据
            db.exec(`INSERT INTO Persons (LastName, FirstName, Address, Nation)
                     VALUES ('dao', 'ge', 'sichuan', 'CN');`)
            assertThat(db.query(`SELECT LastName, FirstName
                                 FROM Persons;`)).equals([["LastName", "FirstName"], ["dao", "ge"]], "query异常");

            //测试用预准备SQL查询国家为CN的数据
            let st1 = db.prepare("SELECT * FROM Persons WHERE Nation=?10;");
            st1.bind("CN");
            st1.execute();
            assertThat(JSON.stringify(st1.fetch())).equals(`{"LastName":"dao","FirstName":"ge","Address":"sichuan","Nation":"CN"}`, "prepare异常");

            //测试用预准备SQL插入一条数据
            let st2 = db.prepare("INSERT INTO Persons (LastName, FirstName, Address, Nation) VALUES (?,?10,:address,:nation);");
            st2.bind({ address: "nanjing", nation: "CN" });
            st2.bind("Guan");
            st2.bind("JianZi", 9);
            st2.execute();
            assertThat(st2.affectedRows).equals(1, "affectedRows异常");
            assertThat(st2.insertId).equals(2, "insertId异常");

            //测试next fetchAll reset reexec函数
            let st3 = db.prepare("SELECT * FROM Persons WHERE Nation=?10;");
            st3.bind("CN");
            st3.execute();
            st3.next();
            assertThat(JSON.stringify(st3.fetch())).equals(`{"LastName":"Guan","FirstName":"JianZi","Address":"nanjing","Nation":"CN"}`, "next异常");
            let str = "";
            st3.fetchAll((LastName, FirstName, Address, Nation) => {
                str += LastName + FirstName + Address + Nation;
            })
            assertThat(str).equals("daogesichuanCNGuanJianZinanjingCN", "fetchAll(callback)异常");
            st3.reset();
            assertThat(st3.insertId).equals(undefined, "reset异常");
            st3.reexec();
            assertThat(JSON.stringify(st3.fetch())).equals(`{"LastName":"dao","FirstName":"ge","Address":"sichuan","Nation":"CN"}`, "reexec异常");

            //测试clear close函数
            st3.clear();
            st3.bind("US");
            st3.execute();
            assertThat(st3.fetch()).equals({}, "clear异常");
            assertThat(db.close()).isTrue("close异常");
        }
    });
};