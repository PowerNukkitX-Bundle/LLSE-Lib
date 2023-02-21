import { MessageDigest } from 'java.security.MessageDigest';
import { BigInteger } from 'java.math.BigInteger';
import { String as JString } from "java.lang.String";
import { strToUtf8Bytes } from '../file/IO.js';
import { Base64 } from './Base64.js';
import { server } from '../utils/util.js';
import { DBSession } from '../database/DBSession.js';

const CharArray = Java.type("char[]");

if (!contain('PlayerDB')) {// 防止重复database
    exposeObject('PlayerDB', new DBSession('sqlite3', { path: './plugins/LiteLoaderLibs/PlayerDB.db' }));
}
const PlayerDB = contain('PlayerDB');
if (!PlayerDB.query("SELECT COUNT(*) FROM sqlite_master where type ='table' and name ='player'")[1][0]) PlayerDB.exec(`CREATE TABLE player
(
    NAME TEXT PRIMARY KEY NOT NULL,
    XUID TEXT NOT NULL,
    UUID TEXT NOT NULL
) WITHOUT ROWID;`);

export var data = {
    /**
     * 打开一个配置文件
     * @param path {string}
     * @param type {string} json => 以json格式; ini => 以ini格式
     * @returns {JsonConfigFile|IniConfigFile|boolean} 失败返回false，成功返回配置文件对象
     */
    openConfig(path, type, defaultContext) {
        type = type.toLowerCase();// 转小写
        if (type === 'json') {
            return new JsonConfigFile(path, defaultContext);
        } else if (type === 'ini') {
            return new IniConfigFile(path, defaultContext);
        } else {
            return false;
        }
    },
    /**
     * 变量转换为Json字符串
     * @param value {any} 要转换为Json字符串的变量
     * @param [space] {number} 要格式化输出的字符串则传入此参数，缩进的空格量
     * @returns {string|null} 转换成的Json字符串
     */
    toJson(value, space) {
        let res = null;
        try {
            if (space) {
                return JSON.stringify(value, '\n', space);
            } else {
                return JSON.stringify(value);
            }
        } catch (err) {
            console.error('Error: parseJson(' + [...arguments] + ')');
        }
        return res;
    },
    /**
     * Json字符串解析为变量
     * @param json {string} 要解析为变量的Json字符串
     * @returns {any|null} 转换后的变量，null则转换失败
     */
    parseJson(json) {
        let res = null;
        try {
            return JSON.parse(json);
        } catch (err) {
            console.error('Error: parseJson(' + [...arguments].join(', ') + ')');
        }
        return res;
    },
    /**
     * MD5计算
     * @param value {string|Int8Array} 要计算MD5的字符串 / 字节数组
     * @returns {string} 原数据的MD5摘要字符串
     */
    toMD5(value) {
        return Encryptor(value, 'MD5');
    },
    /**
     * SHA1计算
     * @param value {string|Int8Array} 要计算SHA1的字符串 / 字节数组
     * @returns {string} 原数据的SHA1摘要字符串
     */
    toSHA1(value) {
        return Encryptor(value, 'SHA1');
    },
    /**
     * SHA256计算
     * @param value {string|Int8Array} 要计算SHA256的字符串 / 字节数组
     * @returns {string} 原数据的SHA256摘要字符串
     */
    toSHA256(value) {
        return Encryptor(value, 'SHA256');
    },
    /**
     * 数据转Base64
     * @todo 未检查 Int8Array 转base64
     * @param value {string|Int8Array} 要转化为Base64的字符串 / 字节数组
     * @returns {string} 原数据的SHA256摘要字符串
     */
    toBase64(value) {
        return Base64.encode(value);
    },
    /**
     * 数据转Base64
     * @param base64 {string|Int8Array} 要解码的base64字符串
     * @param [isBinary=false] {boolean} 返回数据类型是否为二进制数据，默认为 false
     * @returns {string|Int8Array} 解码后的数据
     */
    fromBase64(base64, isBinary) {
        return isBinary ? strToUtf8Bytes(Base64.decode(base64)) : Base64.decode(base64);
    },
    /**
     * 玩家名转xuid
     * @param name {string} 玩家名
     * @returns {string} xuid
     */
    name2xuid(name) {
        return PlayerDB.query("SELECT XUID FROM player WHERE NAME='" + name.toLowerCase() + "';")[1][0];
    },
    /**
     * xuid转玩家名
     * @param xuid {string} xuid
     * @returns {string} 玩家名（小写）
     */
    xuid2name(xuid) {
        return PlayerDB.query("SELECT NAME FROM player WHERE XUID='" + xuid.toLowerCase() + "';")[1][0];
    },
    /**
     * 字符串转玩家名
     * @pnxonly
     * @param str {string} 可以是xuid,uuid,name
     * @returns {string} 玩家名（小写）
     */
    str2name(str) {
        let name = str;
        switch (str.length) {
            case 36:
                name = server.getOfflinePlayer(UUID.fromString(str)).getName();
                break;
            case 16:
                name = PlayerDB.query("SELECT NAME FROM player WHERE XUID='" + str.toLowerCase() + "';")[1][0];
                break;
        }
        return name.toLowerCase();
    }
}

function Encryptor(str, type) {
    if (typeof (str) === 'string') {
        var md = MessageDigest.getInstance(type);
        md.update(strToUtf8Bytes(str));
        return new BigInteger(1, md.digest()).toString(16);
    } else {// Int8Array
        var hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        var strTemp = Java.to(str, "byte[]");// byte[]
        var mdTemp = MessageDigest.getInstance(type);
        mdTemp.update(strTemp);
        var md = mdTemp.digest();// byte[]
        var j = md.length;
        var str = new CharArray(j * 2);
        var k = 0;
        // 移位 输出字符串
        for (let i = 0; i < j; i++) {
            var byte0 = md[i];
            str[k++] = hexDigits[byte0 >>> 4 & 0xf];
            str[k++] = hexDigits[byte0 & 0xf];
        }
        return new JString(str);
    }
}
