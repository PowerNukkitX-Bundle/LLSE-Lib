export class CommonNbt {
    _pnxNbt = undefined;

    /**
     * 读取对象的数据
     * @return {any} 对象中储存的数据
     */
    get() {
        return this._pnxNbt.getData();
    }

    /**
     * 设置对象的数据
     * @param data 根据这个NBT对象的数据类型，写入对应类型的数据
     * @return {Boolean} 是否成功写入
     */
    set(data) {
    }

    /**
     * 获取NBT对象储存的数据类型
     * @return {Number} 此NBT对象储存的数据类型
     */
    getType() {
    }

    /**
     * 将NBT对象转换为Json字符串
     * @param space （可选参数）如果要格式化输出的字符串，则传入此参数。代表每个缩进的空格数量，这样生成的字符串更适合人阅读。此参数默认为-1，即不对输出字符串进行格式化
     * @return {String} 对应的Json字符串
     */
    toString(space = -1) {
        if (space === -1) {
            return JSON.stringify(this.get());
        }
        return JSON.stringify(this.get(), null, space);
    }

    _isInteger(n) {
        return ~~n === n
    }
}

