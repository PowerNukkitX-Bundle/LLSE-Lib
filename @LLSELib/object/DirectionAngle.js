export class DirectionAngle {
    /**
     * 创建一个DirectionAngle对象
     * @param {cn.nukkit.entity.Entity} PNXEntity
     */
    constructor(PNXEntity) {
        this.entity = PNXEntity;
    }

    /**
     * @returns {number} 俯仰角（-90° ~ 90°）
     */
    get pitch() {
        return this.entity.pitch;
    }

    /**
     * @returns {number} 偏航角（旋转角 -180° ~ 180°）
     */
    get yaw() {
        return this.entity.yaw > 180 ? this.entity.yaw - 360 : this.entity.yaw;
    }

    /**
     * 获取当前朝向
     * @returns {number} 北东南西 （0-3）
     */
    toFacing() {
        if (this.yaw < -135 && this.yaw >= 135) {
            return 0;
        } else if (this.yaw < -45 && this.yaw >= -135) {
            return 1;
        } else if (this.yaw < 45 && this.yaw >= -45) {
            return 2;
        } else if (this.yaw < 135 && this.yaw >= 45) {
            return 3;
        }
    }

    toString() {
        return JSON.stringify({ pitch: this.pitch, yaw: this.yaw, facing: this.toFacing() });
    }
}
