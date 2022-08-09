import { File as JFile } from "java.io.File";
import { URL as JURL } from "java.net.URL";
import { Files } from "java.nio.file.Files";
import { Class } from "java.lang.Class";
import { System } from "java.lang.System";
import { isEmpty, isNull, isNumber, isString, isUndefined } from '../utils/underscore-esm-min.js'
import { IllegalArgumentError } from '../error/IllegalArgumentError.js'
import { Connection } from 'java.sql.Connection';

const downloadSqlite = function () {
    const filePath = "org/xerial/sqlite-jdbc/3.39.2.0";
    const fileName = "sqlite-jdbc-3.39.2.0.jar";
    const url = new JURL("https://repo1.maven.org/maven2/" + filePath + '/' + fileName);
    const folder = new JFile("libs");
    if (folder.mkdirs()) {
        console.info("Created " + folder.getPath() + '.');
    }
    const file = new JFile(folder, fileName);
    if (!file.isFile()) {
        try {
            console.info("Get library from " + url + '.');
            Files.copy(url.openStream(), file.toPath());
            console.info("Get library " + fileName + " done!");
            console.info("§4sqlite驱动下载完成,需重新启动服务器加载驱动");
            System.exit(0);
        } catch (e) {
            console.error("下载sqlite驱动失败,具体异常:" + e);
            return false;
        }
    }
    return true;
}
var SQLiteConfig;
if (downloadSqlite()) {
    (() => {
        import('org.sqlite.SQLiteConfig').then(s => {
            ({SQLiteConfig} = s);
        }, e => {
            console.error("载入sqlite依赖库失败,具体异常:" + e)
        });
    })();
}

function createSqlite(url, mode) {
    if (isEmpty(url)) throw new IllegalArgumentError("指定的数据库路径不能为空!");
    let sqlConfig = new SQLiteConfig();
    if (mode === 1) {
        sqlConfig.setReadOnly(true);
    }
    try {
        return sqlConfig.createConnection("jdbc:sqlite:" + url);//sample.db
    } catch (e) {
        console.error("创建或加载sqlite数据库时出错,具体异常:" + e);
    }
}

export class DBSession {
    /**
     * 打开一个数据库会话
     * @param type {String} 数据库的类型，目前仅支持"sqlite3"
     * @param obj {Object} 连接参数
     * @return {DBSession | Object} 打开的数据库会话对象 如果返回值为{}，则代表打开失败
     */
    constructor(type, obj) {
        type = type.toLocaleLowerCase();
        if (type === "sqlite3" || type === "sqlite") {
            this.database = new Sqlite(obj);
        } else return {};
    }

    /**
     * 执行SQL并获取结果集
     * @param sql {String} 要查询的SQL语句
     * @return {Array<Array>} 查询的结果(结果集)
     */
    query(sql) {
        return this.database.query(sql);
    }

    /**
     * @see execute
     */
    exec(sql) {
        this.execute(sql);
    }

    /**
     * 执行SQL但不获取结果
     * @param sql {String} 要执行的SQL语句
     * @return {DBSession} 处理完毕的会话对象（便于连锁进行其他操作）
     */
    execute(sql) {
        this.database.execute(sql);
    }

    /**
     * 获取当前会话是否为打开状态
     * @return {Boolean} 是否为打开状态
     */
    isOpen() {
        return this.database.isOpen();
    }

    /**
     * 关闭数据库会话
     * @return {Boolean} 关闭成功与否
     */
    close() {
        return this.database.close();
    }

    /**
     * 准备一个预准备语句
     * <p>—— 单个?表示参数,该参数对应索引值自增,无对应key</p>
     * <p>SELECT * FROM table WHERE id = ?;</p>
     * <p>—— ?NNN，其中NNN为索引值，用于指定该参数所在索引index(范围从1--32766)</p>
     * <p>—— 提示,?NNN绑定的索引值可以重复,这可以实现bind一个索引,修改多个参数的效果</p>
     * <p>INSERT INTO table VALUES (?2);</p>
     * <p>—— $X、:Y、@V都是带参数名(key)的参数,它们也有对应的index,其值是当前最大索引+1</p>
     * <p>—— @符号在其他SQL中可能存在特殊含义，建议避免使用@开头</p>
     * <p>—— $是用来支持Tcl变量的扩展语法,不推荐使用,若想绑定name建议使用冒号":"</p>
     * INSERT INTO table VALUES (?Y, :Z, @V);</p>
     * @param sql {String} 要准备的SQL语句
     * @return {DBStmt} 预准备语句，失败抛出错误
     */
    prepare(sql) {
        return this.database.prepare(sql);
    }
}

