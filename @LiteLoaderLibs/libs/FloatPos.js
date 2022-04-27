export class FloatPos {
	constructor (position) {
		this.position = position;
	}
	get x() {
		return this.position.x;
	}
	get y() {
		return this.position.y;
	}
	get z() {
		return this.position.z;
	}
	get dim() {
		return this.position.getLevel().getName();
	}
	get dimid() {
		return this.position.getLevel().getDimension();
	}
	toString() {
		return JSON.stringify({x: this.x, y: this.y, z: this.z, dim: this.dim, dimid: this.dimid});
	}
}