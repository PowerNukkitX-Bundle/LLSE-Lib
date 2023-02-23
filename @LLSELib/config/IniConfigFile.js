import { File } from '../file/File.js'
import { INIUtil } from './INIUtil.js'
import { File as JFile } from 'java.io.File'

export class IniConfigFile {
    /**
     * @param {string} path 配置文件所在路径，以 PNX 根目录为基准
     * @param {string} [defaultContext='{}'] 如果初始化时目标文件不存在，则新建一个配置文件并将此处的默认内容写入文件中。
     */
    constructor(path, defaultContext = '') {
        if (!new JFile(path).exists()) {// 文件不存在
            File.writeTo(path, defaultContext);
        }
        this._path = path;
        this._content = File.readFrom(this._path);// 缓存文件内容
    }

    /**
     * 获取数据
     * @returns {object}
     */
    get _data() {
        if (!this._path) {
            return null;
        }
        if (typeof (this._content) != 'string') {
            return {};
        }
        return INIUtil.parse(this._content);
    }

    /**
     * 设置数据
     */
    set _data(obj) {
        this._content = INIUtil.stringify(obj);
        File.writeTo(this._path, INIUtil.stringify(obj));
    }

    /**
     * 初始化配置项
     * @param {string} section 配置项键名
     * @param {string} name 配置项名字
     * @param {any} [defaultContext=null] 配置项初始化时写入的值
     * @returns {any}
     */
    init(section, name, defaultContext = null) {
        var data = this._data;
        if (!data?.[name]) {
            this.set(section, name, defaultContext);
        }
        return data[name];
    }

    /**
     * 写入配置项
     * @param {string} section 配置项键名
     * @param {string} name 配置项名字
     * @param {any} data 要写入的配置数据
     * @returns {boolean} 是否写入成功
     */
    set(section, name, data) {
        var obj = this._data;
        if (section.length === 0) {
            obj[name] = data;
            this._data = obj;
            return true;
        }
        var current = obj;
        var sectionList = section.split('.');
        for (let i = 0, len = sectionList.length; i < len; i++) {
            if (typeof (current[sectionList[i]]) != 'object') {
                current[sectionList[i]] = {};
            }
            current = current[sectionList[i]]
        }
        current[name] = data;
        this._data = obj;
        return true;
    }

    /**
     * 读取配置项
     * @pnxonly
     * @param {string} section 配置项键名
     * @param {string} name 配置项名字
     * @param {any} [defaultContext=null] 当读取失败时返回的默认值
     * @returns {string|number|boolean}
     */
    get(section, name, defaultContext = null) {
        var obj = this._data;
        if (section.length === 0) {
            return obj[name] === undefined ? defaultContext : obj[name];
        }
        var current = obj;
        var sectionList = section.split('.');
        for (let i = 0, len = sectionList.length; i < len; i++) {
            if (typeof (current[sectionList[i]]) != 'object') {
                return defaultContext;
            }
            current = current[sectionList[i]]
        }
        return current[name] === undefined ? defaultContext : current[name];
    }

    /**
     * 读取字符串
     * @see get
     */
    getStr(section, name, defaultContext = '') {
        return this.get(section, name, defaultContext);
    }

    /**
     * 读取整数项
     * @see get
     */
    getInt(section, name, defaultContext = 0) {
        return this.get(section, name, defaultContext);
    }

    /**
     * 读取浮点数
     * @see get
     */
    getFloat(section, name, defaultContext = 0.0) {
        return this.get(section, name, defaultContext);
    }

    /**
     * 读取布尔值
     * @see get
     */
    getBool(section, name, defaultContext = false) {
        return this.get(section, name, defaultContext);
    }

    /**
     * 删除配置项
     * @param {string} section 配置项键名
     * @param {string} name 配置项名字
     * @returns {boolean} 是否成功
     */
    delete(section, name) {
        var obj = this._data;
        if (section.length === 0) {
            delete obj[name];
            return true;
        }
        var current = obj;
        var sectionList = section.split('.');
        for (let i = 0, len = sectionList.length; i < len; i++) {
            if (typeof (current[sectionList[i]]) != 'object') {
                return false;
            }
            current = current[sectionList[i]]
        }
        if (Object.keys(current).length === 0) {// 删除空对象
            var current = obj;
            for (let i = 0, len = sectionList.length - 1; i < len; i++) {
                current = current[sectionList[i]]
            }
            delete current[sectionList[sectionList.length - 1]];
            this._data = obj;
            return true;
        }
        delete current[name];
        // console.log(obj);
        this._data = obj;
        return true;
    }

    // 💼 配置文件通用方法
    /**
     * 重新加载文件中的配置项
     * 当你确定文件被其它方法修改时，使用本方法更新缓存在内存的数据
     * @returns {boolean} 是否成功
     */
    reload() {
        if (!this._path) {
            return false;
        }
        this._content = File.readFrom(this._path);
        return true;
    }

    /**
     * 关闭配置文件，关闭后请勿继续使用
     * @returns {boolean} 是否成功
     */
    close() {
        if (!this._path) {
            return false;
        }
        this._path = null;
        this._content = null;
        return true;
    }

    /**
     * 获取配置文件路径(相对于PNX根目录)
     * @returns {string}
     */
    getPath() {
        return this._path;
    }

    /**
     * 读取整个配置文件的内容
     * @returns {boolean} 是否成功
     */
    read() {
        return File.readFrom(this._path);
    }

    /**
     * 写入整个配置文件的内容
     * @param {string} content 内容
     * @returns {boolean} 是否成功
     */
    write(content) {
        return File.writeTo(this._path, content);
    }
}