class Sqlite {
    constructor({path = "-", create = true, readonly = false, readwrite = true}) {
        Class.forName("org.sqlite.JDBC");//加载sqlite驱动
        let mode = 0;
        if (readonly === true && readwrite === false) mode = 1;
        if (create) {
            this.connection = createSqlite(path, mode);
        } else {
            const db = new JFile(path);
            if (db.exists()) {
                this.connection = createSqlite(path, mode);
            } else {
                console.error("指定的sqlite数据库不存在!");
                return {};
            }
        }
    }

    query(sql) {
        let result = [];
        try {
            var statement = this.connection.createStatement();
            let resultSet = statement.executeQuery(sql);
            let meta = resultSet.getMetaData();
            let title = [];
            let colCount = meta.getColumnCount();//列数
            //获取标题
            for (let i = 1, len = colCount; i <= len; ++i) {
                title.push(meta.getColumnName(i));
            }
            result.push(title);
            //获取数据
            while (resultSet.next()) {
                let col = [];
                for (let i = 1, length2 = colCount; i <= length2; ++i) {
                    col.push(resultSet.getObject(i));
                }
                result.push(col);
            }
        } catch (e) {
            console.error("执行sql语句时出错,具体异常:" + e);
        } finally {
            statement.close();
        }
        return result;
    }

    exec(sql) {
        return this.execute(sql);
    }

    execute(sql) {
        try {
            var statement = this.connection.createStatement();
            statement.execute(sql);
        } catch (e) {
            console.error("执行sql语句时出错,具体异常:" + e);
        } finally {
            statement.close();
        }
        return this;
    }

    isOpen() {
        return !this.connection.isClosed();
    }

    close() {
        DBStmt.statementArray.forEach((s) => {
            s.close();
        })
        this.connection.close();
        return this.connection.isClosed();
    }

    prepare(sql) {
        return new DBStmt(this.connection, sql);
    }
}

