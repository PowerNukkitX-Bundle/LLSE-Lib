import { UUID } from 'java.util.UUID';
import { system } from '../utils/system.js';
import { data } from '../utils/data.js';
import { DBSession } from '../database/DBSession.js';
import { download, onlyOnceExecute, server } from '../utils/util.js';
import { File as JFile } from "java.io.File";

//define
/**
 * @typedef {Object} Main
 * @property {function(string,number): cn.nukkit.event.Event} createMoneyAddEvent
 * @property {function(string,number): cn.nukkit.event.Event} createMoneyReduceEvent
 * @property {function(string,number): cn.nukkit.event.Event} createMoneySetEvent
 * @property {function(string,string,number): cn.nukkit.event.Event} createMoneyTransEvent
 * @property {function(string,number): cn.nukkit.event.Event} createBeforeMoneyAddEvent
 * @property {function(string,number): cn.nukkit.event.Event} createBeforeMoneyReduceEvent
 * @property {function(string,number): cn.nukkit.event.Event} createBeforeMoneySetEvent
 * @property {function(string,string,number): cn.nukkit.event.Event} createBeforeMoneyTransEvent
 */

/**
 * @typedef {Object} _API.EconomyAPI
 * @property {function} setMoney
 * @property {function} myMoney
 * @property {function} addMoney
 * @property {function} reduceMoney
 */

/**
 * @typedef {Object} _API.LlamaEconomy
 * @property {function} setMoney
 * @property {function} getMoney
 * @property {function} addMoney
 * @property {function} reduceMoney
 */


if (!contain('economyDB')) {// 防止重复database
    exposeObject('economyDB', new DBSession('sqlite3', {path: './plugins/LiteLoaderLibs/economy.db'}));
}
export const economyDB = contain('economyDB');

/**
 * @type {Object}
 */
let EconomyEvent;
/**
 * @type {Object}
 */
let _API;

import("cn.coolloong.economyevent.Main").then(s => {
    let {Main} = s;
    EconomyEvent.createMoneyAddEvent = Main.createMoneyAddEvent;
    EconomyEvent.createMoneyReduceEvent = Main.createMoneyReduceEvent;
    EconomyEvent.createMoneySetEvent = Main.createMoneySetEvent;
    EconomyEvent.createMoneyTransEvent = Main.createMoneyTransEvent;
    EconomyEvent.createBeforeMoneyAddEvent = Main.createBeforeMoneyAddEvent;
    EconomyEvent.createBeforeMoneyReduceEvent = Main.createBeforeMoneyReduceEvent;
    EconomyEvent.createBeforeMoneySetEvent = Main.createBeforeMoneySetEvent;
    EconomyEvent.createBeforeMoneyTransEvent = Main.createBeforeMoneyTransEvent;
}, e => {
    onlyOnceExecute(() => {
        console.log("没有找到经济事件前置，正在为你自动下载 EconomyEvent...");
        const fileName = "EconomyEvent-1.0.1.jar";
        const folder = "plugins";
        download("https://res.nullatom.com/file/pnx/EconomyEvent-1.0.1.jar", folder, fileName, () => {
            const file = new JFile(folder, fileName);
            server.getPluginManager().loadPlugin(file);
        });
        import("cn.coolloong.economyevent").then(s2 => {
            let {Main} = s2;
            EconomyEvent.createMoneyAddEvent = Main.createMoneyAddEvent;
            EconomyEvent.createMoneyReduceEvent = Main.createMoneyReduceEvent;
            EconomyEvent.createMoneySetEvent = Main.createMoneySetEvent;
            EconomyEvent.createMoneyTransEvent = Main.createMoneyTransEvent;
            EconomyEvent.createBeforeMoneyAddEvent = Main.createBeforeMoneyAddEvent;
            EconomyEvent.createBeforeMoneyReduceEvent = Main.createBeforeMoneyReduceEvent;
            EconomyEvent.createBeforeMoneySetEvent = Main.createBeforeMoneySetEvent;
            EconomyEvent.createBeforeMoneyTransEvent = Main.createBeforeMoneyTransEvent;
        })
    }, "64D1B2FC-E3BA-44A8-DCD4-91F117D6397D");
});
import('me.onebone.economyapi.EconomyAPI').then(s => {
    let {EconomyAPI} = s;
    _API.EconomyAPI = EconomyAPI.getInstance();
    onlyOnceExecute(() => {
        console.log("成功载入EconomyAPI");
    }, "DD681B41-E68F-545F-8CDA-FC89D99F210B");
}, e => {
    import('net.lldv.llamaeconomy.LlamaEconomy').then(s => {
        let {LlamaEconomy} = s;
        _API.LlamaEconomy = LlamaEconomy.getAPI();
        onlyOnceExecute(() => {
            console.log("成功载入LlamaEconomy");
        }, "E32378ED-4045-C616-A1DA-430A2E0821A1");
    }, e => {
        onlyOnceExecute(() => {
            console.log("没有找到经济插件，正在为你自动下载 EconomyAPI...");
            const fileName = "EconomyAPI.jar";
            const folder = "plugins";
            download("https://cloudburstmc.org/resources/economyapi.14/download", folder, fileName, () => {
                const file = new JFile(folder, fileName);
                server.getPluginManager().loadPlugin(file);
            });
        }, "7A5E903B-C70B-4546-8AE2-6AA7C9D5B574");
    });
});

