export class IntPos {
	constructor (position) {
		this.position = position;
	}
	get x() {
		return parseInt(this.position.x);
	}
	get y() {
		return parseInt(this.position.y);
	}
	get z() {
		return parseInt(this.position.z);
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