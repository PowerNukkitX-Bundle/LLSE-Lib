
export class Entity {
    constructor (PNXEntity) {
		this.PNXEntity = PNXEntity;
		this.DirectionAngle = new DirectionAngle(PNXEntity);
	}

	get name() {// 实体名称	String
		return this.PNXEntity.getName();
	}

	get type() {// 实体标准类型名	String
		return this.PNXEntity.getOriginalName();
	}

	get id() {// 实体的游戏内 id	Integer
		return this.PNXEntity.getId();
	}

	get pos() {// 实体所在坐标  FloatPos
		return new FloatPos(this.PNXEntity.getPosition());;
	}

	get blockPos() {// 实体所在的方块坐标	IntPos
		return new IntPos(this.PNXEntity.getPosition());;
	}

	get maxHealth() {// 实体最大生命值	Integer
		return this.PNXEntity.getMaxHealth();
	}

	get health() {// 实体当前生命值  Integer
		return this.PNXEntity.getHealth();
	}

	get inAir() {// 实体当前是否悬空  Boolean
		return this.PNXEntity.getInAirTicks() > 0;
	}

	get inWater() {// 实体当前是否在水中		Boolean
		return this.PNXEntity.isSwimming();
	}

	get speed() {// 实体当前速度	Float
		return this.PNXEntity.getMovementSpeed();
	}

	get direction() {// 实体当前朝向	Boolean
		return this.DirectionAngle;
	}

	get uniqueId() {// 实体唯一标识符	String
		return this.PNXPlayer.getUniqueId().toString();
	}
}