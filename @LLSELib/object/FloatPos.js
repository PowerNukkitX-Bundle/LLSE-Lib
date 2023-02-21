export class FloatPos {
    /**
     * 创建一个 FloatPos 对象
     * @param {cn.nukkit.level.Position} position 坐标对象
     */
    constructor(position) {
        this.position = position;
    }

    /**
     * @returns {number} x
     */
    get x() {
        return this.position.x;
    }

    /**
     * @returns {number} y
     */
    get y() {
        return this.position.y;
    }

    /**
     * @returns {number} z
     */
    get z() {
        return this.position.z;
    }

    /**
     * @returns {number} 世界名
     */
    get dim() {
        return this.position.getLevel().getName();
    }

    /**
     * @returns {number} 世界的维度ID
     */
    get dimid() {
        return this.position.getLevel().getDimension();
    }

    toString() {
        return JSON.stringify({ x: this.x, y: this.y, z: this.z, dim: this.dim, dimid: this.dimid });
    }
}
