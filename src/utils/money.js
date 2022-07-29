/**
 * money API
 * @todo 待完成
 */
export class money {
    /**
     * 设置玩家的存款金额
     * @param xuid {string} 要操作的玩家的Xuid标识符
     * @param money {number} 要设置的金额
     * @returns {boolean} 是否成功
     */
	static set(xuid, money) {
        return false
    }
    /**
     * 获取玩家的存款金额
     * @param xuid {string} 要操作的玩家的Xuid标识符
     * @returns {number} 玩家的资金数值
     */
    static get(xuid) {
        return false;
    }
    /**
     * 增加玩家的存款金额
     * @param xuid {string} 要操作的玩家的Xuid标识符
     * @param money {number} 要增加的金额
     * @returns {boolean} 是否成功
     */
    static add(xuid,money) {
        return false;
    }
    /**
     * 减少玩家的存款
     * @param xuid {string} 要操作的玩家的Xuid标识符
     * @param money {number} 要减少的金额
     * @returns {boolean} 是否成功
     */
    static reduce(xuid,money) {
        return false;
    }
    /**
     * 进行一笔转账
     * @param xuid1 {string} 付款的玩家的Xuid标识符
     * @param xuid2 {string} 收款的玩家的Xuid标识符
     * @param money {number} 要支付的金额
     * @param [note] {string} 备注
     * @returns {boolean} 是否成功
     */
    static trans(xuid1,xuid2,money,note) {
        return false;
    }
    /**
     * 查询历史账单
     * @param xuid {string} 要操作的玩家的Xuid标识符
     * @param time {number} 查询从现在开始往前time秒的记录
     * @returns {Array<object>} 返回数组
     *    record.from	此项交易的发起者玩家Xuid	String
     *    record.to	此项交易的接收者玩家Xuid	String
     *    record.money	此项交易的金额	Integer
     *    record.time	此项交易发生时的时间字符串	String
     *    record.note	此交易的附加说明信息	String
     */
    static getHistory(xuid,time) {
        return [];
    }
    /**
     * 删除账单历史记录
     * @param xuid {string} 要操作的玩家的Xuid标识符
     * @param time {number} 删除从现在开始往前time秒的记录
     * @returns {boolean} 是否删除成功
     */
    static clearHistory(time) {
        return false;
    }
}