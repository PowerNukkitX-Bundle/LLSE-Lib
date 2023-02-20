import { File } from '../file/File.js';
import { Paths } from 'java.nio.file.Paths';
import { Locale } from 'java.util.Locale';

const Alphabet = 'abcdefghijklnmopqrstuvwxyz'.split('');
const langMap = new Map();

export class i18n {
    /**
     * 加载翻译数据
     * @param path {string} 配置文件所在路径，以 PNX 根目录为基准
     * @param defaultLocaleName {string} 默认的语言名称，形如zh_CN或en（如果没有提供目标语言给i18n.tr或i18n.get的翻译，这个参数将被使用）
     若传入空字符串，则默认跟随系统语言
     * @param defaultLangData {string|object} 该参数将用于补全或创建翻译文件
     */
    static load(path, defaultLocaleName, defaultLangData) {// TODO: 同一个插件应该共享同一个langMap
        if (!File.exists(path)) {
            let filePath = path;
            if (File.checkIsDir(path) || path.endsWith("/") || !path.toLocaleLowerCase().endsWith(".json")) {
                File.createDir(path);
                filePath = Paths.get(path, defaultLocaleName ? defaultLocaleName + '.json' : 'lang.json').toString();
            }
            File.writeTo(filePath, typeof (defaultLangData) === 'string' ? defaultLangData : JSON.stringify(defaultLangData, null, 2));
        }
        const locale = Locale.getDefault();
        const localeCode = locale.getLanguage() + '_' + locale.getCountry();
        langMap.set('', defaultLocaleName || localeCode);
        if (File.checkIsDir(path)) {
            let dirList = File.getFilesList(path);
            for (let name of dirList) {
                if (File.checkIsDir(Paths.get(path, name).toString())) continue;
                readConfig(File.readFrom(Paths.get(path, name).toString()), name.split('.')[0]);
            }
        } else {
            readConfig(File.readFrom(path));
        }
    }

    /**
     * 加载翻译数据
     * @param key {string} 文本或ID
     * @param localeName {string} 目标语言，默认为i18n.load时传入的defaultLocaleName
     若传入空字符串，则默认跟随系统语言
     * @returns {string} 翻译内容（若经过多次回落仍未找到翻译，则返回key）
     */
    static get(key, localeName) {
        let localeCode = localeName || langMap.get('');
        if (!localeCode) throw 'plase use i18n#load befor.';
        let langData = langMap.get(localeCode);
        if (!langData) {
            langData = langMap.get(localeCode.split('_')[0]);
        }
        if (!langData) {
            return key;
        }
        return langData[key] || key;
    }

    /**
     * 使用指定语言翻译文本并格式化
     * @param localeName {string} 目标语言
     * @param key {string} 文本或ID
     * @param args[] {any} 格式化参数
     * @returns {string} 翻译并格式化后的文本
     */
    static trl(localeName, key, ...args) {
        //console.log(args); // [ 'string0', 1, { named_arg: 114.51419 } ]
        if (args.length === 1 && args[0].constructor === Array) {
            // todo: LLSE似乎是这种形式，而非Spread syntax
            args = args[0];
        }
        const REG = new RegExp(/(?<=\{).*?(?=\})/, "gim");
        let res = i18n.get(key, localeName);
        let params = res.match(REG);

        if (!params) return res;// 没有匹配到任何文字模板则直接返回

        let voidStencil = [].concat(args);// 用于最后的空模板替换
        if ((args[args.length - 1]).constructor === Object) {
            voidStencil[args.length - 1] = null;
        }

        //console.log(params); // [ '', '1', '0', 'named_arg:.2f' ]
        for (let i of params) {
            const index = i.indexOf(':');
            if (index > -1) {// 先检查是否有 {name:.2f} 类型的模板文字
                let argsObj = args[args.length - 1];
                if ((argsObj).constructor != Object) {
                    continue;
                }
                let argsKey = i.substring(0, index);
                // TODO: 实现值的二次解析（需要更多信息）。例: .2f 将 114.51419 解析为 114.51
                let argsKeyType = i.substring(index + 1);// .2f
                let argsValue = argsObj[argsKey];
                res = res.replace("{" + i + "}", argsKey + ": " + String(argsValue));
                params = spliteArray(params, i);
            } else if (i.length) {// 其次检查是否有 {a} 类型
                if (isNaN(i)) {
                    key = Alphabet.indexOf(i.toLowerCase());
                } else {
                    key = parseInt(i);
                }
                let argsValue = args[key];
                if (!argsValue || typeof (argsValue) === 'object') {
                    continue;
                }
                voidStencil[key] = null;
                res = res.replace("{" + i + "}", String(argsValue));
                params = spliteArray(params, i);
            }
        }
        for (let i of voidStencil) {// 最后检查空模板 {}
            if (i === null) {
                continue;
            }
            res = res.replace("{}", i);
        }
        res = res.replace(/ \{.*?(\})/gim, '');// 删除所有没有匹配到的模板文字
        return res;
    }

    /**
     * 使用默认语言翻译文本并格式化
     * @param key {string} 文本或ID
     * @param args[] {any} 格式化参数
     * @returns {string} 翻译并格式化后的文本
     */
    static tr(key, ...args) {
        return i18n.trl('', key, ...args);
    }
}

/**
 * 读取配置并与已有的langMap合并
 * @param {string} content 语言配置文件的内容
 * @param {string} lang 语言地区代号 形如 zh_CN
 */
function readConfig(content, lang) {
    let cfg = JSON.parse(content);
    if (lang) {
        langMap.set(lang, Object.assign(langMap.get(lang) || {}, cfg));
        return;
    }
    for (let key in cfg) {
        if (!langMap.has(key)) {
            langMap.set(key, cfg[key]);
            continue;
        }
        langMap.set(key, Object.assign(langMap.get(key) || {}, cfg[key]));
    }
}

/**
 * 将数组指定值设置为null
 * @param {array} arr 数组
 * @param {any} value 数组中任意元素的值
 * @returns {array} 返回处理后的数组
 */
function spliteArray(arr, value) {
    let index = arr.indexOf(value);
    if (index > -1) {
        arr[index] = null;
    }
    return arr;
}
