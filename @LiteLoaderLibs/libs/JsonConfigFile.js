import { File } from './File.js'
import { File as JFile } from 'java.io.File'


/**
 * @todo 应当改为缓存数据至内存，而非每次都从磁盘读取
 */
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
		var obj = this._data
		obj[name] = data;
		this._data = obj;
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
		var obj = this._data
		delete obj[name];
		this._data = obj;
		return true;
	}
	// 💼 配置文件通用方法
	/**
	 * 重新加载文件中的配置项
	 * 当你确定文件被其它方法修改时，使用本方法更新缓存在内存的数据
	 * @todo 待实现
	 * @returns {boolean} 是否成功
	 */
	reload() {
		return true;
	}
	/**
	 * 关闭配置文件，关闭后请勿继续使用
	 * @todo 待实现
	 * @returns {boolean} 是否成功
	 */
	close() {
		return true;
	}
	/**
	 * 获取配置文件路径
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
	 * @param content {string} 内容
	 * @returns {boolean} 是否成功
	 */
	write(content) {
		return File.writeTo(this._path, content);
	}
}