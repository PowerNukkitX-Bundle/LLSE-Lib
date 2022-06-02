import { Entity } from './Entity.js';
import { Player } from './Player.js';
import { ArrayList as JList } from 'java.util.ArrayList';
import { EntityScorer } from 'cn.nukkit.scoreboard.scorer.EntityScorer';
import { FakeScorer } from 'cn.nukkit.scoreboard.scorer.FakeScorer';
import { PlayerScorer } from 'cn.nukkit.scoreboard.scorer.PlayerScorer';
import { DisplaySlot } from 'cn.nukkit.scoreboard.data.DisplaySlot';
import { SortOrder } from 'cn.nukkit.scoreboard.data.SortOrder';
import { Player as JPlayer } from 'cn.nukkit.Player';
import { Server } from 'cn.nukkit.Server';
const server = Server.getInstance();

export class ScoreObjectives {
	/**
	* 生产新的 ScoreObjectives 对象
	* @returns {Objectives} 计分项对象
	*/
	constructor(name) {
		this._ObjectivesName = name;
	}

	static ScoreMap = new Map();

	/**
	* 获取ScoreObjectives对象
	* @returns {Objectives} 计分项对象
	*/
	static getObjectives(name) {
		if (!ScoreMap.has(name)) {
			ScoreMap.set(name, new ScoreObjectives(name));
		}
		return ScoreMap.get(name);
	}

	get _PNXScore() {
		const manager = server.getScoreboardManager();
		if (!manager.hasScoreboard(this._ObjectivesName)) {
			return null;
		}
		return manager.getScoreboards().get(this._ObjectivesName);
	}


	/**
	 * 获取跟踪的某个目标的分数
	 * @param target {Entity|string} 实体对象
	 * @returns {number|null} 该目标 / 玩家在此计分项中的分数
	 */
	getScore(target) {
		const scoreboard = this._PNXScore;
		const [wildcard, scorers] = paraseTarget(target, scoreboard);
		if (scorers.isEmpty() || wildcard) {
			return null;
		}
		for (scorer of scorers) {
			if (scoreboard.getLines().containsKey(scorer)) {
				scoreboard.getLines().get(scorer);
			} else {
				return 0;
			}
		}
	}
	/**
	 * 修改某个目标的分数
	 * @param target {Entity|string} 实体对象
	 * @param score {number} 分数
	 * @returns {number|null} 该目标 / 玩家在操作后的分数
	 */
	setScore(target, score) {
		const scoreboard = this._PNXScore;
		const [wildcard, scorers] = paraseTarget(target, scoreboard);
		if (scorers.isEmpty() || wildcard) {
			return null;
		}
		for (scorer of scorers) {
			if (scoreboard.getLines().containsKey(scorer)) {
				scoreboard.getLines().get(scorer).setScore(score);
			} else {
				scoreboard.addLine(scorer, score);// 添加这一行
			}
			return score;
		}
	}
	/**
	 * 添加目标的分数
	 * @see setScore
	 */
	addScore(target, score) {
		const scoreboard = this._PNXScore;
		const [wildcard, scorers] = paraseTarget(target, scoreboard);
		if (scorers.isEmpty() || wildcard) {
			return null;
		}
		for (scorer of scorers) {
			if (scoreboard.getLines().containsKey(scorer)) {
				scoreboard.getLines().get(scorer).addScore(score);
			} else {
				scoreboard.addLine(scorer, score);// 添加这一行
			}
			return scoreboard.getLines().get(scorer).getScore();
		}
	}
	/**
	 * 减少目标的分数
	 * @see setScore
	 */
	reduceScore(target, score) {
		const scoreboard = this._PNXScore;
		const [wildcard, scorers] = paraseTarget(target, scoreboard);
		if (scorers.isEmpty() || wildcard) {
			return null;
		}
		for (scorer of scorers) {
			if (scoreboard.getLines().containsKey(scorer)) {
				scoreboard.getLines().get(scorer).removeScore(score);
			} else {
				scoreboard.addLine(scorer, 0);// 添加这一行
			}
			return scoreboard.getLines().get(scorer).getScore();
		}
	}
	/**
	 * 删除记分板上的目标
	 * @param target {Entity|string} 实体对象，允许 *
	 * @returns {boolean} 是否成功删除
	 */
	deleteScore(target) {
		const scoreboard = this._PNXScore;
		const [wildcard, scorers] = paraseTarget(target, scoreboard);
		if (scorers.isEmpty()) {
			return false;
		}
		for (scorer of scorers) {
			scoreboard.removeLine(scorer);
		}
		return true;
	}
	/**
	 * 设置计分项的显示状态
	 * @param slot {string} 显示槽位名称字符串，可以为 sidebar/belowname/list
	 * @param [sortOrder=0] {number} 排序方式，可以为 0(升序) 或 1(降序)，默认为 0
	 * @returns {boolean} 是否设置成功
	 */
	setDisplay(slot, sortOrder = 0) {
		const manager = server.getScoreboardManager();
		if (!manager.hasScoreboard(this._ObjectivesName)) {// 没有该记分榜时
			return false;
		}
		switch (slot) {
			case 'sidebar': {
				slot = DisplaySlot.SIDEBAR;
				break;
			}
			case 'belowname': {
				slot = DisplaySlot.BELOW_NAME;
				break;
			}
			case 'list': {
				slot = DisplaySlot.LIST;
				break;
			}
			default: {
				return false;
			}
		}
		manager.setDisplay(DisplaySlot.BELOW_NAME, this._ObjectivesName);
		manager.setSortOrder(sortOrder ? SortOrder.DESCENDING : SortOrder.ASCENGING, this._ObjectivesName);
		return true;
	}
}

/**
 * 解析目标
 * @param target {Entity|string} 目标
 * @param scoreboard {cn.nukkit.scoreboard} 记分榜对象
 * @returns {Array<boolean wildcard, ArrayList scorers>} 返回数组为 是否为通配符，目标列表
 */
export function paraseTarget(target, scoreboard) {
	var scorers = new JList();
	var wildcard = false;
	if (scoreboard === null) {
		return [wildcard, scorers];
	}
	if (target.equals('*')) {// 所有追踪的对象
		wildcard = true;
		scorers.addAll(scoreboard.getLines().keySet());
	} else if (server.getPlayer(string) != null) {// 玩家名
		scorers.add(server.getPlayer(string))
	} else if (target instanceof Player) {// 玩家对象
		scorers.add(new PlayerScorer(target._PNXPlayer));
	} else if (target instanceof Entity) {// 实体对象
		scorers.add(new EntityScorer(target._PNXEntity));
	} else {// 字符串
		scorers.add(new FakeScorer(target.toString()));
	}
	return [wildcard, scorers];
}