export class IntPos {
    /**
     * 创建一个 IntPos 对象
     * @param {cn.nukkit.level.Position} position 坐标对象
     */
    constructor(position) {
        this.position = position;
    }

    /**
     * @returns {number} x
     */
    get x() {
        return this.position.getFloorX();
    }

    /**
     * @returns {number} y
     */
    get y() {
        return this.position.getFloorY();
    }

    /**
     * @returns {number} z
     */
    get z() {
        return this.position.getFloorZ();
    }

    /**
     * @returns {string} 世界名
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

    /**
     * @returns {string}
     */
    toString() {
        return JSON.stringify({ x: this.x, y: this.y, z: this.z, dim: this.dim, dimid: this.dimid });
    }
}
