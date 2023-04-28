import * as IO from "./IO.js";
import { Job } from ":concurrent";
import { Paths } from "java.nio.file.Paths";
import { Files } from "java.nio.file.Files";
import { Nukkit } from "cn.nukkit.Nukkit";
import { Comparator } from 'java.util.Comparator'

export class File {
    /**
     * @param path {string} 文件路径
     * @param mode {string} 文件打开模式
     * @param isBinary {boolean} 是否为二进制文件
     */
    constructor(path, mode, isBinary = false) {
        if (typeof (mode) === 'number') {// Enum
            mode = [File.ReadMode, File.WriteMode, File.AppendMode][mode];
        }
        this._path = Paths.get(path);
        this._mode = mode;
        this._isBinary = isBinary;
        if (!IO.createRAF(this._path, mode)) {
            throw IO.getPreviousErr(this._path);
        }
    }

    /**
     * @returns {string}
     */
    get path() {
        return this._path.toString();
    }

    /**
     * @returns {string}
     */
    get absolutePath() {
        return this._path.toAbsolutePath();
    }

    /**
     * @returns {number}
     */
    get size() {
        return IO.getSize(this._path);
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
        for (const [job, available] of this.jobs.entries()) {
            if (available) {
                return job;
            }
        }
        const newJob = new Job(Nukkit.PLUGIN_PATH + "/@LLSELib/file/IO.js");
        this.jobs.set(newJob, true);
        return newJob;
    }

    /**
     * 创建文件夹
     * @param path {string} 目标文件夹的路径，相对路径以 PNX 根目录为基准
     * @returns {boolean} 是否成功创建
     */
    static createDir(path) {
        const _path = Paths.get(path);
        Files.createDirectories(_path);
        return Files.exists(_path);
    }

    /**
     * 创建文件夹
     * @see createDir(path)
     */
    static mkdir(path) {
        return File.createDir(path);
    }

    /**
     * 删除文件 / 空的文件夹
     * @param path {string} 路径，相对路径以 PNX 根目录为基准
     * @returns {boolean} 是否成功删除
     */
    static delete(path) {
        const _path = Paths.get(path);
        Files.delete(_path);
        return !Files.exists(_path);
    }

    /**
     * 删除文件夹及其下所有文件
     * @param folder {string} 文件夹的路径
     * @returns {boolean} 是否成功删除
     */
    static deleteFolder(folder) {
        const _path = Paths.get(folder);
        let result = true;
        let walk = Files.walk(_path)
        walk.sorted(Comparator.reverseOrder()).forEach((p) => {
            Files.delete(p)
            result = !Files.exists(p);
        });
        return result;
    }

    /**
     * 判断文件 / 文件夹是否存在
     * @param path {string} 路径，相对路径以 PNX 根目录为基准
     * @returns {boolean} 是否存在
     */
    static exists(path) {
        const _path = Paths.get(path);
        return Files.exists(_path);
    }

    /**
     * 复制文件 / 文件夹
     * @param from {string} 源文件 / 文件夹的路径
     * @param to {string} 目标文件 / 文件夹的路径
     * @returns {boolean} 是否成功复制
     */
    static copy(from, to) {
        const _from = Paths.get(from);
        const _to = Paths.get(to);
        Files.copy(_from, _to);
        return Files.exists(_to);
    }

    /**
     * 移动文件 / 文件夹到指定位置
     * @param from {string} 源文件 / 文件夹的路径
     * @param to {string} 目标文件 / 文件夹的路径
     * @returns {boolean} 是否成功移动
     */
    static move(from, to) {
        const _from = Paths.get(from);
        const _to = Paths.get(to);
        Files.move(_from, _to);
        return (!Files.exists(_from) && Files.exists(_to));
    }

    /**
     * 重命名指定文件 / 文件夹
     * @param from {string} 源文件 / 文件夹的路径
     * @param to {string} 目标文件 / 文件夹的路径
     * @returns {boolean} 是否成功重命名
     */
    static rename(from, to) {
        return File.move(from, to);
    }

    /**
     * 获取指定文件的大小
     * @param path {string} 所操作的文件路径
     * @returns {number} 文件的大小（字节）
     */
    static getFileSize(path) {
        const _path = Paths.get(path);
        return Files.size(_path);
    }

    /**
     * 判断指定路径是否是文件夹
     * @param path {string} 所判断的路径
     * @returns {boolean} 是否是文件夹
     */
    static checkIsDir(path) {
        const _path = Paths.get(path);
        return Files.isDirectory(_path);
    }

    /**
     * 列出指定文件夹下的所有文件 / 文件夹
     * @param path {string} 文件夹路径
     * @returns {array} 文件名、文件夹名数组
     */
    static getFilesList(path) {
        let arr = [];
        const paths = Files.walk(Paths.get(path));
        paths.forEach((v, i) => {
            arr.push(Paths.get(v.toString()).getFileName().toString())
        });
        arr.shift();// 第一个是当前文件夹的名字
        return arr;
    }

    /**
     * 读入文件的所有内容
     * @param path {string} 目标文件的路径，相对路径以 PNX 根目录为基准
     * @returns {string|null} 返回null表示读取失败
     */
    static readFrom(path) {
        const _path = Paths.get(path);
        if (!Files.exists(_path)) {
            return null;
        }
        if (IO.createRAF(_path)) {
            const content = IO.readAllText(_path);
            IO.close(_path);
            return content;
        }
        return null;
    }

    /**
     * 向指定文件写入内容
     * 若文件不存在会自动创建，若存在则会先将其清空再写入
     * @param path {string} 目标文件的路径，相对路径以 PNX 根目录为基准
     * @param text {string} 要写入的内容
     * @returns {boolean} 是否成功
     */
    static writeTo(path, text) {
        const _path = Paths.get('.', path);
        try {
            if (!Files.exists(_path)) {// 判断是否存在，若不存在则创建
                if (!Files.exists(_path.getParent())) {
                    Files.createDirectories(_path.getParent());
                }
                Files.createFile(_path);
            }
        } catch (err) {
            return false;
        }
        if (IO.createRAF(_path)) {
            IO.resize(_path, 0);
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
            let size = IO.getSize(_path);
            if (size === 0) {
                IO.writeText(_path, text + "\n");
            } else if (size > 0) {
                IO.seekTo(_path, IO.getPointerPos(_path) + size, true);
                IO.writeText(_path, text + "\n");
            }
            return true;
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
            () => tmpJob.work(this._isBinary ? 3 : 0, this._path, cnt).then(value => {
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
            () => tmpJob.work(1, this._path).then(value => {
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
     * @param callback {(result: string|SharedArrayBuffer) => void} 获取结果的回调函数
     * @returns {Promise<string|SharedArrayBuffer|null>} 读取到的文本 / 二进制数据
     */
    readAll(callback) {
        const tmpJob = File.requestJob();
        File.jobs.set(tmpJob, false);
        return tmpJob.work(-1, this._path, this._mode).then(
            () => tmpJob.work(this._isBinary ? 4 : 2, this._path, this._mode).then(value => {
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
            () => tmpJob.work(this._isBinary ? 6 : 5, this._path, str).then(value => {
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
            () => tmpJob.work(7, this._path, str).then(value => {
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
     * 关闭文件
     * @returns {boolean}
     */
    close() {
        return IO.close(this._path);
    }

    /**
     * 关闭并清理文件
     * @returns {boolean}
     */
    clear() {
        IO.close(this._path);
        Files.delete(this._path);
        return !Files.exists(this._path);
    }
}
