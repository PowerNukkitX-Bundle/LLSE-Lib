class CommonNbt {
    _pnxNbt = undefined;

    get() {
        return this.#data.getData();
    }

    set(data) {
    }

    _isFloating(n) {
        return ~~n !== n;
    }

    _isInteger(n) {
        return ~~n === n
    }
}

