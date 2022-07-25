import {Server} from 'cn.nukkit.Server';

const server = Server.getInstance();

/**
 * 向加载器提供一些插件相关的信息
 * @todo 待实现
 * @param name {string} 插件名字
 * @param introduction {string} 对插件的简短介绍 Null
 * @param version {Array<number,number,number>} 插件的版本信息
 * @param other {Object} 其他你愿意提供的的附加信息（如许可证、开源地址等）传入键值对
 */
function registerPlugin(name, introduction, version, other) {
    // 用于更新 plugin.yml 信息
}

/**
 * 导出函数
 * @todo 待实现
 * @param func {function} 要导出的函数
 * @param namespace {string} 函数的命名空间名，只是方便用于区分不同插件导出的 API
 * @param [name] {string} 函数的导出名称。其他插件根据导出名称来调用这个函数
 * @returns {boolean} 是否成功导出
 */
function funcExport(func, namespace, name) {
    if (!name) {
        name = namespace;
    }
    exposeFunction(namespace, func);
    return Boolean(contain(namespace));
}

/**
 * 导入函数
 * @todo 待实现
 * @param name {string} 要导入的函数使用的导出名称
 * @returns {function|null} 导入的函数
 */
function funcImport(namespace, name) {
    if (!name) {
        name = namespace;
    }
    return contain(namespace);
}

/**
 * 获取插件列表
 * @returns {Array<string,...>} 返回数组，包含插件名
 */
function listPlugins() {
    var list = [];
    var plugins = server.getPluginManager().getPlugins();
    for (let plugin of plugins.values()) {// plugin.isEnabled()
        list.push(plugin.getDescription().getFullName());
    }
    return list;
}

export const ll = {
    registerPlugin,
    export: funcExport,
    import: funcImport,
    listPlugins
}