/**
 * money API
 */
export class money {
    static id = "A0FDE4B9-0F47-DA25-A2B4-D24EFE286484";

    /**
     * 设置玩家的存款金额
     * @param xuid {string|UUID} 要操作的玩家的Xuid/Uuid/name标识符
     * @param money {number} 要设置的金额
     * @returns {boolean} 是否成功
     */
    static set(xuid, money) {
        let ev1 = EconomyEvent.createBeforeMoneySetEvent(xuid, money);
        server.getPluginManager().callEvent(ev1);
        if (ev1.isCancelled()) {
            return false;
        }

        if (_API.EconomyAPI) {
            _API.EconomyAPI.setMoney(data.str2name(xuid), money);
        } else if (_API.LlamaEconomy) {
            _API.LlamaEconomy.setMoney(data.str2name(xuid), money);
        } else {
            return false;
        }
        economyDB.exec(`INSERT INTO money (XUID, Money)
                        VALUES ('${data.name2xuid(data.str2name(xuid1))}', '${money}') ON CONFLICT (XUID) DO
        UPDATE
            SET Money=${money}`);

        let ev2 = EconomyEvent.createMoneySetEvent(xuid, money);
        server.getPluginManager().callEvent(ev2);
        return true;
    }

    /**
     * 获取玩家的存款金额
     * @param xuid {string|UUID} 要操作的玩家的Xuid/Uuid/name标识符
     * @returns {number} 玩家的资金数值
     */
    static get(xuid) {
        let value = 0
        if (_API.EconomyAPI) {
            value = _API.EconomyAPI.myMoney(data.str2name(xuid));
        } else if (_API.LlamaEconomy) {
            value = _API.LlamaEconomy.getMoney(data.str2name(xuid));
        }
        economyDB.exec(`INSERT INTO money (XUID, Money)
                        VALUES ('${data.name2xuid(data.str2name(xuid1))}', '${value}') ON CONFLICT (XUID) DO
        UPDATE
            SET Money=${value}`);
        return value;
    }

    /**
     * 增加玩家的存款金额
     * @param xuid {string|UUID} 要操作的玩家的Xuid/Uuid/name标识符
     * @param _money {number} 要增加的金额
     * @returns {boolean} 是否成功
     */
    static add(xuid, _money) {
        let ev1 = EconomyEvent.createBeforeMoneyAddEvent(xuid, _money);
        server.getPluginManager().callEvent(ev1);
        if (ev1.isCancelled()) {
            return false;
        }

        if (_API.EconomyAPI) {
            _API.EconomyAPI.addMoney(data.str2name(xuid), _money);
        } else if (_API.LlamaEconomy) {
            _API.LlamaEconomy.addMoney(data.str2name(xuid), _money);
        }
        money.get(data.str2name(xuid));// 更新数据库

        let ev2 = EconomyEvent.createMoneyAddEvent(xuid, _money);
        server.getPluginManager().callEvent(ev2);
        return true;
    }

    /**
     * 减少玩家的存款
     * @param xuid {string|UUID} 要操作的玩家的Xuid/Uuid/name标识符
     * @param _money {number} 要减少的金额
     * @returns {boolean} 是否成功
     */
    static reduce(xuid, _money) {
        let ev1 = EconomyEvent.createBeforeMoneyReduceEvent(xuid, _money);
        server.getPluginManager().callEvent(ev1);
        if (ev1.isCancelled()) {
            return false;
        }

        if (money.get(data.str2name(xuid)) < _money) {
            return false;
        }
        if (_API.EconomyAPI) {
            _API.EconomyAPI.reduceMoney(data.str2name(xuid), _money);
        } else if (_API.LlamaEconomy) {
            _API.LlamaEconomy.reduceMoney(data.str2name(xuid), _money);
        } else {
            return false;
        }
        money.get(data.str2name(xuid));// 更新数据库

        let ev2 = EconomyEvent.createMoneyReduceEvent(xuid, _money);
        server.getPluginManager().callEvent(ev2);
        return true;
    }

