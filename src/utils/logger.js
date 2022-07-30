import { File } from '../file/File.js';
import { system } from './system.js';
import { File as JFile } from 'java.io.File';

/**
 * 日志logger对象
 * @todo 使用正确的fatal打印，而不是error
 */
export class logger {
    static _output = {
        'Player': [null, 4],
        'Console': [true, 4],
        'File': [null, 4]
    };
    static Type = [
        'Slient',
        'Fatal',
        'Error',
        'Warn',
        'Info',
        'Debug'
    ];

    /**
     * 输出普通文本
     */
    static log() {
        if (logger._outputToConsole(5)) {
            console.log.apply(this, arguments);
        }
        logger._outputToPlayer(5, arguments);
        logger._outputToFile(5, arguments);
    }

    /**
     * 输出调试信息
     */
    static debug() {
        if (logger._outputToConsole(5)) {
            console.debug.apply(this, arguments);
        }
        logger._outputToPlayer(5, arguments);
        logger._outputToFile(5, arguments);
    }

    /**
     * 输出提示信息
     */
    static info() {
        if (logger._outputToConsole(4)) {
            console.log.apply(this, arguments);
        }
        logger._outputToPlayer(4, arguments);
        logger._outputToFile(4, arguments);
    }

    /**
     * 输出警告信息
     */
    static warn() {
        if (logger._outputToConsole(3)) {
            console.warn.apply(this, arguments);
        }
        logger._outputToPlayer(3, arguments);
        logger._outputToFile(3, arguments);
    }

    /**
     * 输出错误信息
     */
    static error() {
        if (logger._outputToConsole(2)) {
            console.error.apply(this, arguments);
        }
        logger._outputToPlayer(2, arguments);
        logger._outputToFile(2, arguments);
    }

    /**
     * 输出严重错误信息
     */
    static fatal() {
        if (logger._outputToConsole(1)) {
            console.error.apply(this, arguments);
        }
        logger._outputToPlayer(1, arguments);
        logger._outputToFile(1, arguments);
    }

    /**
     * 设置自定义日志消息标头
     * @param title {string} 设置的自定义标头
     */
    static setTitle(title) {
        return false;
    }

    /**
     * 统一修改日志输出等级
     * @param level {number} 日志输出等级
     */
    static setLogLevel(level) {
        logger._output.Player[1] = level;
        logger._output.Console[1] = level;
        logger._output.File[1] = level;
    }

    /**
     * 设置日志是否输出到某个玩家
     * @param player {Player} 设置日志输出到的目标玩家对象
     * @param [logLevel=4] {number} （可选参数）玩家的最小日志输出等级，默认为 4
     */
    static setPlayer(player, logLevel = 4) {
        logger._output.Player[0] = player;
        logger._output.Player[1] = logLevel;
    }

    static _outputToPlayer(level, args) {
        if (logger._output.Player[0] === null) {
            return false;
        }
        if (logger._output.Player[1] > level) {
            return false;
        }
        logger._output.Player[0].tell(args.join('\n'));
    }

    /**
     * 设置日志是否输出到控制台
     * @param player {Player} 设置日志输出到的目标玩家对象
     * @param [logLevel=4] {number} （可选参数）最小日志输出等级，默认为 4
     */
    static setConsole(isOpen, logLevel = 4) {
        logger._output.Console[0] = isOpen;
        logger._output.Console[1] = logLevel;
    }

    static _outputToConsole(level) {
        if (logger._output.Console[0] === false) {
            return false;
        }
        if (logger._output.Console[1] > level) {
            return false;
        }
        return true;
    }

    /**
     * 设置日志是否输出到控制台
     * @param player {Player} 设置日志输出到的目标玩家对象
     * @param [logLevel=4] {number} （可选参数）最小日志输出等级，默认为 4
     */
    static setFile(filepath, logLevel = 4) {
        logger._output.File[0] = filepath;
        logger._output.File[1] = logLevel;
        if (!new JFile(filepath).exists()) {// 文件不存在
            File.writeTo(filepath, '');
        }
    }

    static _outputToFile(level, args) {
        if (logger._output.File[0] === null) {
            return false;
        }
        if (level > logger._output.File[1]) {
            return false;
        }
        File.writeLine(logger._output.File[0], '[' + system.getTimeStr() + ' ' + logger.Type[level] + ']' + args.join('\n'));
    }
}