class DBStmt {
    static REG = new RegExp(/(?<=@|\?|\$|:).*?(?= |;|$|,|\))/, "gim");
    static statementArray = [];//暂存所有的语句用于最后清理close
    #affectedRows;//当查询语句时未定义
    #insertId;//当查询语句时未定义
    #result = [];
    #param2index = [];//一个存放参数数据的对象数组 {isbind:boolean,index:number,name:string},name是可选值
    #maxid = 1;//下一个分配的索引值
    #row = 1;
    #connection;

    /**
     * @param connection {Connection} sql连接对象
     * @param sql {String} sql预准备语句
     */
    constructor(connection, sql) {
        this.statement = connection.prepareStatement(sql);
        this.#connection = connection;
        DBStmt.statementArray.push(this.statement);
        let params = sql.match(DBStmt.REG);
        if (!isNull(params)) {
            params.forEach(s => {
                let data = {};
                data["isbind"] = false;
                if (s === "") {
                    data["index"] = this.#maxid++;
                } else if (!isNaN(s)) {
                    let num = Number(s);
                    data["index"] = num;
                    if (num > this.#maxid) this.#maxid = num + 1;
                } else if (isString(s)) {
                    data["name"] = s;
                    data["index"] = this.#maxid++;
                }
                this.#param2index.push(data);
            });
        }
    }

    get affectedRows() {
        return this.#affectedRows;
    }

    get insertId() {
        return this.#insertId;
    }

    /**
     * 绑定参数到一个SQL语句,参数组合如下:
     * <p>1.val {Any} 要绑定的值</p>
     * <p>2.obj {Object} 要绑定的对象，等同于遍历此对象并执行bind(val, key)</p>
     * <p>3.arr {Array} 要绑定的数组，等同于遍历此数组并执行bind(val)</p>
     * <p>4.(val, index) {Any,Integer} {要绑定的值 , 要绑定到的参数索引(从0开始)}</p>
     * <p>5.(val, name) {Any,String} {要绑定的值 , 要绑定到的参数的参数名}</p>
     * @param param {Any} 参数数组
     * @return {DBStmt} 处理完毕的语句对象（便于连锁进行其他操作）
     */
    bind(...param) {
        if (param.length === 1) {
            let p1 = param[0];
            //重载bind(obj)
            if (p1.constructor.name === "Object") {
                Object.keys(p1).forEach(key => {
                    this.bind(p1[key], key);
                });
            } else if (p1.constructor.name === "Array") {//重载bind(arr)
                for (let value of p1) {
                    this.bind(value);
                }
            } else {
                //重载bind(val)
                for (let i of this.#param2index) {
                    if (!i["isbind"]) {
                        this.statement.setObject(i["index"], p1);
                        i["isbind"] = true;
                        break;
                    }
                }
            }
        } else if (param.length === 2) {
            //重载bind(val, index)
            if (isNumber(param[1])) {
                let index = param[1] + 1;
                this.statement.setObject(index, param[0]);//为了适应LLSE index从0开始,这里+1,也就是说0代表第一个参数
                for (let i of this.#param2index) {
                    if (i["index"] === index) {
                        i["isbind"] = true;
                        break;
                    }
                }//重载bind(val, name)
            } else if (isString(param[1])) {
                for (let i of this.#param2index) {
                    if (!isUndefined(i["name"]) && i["name"] === param[1]) {
                        this.statement.setObject(i["index"], param[0]);
                        i["isbind"] = true;
                        break;
                    }
                }
            }
        }
        return this;
    }

    /**
     * 执行当前语句
     * @return {DBStmt} 处理完毕的语句对象（便于连锁进行其他操作）
     */
    execute() {
        try {
            if (this.statement.execute()) {
                let result = [];
                let resultSet = this.statement.getResultSet();
                let meta = resultSet.getMetaData();
                let title = [];
                let colCount = meta.getColumnCount();//列数
                //获取标题
                for (let i = 1, len = colCount; i <= len; ++i) {
                    title.push(meta.getColumnName(i));
                }
                result.push(title);
                //获取数据
                while (resultSet.next()) {
                    let col = [];
                    for (let i = 1, length2 = colCount; i <= length2; ++i) {
                        col.push(resultSet.getObject(i));
                    }
                    result.push(col);
                }
                this.#result = result;
            } else {
                this.#affectedRows = this.statement.getUpdateCount();
                this.#insertId = this.#connection.createStatement().executeQuery(`SELECT LAST_INSERT_ROWID();`).getObject(1);
            }
        } catch (e) {
            console.error("执行sql语句时出错,具体异常:" + e);
        }
        return this;
    }

    step() {
        return this.next();
    }

    next() {
        if (this.#row === this.#result.length - 1) return false;
        this.#row++;
        return true;
    }

    fetch() {
        let obj = {};
        let title = this.#result[0];
        let values = this.#result[this.#row];
        if (isUndefined(values)) return obj;
        for (let i = 0, len = title.length; i < len; ++i) {
            obj[title[i]] = values[i];
        }
        return obj;
    }

    fetchAll(callback) {
        if (isUndefined(callback)) {
            return this.#result;
        } else if (callback.constructor.name === "Function") {
            let subLen = this.#result[0].length;
            for (let i = 1, len = this.#result.length; i < len; ++i) {
                callback.apply(null, this.#result[i]);
            }
        }
    }

    reset() {
        this.#result = [];
        this.#row = 1;
        this.#affectedRows = undefined;
        this.#insertId = undefined;
        return this;
    }

    reexec() {
        return this.reset().execute();
    }

    clear() {
        this.statement.clearParameters();
        this.#maxid = 1;
        this.#param2index.forEach((k) => {
            k["isbind"] = false;
        })
        return this;
    }
}
