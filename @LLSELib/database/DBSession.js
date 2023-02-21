import { File as JFile } from "java.io.File";
import { Paths } from "java.nio.file.Paths";
import { Files } from "java.nio.file.Files";
import { isEmpty, isNull, isNumber, isString, isUndefined } from '../utils/underscore-esm-min.js';
import { IllegalArgumentError } from '../error/IllegalArgumentError.js';
import { Connection } from 'java.sql.Connection';
import { download, onlyOnceExecute } from '../utils/util.js';
import { loadJar } from ':jvm';

if (!contain('DBSession')) exposeObject('DBSession', new Map());
export const DBSessionMap = contain('DBSession');

export class DBSession {
    static id = "3ADD4ABD-A7F3-B60C-F9AD-97445917339A";

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
        return this.execute(sql);
    }

    /**
     * 执行SQL但不获取结果
     * @param sql {String} 要执行的SQL语句
     * @return {DBSession} 处理完毕的会话对象（便于连锁进行其他操作）
     */
    execute(sql) {
        this.database.execute(sql);
        return this;
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
    constructor({ path = "-", create = true, readonly = false, readwrite = true }) {
        // Class.forName("org.sqlite.JDBC");//加载sqlite驱动
        let mode = 0;
        if (readonly === true && readwrite === false) mode = 1;
        const db = new JFile(path);
        this._path = db.getCanonicalPath();
        if (create) {
            Files.createDirectories(Paths.get(path).getParent());// 创建目录
            if (!DBSessionMap.has(this._path)) {
                DBSessionMap.set(this._path, this.createSqlite(path, mode));
            }
            this.connection = DBSessionMap.get(this._path);
        } else {
            if (db.exists()) {
                if (!DBSessionMap.has(this._path)) {
                    DBSessionMap.set(this._path, this.createSqlite(path, mode));
                }
                this.connection = DBSessionMap.get(this._path);
            } else {
                console.error("指定的sqlite数据库不存在!");
                return {};
            }
        }
    }

    /**
     * @private
     */
    createSqlite(url, mode) {
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
            console.error(sql);
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
            console.error(sql);
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
        DBSessionMap.delete(this._path);
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
     * <p>4.(val, index) {Any,Integer} {要绑定的值 , 要绑定到的参数索引(从0开始,这里让人非常难受,因为数据库Sql语句中指定位置是从1开始)}</p>
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
            console.error(sql);
            console.error("执行sql语句时出错,具体异常:" + e);
        }
        return this;
    }

    /**
     * @see next
     */
    step() {
        return this.next();
    }

    /**
     * 步进到下一行结果
     * @return {Boolean} 执行成功与否
     */
    next() {
        if (this.#row === this.#result.length - 1) return false;
        this.#row++;
        return true;
    }

    /**
     * 获取当前结果行(初始在第一行)
     * @return {Object} 当前结果行，形如{col1: "value", col2: 2333}
     */
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

    /**
     * 获取所有结果行
     * @param callback {any | function} 回调函数，用于遍历结果行；在回调函数中返回false可终止遍历
     * @return {Array<Array> | DBStmt} <p>查询的结果(结果集),详见执行{@link Sqlite#query 执行SQL并获取结果集}<p>处理完毕的语句对象（便于连锁进行其他操作）
     */
    fetchAll(callback) {
        if (isUndefined(callback)) {
            return this.#result;
        } else if (callback.constructor.name === "Function") {
            let subLen = this.#result[0].length;
            for (let i = 1, len = this.#result.length; i < len; ++i) {
                if (callback.apply(null, this.#result[i]) === false) {
                    break;
                }
            }
            return this;
        }
    }

    /**
     * 重置当前语句状态至“待执行”
     * @return {DBStmt} 处理完毕的语句对象（便于连锁进行其他操作）
     */
    reset() {
        this.#result = [];
        this.#row = 1;
        this.#affectedRows = undefined;
        this.#insertId = undefined;
        return this;
    }

    /**
     * 重新执行预准备语句
     * @return {DBStmt} 处理完毕的语句对象（便于连锁进行其他操作）
     */
    reexec() {
        return this.reset().execute();
    }

    /**
     * 清除所有已绑定的参数
     * @return {DBStmt} 处理完毕的语句对象（便于连锁进行其他操作）
     */
    clear() {
        this.statement.clearParameters();
        this.#maxid = 1;
        this.#param2index.forEach((k) => {
            k["isbind"] = false;
        })
        return this;
    }
}

const fileName = "sqlite-jdbc-3.39.2.0.jar";
const folder = "libs";
const file = new JFile(folder, fileName);
onlyOnceExecute(() => {
    download("https://res.nullatom.com/file/maven/" + fileName, folder, fileName);
}, DBSession.id);

let SQLiteConfig;
loadJar(file.getPath());
try {
    SQLiteConfig = Java.type('org.sqlite.SQLiteConfig');
} catch (err) {
    onlyOnceExecute(() => {
        console.error("载入sqlite依赖库失败,具体异常:" + err);
    }, "CA30DD03-16D3-449C-7290-A385DC0780DC");
}