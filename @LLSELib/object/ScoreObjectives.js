import { Entity } from './Entity.js';
import { Player } from './Player.js';
import { ArrayList as JList } from 'java.util.ArrayList';
import { EntityScorer } from 'cn.nukkit.scoreboard.scorer.EntityScorer';
import { FakeScorer } from 'cn.nukkit.scoreboard.scorer.FakeScorer';
import { PlayerScorer } from 'cn.nukkit.scoreboard.scorer.PlayerScorer';
import { DisplaySlot } from 'cn.nukkit.scoreboard.data.DisplaySlot';
import { SortOrder } from 'cn.nukkit.scoreboard.data.SortOrder';
import { server } from '../utils/util.js'
import { Scoreboard } from 'cn.nukkit.scoreboard.scoreboard.Scoreboard';

export class ScoreObjectives {
    /**
     * 生产新的 ScoreObjectives 对象
     * @returns {ScoreObjectives} 计分项对象
     */
    constructor(pnxScoreObject) {
        this._pnxScoreObject = pnxScoreObject;
    }

    static ScoreMap = new Map();

    /**
     * 获取ScoreObjectives对象
     * @see pnx only
     * @returns {ScoreObjectives|null} 计分项对象
     */
    static getObjectives(name) {
        const manager = server.getScoreboardManager();
        if (!manager.containScoreboard(name)) {
            return null;
        }
        if (!ScoreObjectives.ScoreMap.has(name)) {
            ScoreObjectives.ScoreMap.set(name, new ScoreObjectives(manager.getScoreboard(name)));
        }
        return ScoreObjectives.ScoreMap.get(name);
    }

    /**
     * 创建一个新的计分项
     * 此接口的作用类似命令 /scoreboard objectives add <name> <displayName> dummy
     * @see pnx only
     * @param name {string} 计分项名称
     * @param displayName  {string} 计分项显示名称
     * @returns {ScoreObjectives|null} 新增创建的计分项对象
     */
    static newScoreObjective(name, displayName) {
        const manager = server.getScoreboardManager();
        if (manager.containScoreboard(name)) {
            return null;
        }
        manager.addScoreboard(new Scoreboard(name, displayName, 'dummy', SortOrder.ASCENDING));
        return ScoreObjectives.getObjectives(name);
    }

    /**
     * 获取所有计分项
     * 此接口的作用类似命令 /scoreboard objectives list
     * @see pnx only
     * @returns {Array<ScoreObjectives>} 计分板系统记录的所有计分项对象
     */
    static getAllScoreObjectives() {
        const manager = server.getScoreboardManager();
        let allScoreObjectives = [];
        for (let scoreboard of manager.getScoreboards().values()) {
            allScoreObjectives.push(ScoreObjectives.getObjectives(scoreboard.getObjectiveName()));
        }
        return allScoreObjectives;
    }

    /**
     * 获取某个处于显示状态的计分项
     * @see pnx only
     * @param slot {string} 待查询的显示槽位名称，可以为"sidebar"/"belowname"/"list"
     * @returns {ScoreObjectives|null} 正在slot槽位显示的计分项
     */
    static getDisplayObjective(slot) {
        const manager = server.getScoreboardManager();
        let objectiveName;
        switch (slot) {
            case 'sidebar':
                objectiveName = manager.getDisplaySlot(DisplaySlot.SIDEBAR);
                break;
            case 'list':
                objectiveName = manager.getDisplaySlot(DisplaySlot.LIST);
                break;
            case 'belowname':
                objectiveName = manager.getDisplaySlot(DisplaySlot.BELOW_NAME);
                break;
            default:
                objectiveName = manager.getDisplaySlot(DisplaySlot.SIDEBAR);
        }
        return ScoreObjectives.getObjectives(objectiveName);
    }

    get name() {
        return this._pnxScoreObject.getObjectiveName();
    }

