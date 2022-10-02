import { UUID } from 'java.util.UUID';

/**
 * 系统API对象
 *
 * 不可实例化
 */
export class system {

    /**
     * 获取当前时间字符串，形如2021-04-03 19:15:01
     * @param [date] {Date} 时间对象（可选）
     * @returns {string} 返回格式时间字符串
     */
    static getTimeStr(date) {
        const t = system.getTimeObj(date);
        return t.Y + '-' + bu0(t.M) + '-' + bu0(t.D) + ' ' + bu0(t.h) + ':' + bu0(t.m) + ':' + bu0(t.s);
    }

    /**
     * 获取当前的时间对象
     * @param [date] {Date} 时间对象（可选）
     * @returns {object} 返回一个对象
     */
    static getTimeObj(date = new Date()) {
        if (typeof (date) != 'object') date = new Date(date);// 转为Date
        return {
            Y: date.getFullYear(),// 年份数值（4 位）
            M: date.getMonth() + 1,// 月份数值1-12
            D: date.getDate(),// 天数数值1-31
            h: date.getHours(),// 小时数值0-23（24 小时制）
            m: date.getMinutes(),// 分钟数值0-59
            s: date.getSeconds(),// 秒数值0-59
            ms: date.getMilliseconds()// 毫秒数值0-999
        }
    }

    /**
     * 随机生成一个 GUID 字符串
     * @returns {string} 一个随机生成的唯一标识符 GUID
     */
    static randomGuid() {
        return UUID.randomUUID().toString();
    }

}

/**
 * 不足2位则补0
 * @returns {string}
 */
function bu0(num) {
    return num < 10 ? "0" + num : num;
}
