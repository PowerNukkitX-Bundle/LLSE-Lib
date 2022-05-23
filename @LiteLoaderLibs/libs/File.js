import * as IO from "../utils/IO.js";
import { Job } from ":concurrent";
import { Paths } from "java.nio.file.Paths";

export class File {
	/**
	 * @param path {string} 文件路径
	 * @param mode {string} 文件打开模式
	 * @param isBinary {boolean} 是否为二进制文件
	 */
	constructor (path, mode, isBinary = false) {
		this._path = Paths.get(path);
		this._mode = mode;
		this._isBinary = isBinary;
		if (!IO.createRAF(this._path, mode)) {
			throw IO.getPreviousErr(this._path);
		}
	}

	static ReadMode = "r";
	static WriteMode = "rw";
	static AppendMode = "rws";

	/**
	 * @type {Map<Job, boolean>}
	 */
	static jobs = new Map();

	/**
	 * @returns {Job}
	 */
	static requestJob() {
		for (const [job, available] of this.jobs.entries) {
			if (available) {
				return job;
			}
		}
		const newJob = new Job("utils/IO.js");
		this.jobs.set(newJob, true);
		return newJob;
	}

	/**
	 * @param path {string} 文件的路径
	 */
	static readFrom(path) {
		const _path = Paths.get(path);
		if (IO.createRAF(_path)) {
			const content = IO.readAllText(_path);
			IO.close(_path);
			return content;
		}
		return null;
	}
	/**
	 * @param path {string}
	 * @param text {string}
	 */
	static writeTo(path, text) {
		const _path = Paths.get(path);
		if (IO.createRAF(_path)) {
			if (IO.writeText(_path, text)) {
				IO.close(_path);
				return true;
			}
		}
		return false;
	}
	/**
	 * 向指定文件追加一行
	 * @param path {string}
	 * @param text {string}
	 */
	static writeLine(path, text) {
		const _path = Paths.get(path);
		if (IO.createRAF(_path)) {
			if (IO.seekTo(_path, IO.getSize(_path) - 1, false) && IO.writeText(_path, text + "\n")) {
				IO.close(_path);
				return true;
			}
		}
		return false;
	}
	/**
	 * @param cnt {number}
	 */
	readSync(cnt) {
		return this._isBinary ? IO.readBuffer(this._path, cnt) : IO.readText(this._path, cnt);
	}
	readLineSync() {
		return IO.readLine(this._path);
	}
	readAllSync() {
		return this._isBinary ? IO.readAllBuffer(this._path) : IO.readAllText(this._path);
	}
	/**
	 * @param str {String|ByteBuffer}
	 */
	writeSync(str) {
		if (typeof str === "string") {
			return IO.writeText(this._path, str);
		} else if (this._isBinary) {
			return IO.writeBuffer(this._path, str);
		}
		return false;
	}
	/**
	 * @param str {string}
	 */
	writeLineSync(str) {
		return IO.writeLine(this._path, str);
	}
	/**
	 * @param cnt {number} 要读取的字符数 / 字节数
	 * @param callback {(result: string|SharedArrayBuffer) => void} 获取结果的回调函数
	 * @returns {Promise<string|SharedArrayBuffer>}
	 */
	read(cnt, callback) {
		/*
		参数：
			cnt : Number
			要读取的字符数 / 字节数
			callback : Function
			获取结果的回调函数
		返回值：是否成功发送请求
		返回值类型：Boolean
		注：参数 callback 的回调函数原型：function(result)
			result : String / ByteBuffer
			读取到的文本 / 二进制数据
		如 result 为 Null 则表示读取失败
		从当前文件指针处开始读取。如果文件以二进制模式打开，则返回 ByteBuffer，否则返回 String
		*/
		const tmpJob = File.requestJob();
		File.jobs.set(tmpJob, false);

		return tmpJob.work(-1, this._path, this._mode).then(
			() => tmpJob.work(this._isBinary ? 3 : 0, cnt).then(value => {
				if (callback) callback(value);
				File.jobs.set(tmpJob, true);
				return Promise.resolve(value);
			}, err => {
				if (callback) callback(null);
				File.jobs.set(tmpJob, true);
				return Promise.reject(err);
			})
		)
	}
	/**
	 * @param callback {(result: string|SharedArrayBuffer) => void}
	 * @returns {Promise<string>}
	 */
	readLine(callback) {
		/*
		参数：
			callback : Function
			获取结果的回调函数
		返回值：是否成功发送请求
		返回值类型：Boolean
		注：参数 callback 的回调函数原型：function(result)
			result : String
			读取到的文本
		注意，字符串尾部的换行符要自行处理
		*/
		const tmpJob = File.requestJob();
		File.jobs.set(tmpJob, false);
		return tmpJob.work(-1, this._path, this._mode).then(
			() => tmpJob.work(1).then(value => {
				if (callback) callback(value);
				File.jobs.set(tmpJob, true);
				return Promise.resolve(value);
			}, err => {
				if (callback) callback(null);
				File.jobs.set(tmpJob, true);
				return Promise.reject(err);
			})
		)
	}
	/**
	 * @param callback {(result: string|SharedArrayBuffer) => void}
	 * @returns {Promise<string|SharedArrayBuffer>}
	 */
	readAll(callback) {
		/*
		参数：
		callback : Function
		获取结果的回调函数
		返回值：是否成功发送请求
		返回值类型：Boolean
		注：参数 callback 的回调函数原型：function(result)

		result : String / ByteBuffer
		读取到的文本 / 二进制数据
		如 result 为 Null 则表示读取失败
		*/
		const tmpJob = File.requestJob();
		File.jobs.set(tmpJob, false);
		return tmpJob.work(-1, this._path, this._mode).then(
			() => tmpJob.work(this._isBinary ? 4 : 2).then(value => {
				if (callback) callback(value);
				File.jobs.set(tmpJob, true);
				return Promise.resolve(value);
			}, err => {
				if (callback) callback(null);
				File.jobs.set(tmpJob, true);
				return Promise.reject(err);
			})
		)
	}
	/**
	 * @param callback {(result: string|SharedArrayBuffer) => void}
	 * @returns {Promise<boolean>}
	 */
	async write(str, callback) {
		/*
		参数：
			str : String / ByteBuffer
			要写入的内容
			callback : Function
			（可选参数）获取结果的回调函数
		返回值：是否成功发送请求
		返回值类型：Boolean
		如果文件以二进制模式打开，请传入一个 ByteBuffer，否则需要传入 String
		注：参数 callback 的回调函数原型：function(result)
			result : Boolean
			是否写入成功
		*/
		const tmpJob = File.requestJob();
		File.jobs.set(tmpJob, false);
		return tmpJob.work(-1, this._path, this._mode).then(
			() => tmpJob.work(this._isBinary ? 6 : 5, str).then(value => {
				if (callback) callback(value);
				File.jobs.set(tmpJob, true);
				return Promise.resolve(value);
			}, err => {
				if (callback) callback(null);
				File.jobs.set(tmpJob, true);
				return Promise.reject(err);
			})
		)
	}
	/**
	 * @param callback {(result: string|SharedArrayBuffer) => void}
	 * @returns {Promise<boolean>}
	 */
	async writeLine(str, callback) {
		/*
		参数：
			str : String
			要写入的内容
			callback : Function
			（可选参数）获取结果的回调函数
		返回值：是否成功发送请求
		返回值类型：Boolean
		注：参数 callback 的回调函数原型：function(result)
			result : Boolean
			是否写入成功
		此函数执行时，将在字符串尾自动添加换行符
		*/
		const tmpJob = File.requestJob();
		File.jobs.set(tmpJob, false);
		return tmpJob.work(-1, this._path, this._mode).then(
			() => tmpJob.work(7, str).then(value => {
				if (callback) callback(value);
				File.jobs.set(tmpJob, true);
				return Promise.resolve(value);
			}, err => {
				if (callback) callback(null);
				File.jobs.set(tmpJob, true);
				return Promise.reject(err);
			})
		)
	}
}