    /**
     * 进行一笔转账
     * @param xuid1 {string|UUID} 要操作的玩家的Xuid/Uuid/name标识符
     * @param xuid2 {string|UUID} 要操作的玩家的Xuid/Uuid/name标识符
     * @param money_ {number} 要支付的金额
     * @param [note] {string} 备注
     * @returns {boolean} 是否成功
     */
    static trans(xuid1, xuid2, money_, note = '') {
        let ev1 = EconomyEvent.createBeforeMoneyTransEvent(xuid1, xuid2, money_);
        server.getPluginManager().callEvent(ev1);
        if (ev1.isCancelled()) {
            return false;
        }

        if (money.reduce(data.str2name(xuid1), money_)) {
            money.add(data.str2name(xuid2), money_);
            economyDB.exec(`INSERT INTO mtrans (tFrom, tTo, Money, Time, Note)
                            VALUES ('${data.name2xuid(data.str2name(xuid1))}', '${data.name2xuid(data.str2name(xuid2))}
                                    ', '${money_}', '${~~(new Date().getTime() / 1e3)}', '${String(note)}');`);
            money.get(data.str2name(xuid1));// 更新数据库
            money.get(data.str2name(xuid2));

            let ev2 = EconomyEvent.createMoneyTransEvent(xuid1, xuid2, money_);
            server.getPluginManager().callEvent(ev2);
            return true;
        }
        return false;
    }

    /**
     * 查询历史账单
     * @param xuid {string} 要操作的玩家的Xuid标识符
     * @param time {number} 查询从现在开始往前time秒的记录
     * @returns {Array<object>} 返回数组
     * @example
     * let array = money.getHistory('xuid', 30);// 获取往前30秒的记录
     * record = array[0];
     * record.from    //此项交易的发起者玩家Xuid    String
     * record.to    //此项交易的接收者玩家Xuid    String
     * record.money    //此项交易的金额    Integer
     * record.time    //此项交易发生时的时间字符串    String
     * record.note    //此交易的附加说明信息    String
     */
    static getHistory(xuid, time) {
        let res = [];
        let d = economyDB.query(`SELECT *
                                 FROM mtrans
                                 WHERE (tFrom = '${xuid}' OR tTo = '${xuid}')
                                   AND Time BETWEEN ${~~(new Date().getTime() / 1e3)}
                                   AND ${~~(new Date().getTime() / 1e3) + Number(time)};`);
        for (let i = 1; i < d.length; i++) {
            res.push({
                from: d[i][0],
                to: d[i][1],
                money: d[i][2],
                time: system.getTimeStr(d[i][3] * 1e3),
                note: d[i][4]
            });
        }
        return res;
    }

    /**
     * 删除账单历史记录
     *
     * @param time {number} 删除从现在开始往前time秒的记录
     * @returns {boolean} 是否删除成功
     */
    static clearHistory(time) {
        economyDB.listKey().filter(v => {
            let is = v > (~~(new Date().getTime() / 1e3) - ~~time);
            if (is) {
                economyDB.delete(v);
            }
            return is;
        });
        return true;
    }
}

onlyOnceExecute(() => {
    if (!economyDB.query("SELECT COUNT(*) FROM sqlite_master where type ='table' and name ='mtrans'")[1][0]) {
        economyDB.exec(`CREATE TABLE mtrans
                        (
                            tFrom TEXT    NOT NULL,
                            tTo   TEXT    NOT NULL,
                            Money NUMERIC NOT NULL,
                            Time  NUMERIC NOT NULL,
                            Note  TEXT
                        );`);
    }
    if (!economyDB.query("SELECT COUNT(*) FROM sqlite_master where type ='table' and name ='money'")[1][0]) {
        economyDB.exec(`CREATE TABLE money
                        (
                            XUID  TEXT PRIMARY KEY UNIQUE NOT NULL,
                            Money NUMERIC                 NOT NULL
                        ) WITHOUT ROWID;`);
    }
}, money.id);