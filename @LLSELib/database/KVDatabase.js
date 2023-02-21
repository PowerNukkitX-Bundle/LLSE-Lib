import { Options } from 'org.iq80.leveldb.Options';
import { Iq80DBFactory } from 'org.iq80.leveldb.impl.Iq80DBFactory';
import { File as JFile } from 'java.io.File';

const bytes = Iq80DBFactory.bytes;
const asString = Iq80DBFactory.asString;
const factory = Iq80DBFactory.factory;


export class KVDatabase {
    /**
     * 创建 / 打开一个键值对数据库
     * @param dir {String} 数据库的储存目录路径，以PNX根目录为基准
     * @return {KVDatabase | Object} 打开 / 创建的数据库对象,如果返回值为一个空对象则代表创建 / 打开失败
     */
    constructor(dir) {
        const opt = new Options();
        opt.createIfMissing(true);
        let file = new JFile(dir);
        try {
            this.db = factory.open(file, opt);
        } catch (e) {
            console.error(e.toString());
            return {};
        }
    }

    /**
     * 写入数据项
     * @param name {String} 数据项名字
     * @param data {any} 打开 / 创建的数据库对象
     * @return {Boolean} 是否写入成功
     */
    set(name, data) {
        try {
            this.db.put(bytes(name), bytes(JSON.stringify(data)));
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * 读取数据项
     * @param name {String} 数据项名字
     * @return {any} 数据库中储存的这个项的数据
     */
    get(name) {
        try {
            return JSON.parse(asString(this.db.get(bytes(name))));
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    /**
     * 删除数据项
     * @param name {String} 数据项名字
     * @return {boolean} 是否成功删除
     */
    delete(name) {
        try {
            this.db.delete(bytes(name));
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * 获取所有数据项名字
     * @return {Array} 所有的数据项名字数组
     */
    listKey() {
        let list = [];
        try {
            let iterator = this.db.iterator();
            try {
                for (iterator.seekToFirst(); iterator.hasNext(); iterator.next()) {
                    list.push(asString(iterator.peekNext().getKey()));
                }
            } finally {
                // Make sure you close the iterator to avoid resource leaks.
                iterator.close();
            }
        } catch (e) {
            console.error(e);
            return [];
        }
        return list;
    }

    /**
     * 关闭数据库
     * @return {boolean} 是否成功关闭,数据库关闭之后，请勿继续使用这个对象！
     */
    close() {
        this.db.close();
        return true;
    }
}