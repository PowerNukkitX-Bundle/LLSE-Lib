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

export const ll = {
	registerPlugin: registerPlugin
}