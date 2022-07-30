class CommonNbt {
    _pnxNbt = undefined;

    /**
     * 读取对象的数据
     * @return 对象中储存的数据
     */
    get() {
        return this.#data.getData();
    }

    /**
     * 设置对象的数据
     * @param data 根据这个NBT对象的数据类型，写入对应类型的数据
     * @return {Boolean} 是否成功写入
     */
    set(data) {

    }

    getType() {

    }

    _isFloating(n) {
        return ~~n !== n;
    }

    _isInteger(n) {
        return ~~n === n
    }
}

