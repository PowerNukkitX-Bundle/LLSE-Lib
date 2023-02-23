import { server } from '../utils/util.js';
import { Plugin } from "../object/Plugin.js";

/**
 * 向加载器提供一些插件相关的信息
 *
 * @param {string} name 插件名字
 * @param {string} introduction 对插件的简短介绍 Null
 * @param {Array<number,number,number>} version 插件的版本信息
 * @param {Object} other 其他你愿意提供的的附加信息（如许可证、开源地址等）传入键值对
 */
function registerPlugin(name, introduction, version, other) {
    //不实现，仅保留维持兼容性
}

/**
 * 导出函数
 * @param {function} func 要导出的函数
 * @param {string} namespace 函数的命名空间名，只是方便用于区分不同插件导出的 API
 * @param {string} [name] 函数的导出名称。其他插件根据导出名称来调用这个函数
 * @returns {boolean} 是否成功导出
 */
function funcExport(func, namespace, name) {
    let key = namespace + ":" + name;
    exposeFunction(key, func);
    return Boolean(contain(key));
}

/**
 * 导入函数
 * @param {string} namespace 函数的命名空间名
 * @param {string} name 要导入的函数使用的导出名称
 * @returns {function|null} 导入的函数
 */
function funcImport(namespace, name) {
    let key = namespace + ":" + name;
    return contain(key);
}

/**
 * 判断远程函数是否已导出
 * @todo 测试
 * @param {string} namespace 函数的命名空间名
 * @param {string} name 要导入的函数使用的导出名称
 * @returns {boolean} 函数是否已导出
 */
function hasExported(namespace, name) {
    let key = namespace + ":" + name;
    return Boolean(contain(key));
}

/**
 * 获取插件列表
 * @returns {Array<string>} 返回数组，包含插件名
 */
function listPlugins() {
    var list = [];
    var plugins = server.getPluginManager().getPlugins();
    for (let plugin of plugins.values()) {// plugin.isEnabled()
        list.push(plugin.getDescription().getFullName());
    }
    return list;
}

function require() {
    //不实现，仅保留维持兼容性
}

/**
 * 检查 LiteLoaderBDS 版本
 *
 * @param {int} major 检查当前已安装LiteLoaderBDS的主版本号是否 >= 此值
 * @param {?int} minor 检查当前已安装LiteLoaderBDS的次版本号是否 >= 此值
 * @param {?int} revision 检查当前已安装LiteLoaderBDS的修订版本号是否 >= 此值
 * @returns {boolean} 检查结果
 */
function requireVersion(major, minor = -1, revision = -1) {
    if (this.major < major) return false;
    if (this.minor < minor) return false;
    return this.revision >= revision;
}

/**
 * 获取有关插件的信息
 *
 * @param {string} name 插件名称
 * @returns {Plugin}  插件对象
 */
function getPluginInfo(name) {
    let p = server.getPluginManager().getPlugin(name);
    if (p === null) return p;
    return new Plugin(p);
}

/**
 * 列出所有加载的插件信息
 *
 * @returns {Plugin[]}  插件对象
 */
function getAllPluginInfo(name) {
    let p = server.getPluginManager().getPlugins().values();
    let result = [];
    for (let plugin of p) {
        result.push(new Plugin(plugin));
    }
    return result;
}

/**
 * 将字符串作为脚本代码执行
 *
 * @param {string} str 要作为脚本代码执行的字符串
 * @returns {any}  执行结果
 */
function llEval(str) {
    return eval(str);
}


export const ll = {
    language: server.getLanguageCode().toString(),
    major: 2,
    minor: 10,
    revision: 1,
    status: 2,
    scriptEngineVersion: "",
    isWine: false,
    isDebugMode: false,
    isBeta: false,
    isDev: false,
    isRelease: true,
    versionString: "2.10.1",
    requireVersion: requireVersion,
    registerPlugin: registerPlugin,
    getPluginInfo: getPluginInfo,
    getAllPluginInfo: getAllPluginInfo,
    export: funcExport,
    import: funcImport,
    require: require,
    hasExported: hasExported,
    listPlugins: listPlugins,
    eval: llEval
}