    get displayName() {
        return this._pnxScoreObject.getDisplayName();
    }


    /**
     * 获取跟踪的某个目标的分数
     * @param target {Player|Entity|string} 实体对象
     * @returns {number|null} 该目标 / 玩家在此计分项中的分数
     */
    getScore(target) {
        const scoreboard = this._pnxScoreObject;
        const [wildcard, scorers] = parseTarget(target, scoreboard);
        if (scorers.isEmpty() || wildcard) {
            return null;
        }
        for (let scorer of scorers) {
            if (scoreboard.getLines().containsKey(scorer)) {
                scoreboard.getLines().get(scorer);
            } else {
                return 0;
            }
        }
    }

    /**
     * 修改某个目标的分数
     * @param target {Player|Entity|string} 实体对象
     * @param score {number} 分数
     * @returns {number|null} 该目标 / 玩家在操作后的分数
     */
    setScore(target, score) {
        const scoreboard = this._pnxScoreObject;
        const [wildcard, scorers] = parseTarget(target, scoreboard);
        if (scorers.isEmpty() || wildcard) {
            return null;
        }
        for (let scorer of scorers) {
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
        const scoreboard = this._pnxScoreObject;
        const [wildcard, scorers] = parseTarget(target, scoreboard);
        if (scorers.isEmpty() || wildcard) {
            return null;
        }
        for (let scorer of scorers) {
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
        const scoreboard = this._pnxScoreObject;
        const [wildcard, scorers] = parseTarget(target, scoreboard);
        if (scorers.isEmpty() || wildcard) {
            return null;
        }
        for (let scorer of scorers) {
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
     * @param target {Player|Entity|string} 实体对象，允许 *
     * @returns {boolean} 是否成功删除
     */
    deleteScore(target) {
        const scoreboard = this._pnxScoreObject;
        const [wildcard, scorers] = parseTarget(target, scoreboard);
        if (scorers.isEmpty()) {
            return false;
        }
        for (let scorer of scorers) {
            scoreboard.removeLine(scorer);
        }
        return true;
    }

    /**
     * 设置计分项的显示状态
     * @param slot {string} 显示槽位名称字符串，可以为 sidebar/belowname/list
     * @param [sortOrder=0] {number} 排序方式，可以为 0(升序) 或 1(降序)（默认0）
     * @returns {boolean} 是否设置成功
     */
    setDisplay(slot, sortOrder = 0) {
        const manager = server.getScoreboardManager();
        if (!manager.hasScoreboard(this._pnxScoreObject.getObjectiveName())) {// 没有该记分榜时
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
        manager.setDisplay(slot, this._pnxScoreObject.getObjectiveName());
        this._pnxScoreObject.setSortOrder(sortOrder ? SortOrder.DESCENDING : SortOrder.ASCENGING);
        return true;
    }
}

/**
 * 解析目标
 * @param target {Entity|string} 目标
 * @param scoreboard {cn.nukkit.scoreboard.scoreboard.IScoreboard} 记分榜对象
 * @returns {(boolean|java.util.ArrayList)[]} 返回数组为 是否为通配符，目标列表
 */
export function parseTarget(target, scoreboard) {
    let scorers = new JList();
    let wildcard = false;
    if (scoreboard === null) {
        return [wildcard, scorers];
    }
    if (Object.is(target, "*")) {// 所有追踪的对象
        wildcard = true;
        scorers.addAll(scoreboard.getLines().keySet());
    } else if (server.getPlayer(target) != null) {// 玩家名
        scorers.add(server.getPlayer(target))
    } else if (target instanceof Player) {// 玩家对象
        scorers.add(new PlayerScorer(target._PNXPlayer));
    } else if (target instanceof Entity) {// 实体对象
        scorers.add(new EntityScorer(target._PNXEntity));
    } else {// 字符串
        scorers.add(new FakeScorer(target.toString()));
    }
    return [wildcard, scorers];
}