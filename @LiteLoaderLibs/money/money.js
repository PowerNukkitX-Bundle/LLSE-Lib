import { UUID } from 'java.util.UUID';
import { system } from '../utils/system.js';
import { data } from '../utils/data.js';
import { DBSession } from '../database/DBSession.js';
import { onlyOnceExecute } from '../utils/Mixins.js';

const _API = {};
if (!contain('economyDB')) {// 防止重复database
    exposeObject('economyDB', new DBSession('sqlite3', { path: './plugins/LiteLoaderLibs/economy.db' }));
}
export var economyDB = contain('economyDB');

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
        return true;
    }

    /**
     * 获取玩家的存款金额
     * @param xuid {string|UUID} 要操作的玩家的Xuid/Uuid/name标识符
     * @returns {number} 玩家的资金数值
     */
    static get(xuid) {
        var value = 0;
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
     * @param money {number} 要增加的金额
     * @returns {boolean} 是否成功
     */
    static add(xuid, _money) {
        if (_API.EconomyAPI) {
            _API.EconomyAPI.addMoney(data.str2name(xuid), _money);
        } else if (_API.LlamaEconomy) {
            _API.LlamaEconomy.addMoney(data.str2name(xuid), _money);
        } else {
            return false;
        }
        money.get(data.str2name(xuid));// 更新数据库
        return true;
    }

    /**
     * 减少玩家的存款
     * @param xuid {string|UUID} 要操作的玩家的Xuid/Uuid/name标识符
     * @param money {number} 要减少的金额
     * @returns {boolean} 是否成功
     */
    static reduce(xuid, money_) {
        if (money.get(data.str2name(xuid)) < money_) {
            return false;
        }
        if (_API.EconomyAPI) {
            _API.EconomyAPI.reduceMoney(data.str2name(xuid), money_);
        } else if (_API.LlamaEconomy) {
            _API.LlamaEconomy.reduceMoney(data.str2name(xuid), money_);
        } else {
            return false;
        }
        money.get(data.str2name(xuid));// 更新数据库
        return true;
    }

    /**
     * 进行一笔转账
     * @param xuid1 {string|UUID} 要操作的玩家的Xuid/Uuid/name标识符
     * @param xuid2 {string|UUID} 要操作的玩家的Xuid/Uuid/name标识符
     * @param money {number} 要支付的金额
     * @param [note] {string} 备注
     * @returns {boolean} 是否成功
     */
    static trans(xuid1, xuid2, money_, note = '') {
        if (money.reduce(data.str2name(xuid1), money_)) {
            money.add(data.str2name(xuid2), money_);
            economyDB.exec(`INSERT INTO mtrans (tFrom, tTo, Money, Time, Note)
                            VALUES ('${data.name2xuid(data.str2name(xuid1))}', '${data.name2xuid(data.str2name(xuid2))}
                                    ', '${money_}', '${~~(new Date().getTime() / 1e3)}', '${String(note)}');`);
            money.get(data.str2name(xuid1));// 更新数据库
            money.get(data.str2name(xuid2));
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
        let d = economyDB.qreuy(`SELECT *
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
     * @param xuid {string} 要操作的玩家的Xuid标识符
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
    import('me.onebone.economyapi.EconomyAPI').then(s => {
        let { EconomyAPI } = s;
        _API.EconomyAPI = EconomyAPI.getInstance();
        console.log("成功载入EconomyAPI");
    }, e => {
        import('net.lldv.llamaeconomy.LlamaEconomy').then(s => {
            let { LlamaEconomy } = s;
            _API.LlamaEconomy = LlamaEconomy.getAPI();
            console.log("成功载入LlamaEconomy");
        }, e => {
            console.warn('没有找到经济插件 money API 已失效，请加载 EconomyAPI / LlamaEconomy 后重载...');
        });
    });

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
