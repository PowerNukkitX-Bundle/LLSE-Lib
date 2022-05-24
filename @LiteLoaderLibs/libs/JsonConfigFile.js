import { File } from './File.js'
import { File as JFile } from 'java.io.File'


export class JsonConfigFile {
	/**
	 * @param path {string} 配置文件所在路径，以 PNX 根目录为基准
	 * @param [defaultContext='{}'] {string} 如果初始化时目标文件不存在，则新建一个配置文件并将此处的默认内容写入文件中。
	 */
	constructor (path, defaultContext = '{}') {
		if (!new JFile(path).exists()) {// 文件不存在
			File.writeTo(path, defaultContext);
		}
		this._path = path;
	}
	/**
	 * 获取数据
	 * @returns {object}
	 */
	get _data() {
		const data = File.readFrom(this._path);
		if (typeof(data) != 'string') {
			return {};
		}
		return JSON.parse(data);
	}
	/**
	 * 设置数据
	 */
	set _data(obj) {
		File.writeTo(this._path, JSON.stringify(obj));
	}
	/**
	 * 初始化配置项
	 * @param name {string} 配置项名字
	 * @param [defaultContext=null] {any} 配置项初始化时写入的值
	 * @returns {any}
	 */
	init(name, defaultContext = null) {
		var data = this._data;
		if (!data?.[name]) {
			data[name] = defaultContext;
			this._data = data;
		}
		return data[name];
	}
	/**
	 * 写入配置项
	 * @param name {string} 配置项名字
	 * @param data {any} 要写入的配置数据
	 * @returns {boolean} 是否写入成功
	 */
	set(name, data) {
		this._data[name] = data;
		return true;
	}
	/**
	 * 读取配置项
	 * @param name {string} 配置项名字
	 * @param [defaultContext=null] {any} 当读取失败时返回的默认值
	 * @returns {any}
	 */
	get(name, defaultContext = null) {
		return this._data[name] === undefined ? defaultContext : this._data[name];
	}
	/**
	 * 删除配置项
	 * @param name {string} 配置项名字
	 * @returns {boolean} 是否成功
	 */
	delete(name) {
		delete this._data[name];
		return true;
	}
}