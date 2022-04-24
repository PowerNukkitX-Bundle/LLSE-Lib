export class DirectionAngle {
	constructor (entity) {
		this.entity = entity;
	}
	get pitch() {// 俯仰角（-90° ~ 90°）    Float
		return this.entity.pitch;
	}
	set pitch(value) {
		return;
	}
	get yaw() {// 偏航角（旋转角）	Float
		return this.entity.yaw > 180 ? this.entity.yaw - 360 : this.entity.yaw;
	}
	set yaw(value) {
		return;
	}
	toFacing() {// 北东南西 0123     Int
		console.log(this.yaw);
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
}