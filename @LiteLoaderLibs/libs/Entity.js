
export class Entity {
    constructor (PNXEntity) {
		this.PNXEntity = PNXEntity;
		this.DirectionAngle = new DirectionAngle(this.PNXPlayer);
	}

	get name() {// 实体名称	String
		return ;
	}

	get type() {// 实体标准类型名	String
		return ;
	}

	get id() {// 实体的游戏内 id	Integer
		return ;
	}

	get pos() {// 实体所在坐标  FloatPos
		return ;
	}

	get blockPos() {// 实体所在的方块坐标	IntPos
		return ;
	}

	get maxHealth() {// 实体最大生命值	Integer
		return ;
	}

	get health() {// 实体当前生命值  Integer
		return ;
	}

	get inAir() {// 实体当前是否悬空  Boolean
		return ;
	}

	get inWater() {// 实体当前是否在水中		Boolean
		return ;
	}

	get speed() {// 实体当前速度	Float
		return ;
	}

	get direction() {// 实体当前朝向	Boolean
		return ;
	}

	get uniqueId() {// 实体唯一标识符	Boolean
		return ;
	}
}