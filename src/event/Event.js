import {PowerNukkitX as pnx, EventPriority} from ':powernukkitx';
import {Player} from '../object/Player.js';
import {Item} from '../object/Item.js';
import {Block} from '../object/Block.js';
import {Server} from 'cn.nukkit.Server';
import {Player as PnxPlayer} from 'cn.nukkit.Player';
import {EntityDamageEvent} from 'cn.nukkit.event.entity.EntityDamageEvent';
import {PlayerInteractEvent} from 'cn.nukkit.event.player.PlayerInteractEvent';
import {ItemID} from 'cn.nukkit.item.ItemID';
import {ContainerInventory} from 'cn.nukkit.inventory.ContainerInventory';
import {PlayerEnderChestInventory} from 'cn.nukkit.inventory.PlayerEnderChestInventory';
import {PlayerInventory} from 'cn.nukkit.inventory.PlayerInventory';
import {SlotChangeAction} from 'cn.nukkit.inventory.transaction.action.SlotChangeAction';
import {DamageCause} from '../utils/DamageCause.js';

const server = Server.getInstance();
const PNXDamageCause = EntityDamageEvent.DamageCause;
const EventNameMap = {  /* Entity Events */
    "onMobDie": 33,
    "onEntityExplode": 35,
    "onProjectileHitEntity": 36,
    "onWitherBossDestroy": 37,
    "onRide": 38,
    "onStepOnPressurePlate": 39,
    "onSpawnProjectile": 40,
    "onProjectileCreated": 41,
    "onNpcCmd": 42,
    "onChangeArmorStand": 43,
    "onEntityTransformation": 44,
    /* Block Events */
    "onBlockInteracted": 10,
    "onBlockChanged": 10,
    "onBlockExplode": 10,
    "onRespawnAnchorExplode": 10,
    "onBlockExploded": 10,
    "onFireSpread": 10,
    "onCmdBlockExecute": 10,
    "onContainerChange": 10,
    "onProjectileHitBlock": 10,
    "onRedStoneUpdate": 10,
    "onHopperSearchItem": 10,
    "onHopperPushOut": 10,
    "onPistonTryPush": 10,
    "onPistonPush": 10,
    "onFarmLandDecay": 10,
    "onUseFrameBlock": 10,
    "onLiquidFlow": 10,
    /* Other Events */
    "onTick": 10,
    "onConsoleCmd": 10,
    "onConsoleOutput": 10,
    /* Economic Events */
    "onMoneyAdd": 10,
    "onMoneyReduce": 10,
    "onMoneyTrans": 10,
    'onMoneySet': 10,
    "beforeMoneyAdd": 10,
    "beforeMoneyReduce": 10,
    "beforeMoneyTrans": 10,
    "beforeMoneySet": 10,
    /* Outdated Events */
    "onAttack": 10,
    "onExplode": 10,
    "onBedExplode": 10,
    /* Internal */
    "onFormSelected": 10,
    "EVENT_COUNT": 0
};
/* 玩家事件 */
const onPreJoin = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerPreLoginEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            let cancel = callback(Player.getPlayer(player));
            if (cancel === false) event.setCancelled(true);
        });
    }
}

/**
 * @todo 测试
 */
const onJoin = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerLocallyInitializedEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            callback(Player.getPlayer(player));
        });
    }
}

/**
 * @todo 测试
 */
const onLeft = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerQuitEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            callback(Player.getPlayer(player));
        });
    }
}

/**
 * @todo 测试
 */
const onRespawn = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerRespawnEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            callback(Player.getPlayer(player));
        });
    }
}

const onPlayerDie = {
    run: (callback) => {
        let e1 = pnx.listenEvent("cn.nukkit.event.entity.EntityDamageEvent", EventPriority.NORMAL, event => {
            if (event.getCause() != EntityDamageEvent.DamageCause.ENTITY_ATTACK) {
                let player = event.getEntity();
                if (player instanceof PnxPlayer) {
                    if (player.getHealth() - event.getDamage() <= 0.2) {
                        callback(Player.getPlayer(player), null);
                    }
                }
            }
        });
        let e2 = pnx.listenEvent("cn.nukkit.event.entity.EntityDamageByEntityEvent", EventPriority.NORMAL, event => {
            let player = event.getEntity();
            if (player instanceof PnxPlayer) {
                let damager = event.getDamager();
                if (player.getHealth() - event.getDamage() <= 0.2) {
                    callback(Player.getPlayer(player), damager);
                }
            }
        });
        return e1 && e2;
    }
}

const onPlayerCmd = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerCommandPreprocessEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            let cmd = event.getMessage();
            let cancel = callback(Player.getPlayer(player), cmd);
            if (cancel === false) event.setCancelled(true);
        });
    }
}

/**
 * @todo 测试
 */
const onChat = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerChatEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            let cmd = event.getMessage();
            let cancel = callback(Player.getPlayer(player), cmd);
            if (cancel === false) event.setCancelled(true);
        });
    }
}

/**
 * @todo 测试
 */
const onChangeDim = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.entity.EntityLevelChangeEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            if (player instanceof PnxPlayer) {
                let dimension = event.getTarget.getDimension();
                callback(Player.getPlayer(player), dimension);
            }
        });
    }
}

const onJump = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerJumpEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            callback(Player.getPlayer(player));
        });
    }
}

/**
 * @todo 测试
 */
const onSneak = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerToggleSneakEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            let isSneak = event.isSneaking();
            callback(Player.getPlayer(player), isSneak);
        });
    }
}

/**
 * @todo 测试
 */
const onAttackEntity = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerInteractEntityEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            let entity = event.getEntity();
            let cancel = callback(Player.getPlayer(player), entity);
            if (cancel === false) event.setCancelled(true);
        });
    }
}

/**
 * @todo 测试
 */
const onAttackBlock = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerInteractEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            if (event.getAction() === PlayerInteractEvent.Action.LEFT_CLICK_BLOCK) {
                let item = event.getItem();
                let block = event.getBlock();
                let cancel = callback(Player.getPlayer(player), Block.get(block), Item.newItem(item, null));
                if (cancel === false) event.setCancelled(true);
            }
        });
    }
}

/**
 * @todo 测试
 */
const onUseItem = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerInteractEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            if (event.getAction() === PlayerInteractEvent.Action.RIGHT_CLICK_AIR || event.getAction() === PlayerInteractEvent.Action.RIGHT_CLICK_BLOCK) {
                let item = event.getItem();
                let cancel = callback(Player.getPlayer(player), Item.newItem(item, null));
                if (cancel === false) event.setCancelled(true);
            }
        });
    }
}

/**
 * @todo 测试
 */
const onUseItemOn = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerInteractEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            if (event.getAction() === PlayerInteractEvent.Action.RIGHT_CLICK_BLOCK) {
                let item = event.getItem();
                let block = event.getBlock();
                let face = event.getFace().getIndex();
                let cancel = callback(Player.getPlayer(player), Item.newItem(item, null), Block.get(block), face);
                if (cancel === false) event.setCancelled(true);
            }
        });
    }
}

/**
 * @todo itemEntity 需改为LLSE类型
 * @todo 测试
 */
const onTakeItem = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.inventory.InventoryPickupItemEvent", EventPriority.NORMAL, event => {
            let player = event.getViewers()[0];
            let itemEntity = event.getItem();
            let item = event.getItem().getItem();
            let cancel = callback(Player.getPlayer(player), itemEntity, Item.newItem(item, null));
            if (cancel === false) event.setCancelled(true);
        });
    }
}

const onEat = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerItemConsumeEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            let item = event.getItem();
            let cancel = callback(Player.getPlayer(player), Item.newItem(item, null));
            if (cancel === false) event.setCancelled(true);
        });
    }
}

const onDropItem = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerDropItemEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            let item = event.getItem();
            let cancel = callback(Player.getPlayer(player), Item.newItem(item, null));
            if (cancel === false) event.setCancelled(true);
        });
    }
}

const onConsumeTotem = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.entity.EntityDamageEvent", EventPriority.NORMAL, event => {
            let player = event.getEntity();
            if (player instanceof PnxPlayer) {
                if (player.getInventory().getItemInHand().getId() === ItemID.TOTEM) {
                    if (player.getHealth() - event.getDamage() <= 0.2) {
                        let cancel = callback(Player.getPlayer(player));
                        if (cancel === false) event.setCancelled(true);
                    }
                }
            }
        });
    }
}

const onEffectAdded = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.potion.PotionApplyEvent", EventPriority.NORMAL, event => {
            let player = event.getEntity();
            if (player instanceof PnxPlayer) {
                let effect = event.getApplyEffect().getName();
                let cancel = callback(Player.getPlayer(player), effect);
                if (cancel === false) event.setCancelled(true);
            }
        });
    }
}

const onEffectRemoved = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerEffectRemoveEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            if (player instanceof PnxPlayer) {
                let effect = event.getRemoveEffect().getName();
                let cancel = callback(Player.getPlayer(player), effect);
                if (cancel === false) event.setCancelled(true);
            }
        });
    }
}

const onEffectUpdated = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerEffectUpdateEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            if (player instanceof PnxPlayer) {
                let effect = event.getUpdateEffect().getName();
                let cancel = callback(Player.getPlayer(player), effect);
                if (cancel === false) event.setCancelled(true);
            }
        });
    }
}

/**
 * @todo 测试
 */
const onStartDestroyBlock = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerInteractEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            if (event.getAction() === PlayerInteractEvent.Action.LEFT_CLICK_BLOCK || event.getAction() === PlayerInteractEvent.Action.LEFT_CLICK_AIR) {
                let block = event.getBlock();
                callback(Player.getPlayer(player), Block.get(block));
            }
        });
    }
}

/**
 * @todo 测试
 */
const onDestroyBlock = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.block.BlockBreakEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            let block = event.getBlock();
            let cancel = callback(Player.getPlayer(player), Block.get(block));
            if (cancel === false) event.setCancelled(true);
        });
    }
}

/**
 * @todo 测试
 */
const onPlaceBlock = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.block.BlockPlaceEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            let block = event.getBlock();
            let cancel = callback(Player.getPlayer(player), Block.get(block));
            if (cancel === false) event.setCancelled(true);
        });
    }
}

const onOpenContainer = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.inventory.InventoryOpenEvent", EventPriority.NORMAL, event => {
            if (event.getInventory() instanceof ContainerInventory || event.getInventory() instanceof PlayerEnderChestInventory) {
                let player = event.getPlayer();
                let block = player.getTargetBlock(player.getViewDistance());
                let cancel = callback(Player.getPlayer(player), Block.get(block));
                if (cancel === false) event.setCancelled(true);
            }
        });
    }
}

const onCloseContainer = {
    run: (callback) => {
        var map = new Map();
        let e1 = pnx.listenEvent("cn.nukkit.event.inventory.InventoryOpenEvent", EventPriority.NORMAL, event => {
            if (event.getInventory() instanceof ContainerInventory || event.getInventory() instanceof PlayerEnderChestInventory) {
                let player = event.getPlayer();
                map.set(player, player.getTargetBlock(player.getViewDistance()));
            }
        });
        let e2 = pnx.listenEvent("cn.nukkit.event.inventory.InventoryCloseEvent", EventPriority.NORMAL, event => {
            if (event.getInventory() instanceof ContainerInventory || event.getInventory() instanceof PlayerEnderChestInventory) {
                let player = event.getPlayer();
                let cancel = callback(Player.getPlayer(player), map.get(player));
                if (cancel === false) event.setCancelled(true);
            }
        });
        return e1 && e2;
    }
}

const onInventoryChange = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.inventory.InventoryTransactionEvent", EventPriority.NORMAL, event => {
            let player = event.getTransaction().getSource();
            for (let Action of event.getTransaction().getActionList()) {
                if (Action instanceof SlotChangeAction) {
                    if (Action.getInventory() instanceof PlayerInventory) {
                        let slotNum = Action.getSlot();
                        let oldItem = (Action.getSourceItem().getId() === 0) ? null : Action.getSourceItem();
                        let newItem = (Action.getTargetItem().getId() === 0) ? null : Action.getTargetItem();
                        callback(Player.getPlayer(player), slotNum, oldItem, newItem);
                    }
                }
            }
        });
    }
}

const onMove = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerMoveEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            let floatPos;
            callback(Player.getPlayer(player), floatPos);
        });
    }
}

const onChangeSprinting = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerToggleSprintEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            let sprinting = event.isSprinting();
            callback(Player.getPlayer(player), sprinting);
        });
    }
}

const onSetArmor = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.entity.EntityArmorChangeEvent", EventPriority.NORMAL, event => {
            let player = event.getEntity();
            if (player instanceof PnxPlayer) {
                let slotNum = event.getSlot();
                let item = event.getOldItem();
                callback(Player.getPlayer(player), slotNum, Item.newItem(item, null));
            }
        });
    }
}

const onUseRespawnAnchor = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerRespawnEvent", EventPriority.NORMAL, event => {
            let pos = event.getRespawnBlockPosition();
            if (pos && pos.getLevel().getDimension() === 1) {
                let player = event.getPlayer();
                let cancel = callback(Player.getPlayer(player), pos);
                if (cancel === false) {
                    let spawnPos = player.getServer().getDefaultLevel().getSafeSpawn();
                    if (spawnPos) event.setRespawnPosition(spawnPos);
                    event.setConsumeCharge(true);
                }
            }
        });
    }
}

const onOpenContainerScreen = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.inventory.InventoryOpenEvent", EventPriority.NORMAL, event => {
            if (event.getInventory() instanceof ContainerInventory || event.getInventory() instanceof PlayerEnderChestInventory) {
                let player = event.getPlayer();
                let cancel = callback(Player.getPlayer(player));
                if (cancel === false) event.setCancelled(true);
            }
        });
    }
}
/* 实体事件 */
const onMobHurt = {
    run: (callback) => {
        let e1 = pnx.listenEvent("cn.nukkit.event.entity.EntityDamageEvent", EventPriority.NORMAL, event => {
            if (event.getCause() !== EntityDamageEvent.DamageCause.ENTITY_ATTACK) {
                let entity = event.getEntity();
                let cancel = callback(entity, null, event.getDamage(), DamageCause.getCause(event.getCause()));
                if (cancel === false) event.setCancelled(true);
            }
        });
        let e2 = pnx.listenEvent("cn.nukkit.event.entity.EntityDamageByEntityEvent", EventPriority.NORMAL, event => {
            let entity = event.getEntity();
            let cancel = callback(entity, event.getDamager(), event.getDamage(), DamageCause.getCause(PNXDamageCause.ENTITY_ATTACK));
            if (cancel === false) event.setCancelled(true);
        });
        return e1 && e2;
    }
}

/* 其他事件 */
/**
 * @todo 测试
 */
const onScoreChanged = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.command.ScoreboardScoreChangeEvent", EventPriority.NORMAL, event => {
            if (event.getInventory() instanceof ContainerInventory || event.getInventory() instanceof PlayerEnderChestInventory) {
                const scorer = event.getScorer();
                const score = event.getScoreboard();
                if (scorer.getScorerType() !== 1) {
                    return;
                }
                callback(Player.getPlayer(server.getPlayer(scorer.getName())), event.getNewValue(), score.getObjectiveName(), score.getDisplayName());
            }
        });
    }
}

const onServerStarted = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.server.ServerStartedEvent", EventPriority.NORMAL, event => {
            callback();
        });
    }
}
export const Event = {
    // 玩家事件
    onPreJoin: onPreJoin,//count=0
    onJoin: onJoin,
    onLeft: onLeft,
    onRespawn: onRespawn,
    onPlayerDie: onPlayerDie,
    onPlayerCmd: onPlayerCmd,
    onChat: onChat,
    onChangeDim: onChangeDim,
    onJump: onJump,
    onSneak: onSneak,
    onAttackEntity: onAttackEntity,
    onAttackBlock: onAttackBlock,
    onUseItem: onUseItem,
    onUseItemOn: onUseItemOn,
    onTakeItem: onTakeItem,
    onEat: onEat,
    onDropItem: onDropItem,
    onConsumeTotem: onConsumeTotem,
    onEffectAdded: onEffectAdded,
    onEffectRemoved: onEffectRemoved,
    onEffectUpdated: onEffectUpdated,
    onStartDestroyBlock: onStartDestroyBlock,
    onDestroyBlock: onDestroyBlock,
    onPlaceBlock: onPlaceBlock,
    onOpenContainer: onOpenContainer,
    onCloseContainer: onCloseContainer,
    onInventoryChange: onInventoryChange,
    onMove: onMove,
    onChangeSprinting: onChangeSprinting,
    onSetArmor: onSetArmor,
    onUseRespawnAnchor: onUseRespawnAnchor,
    onOpenContainerScreen: onOpenContainerScreen,
    // 实体事件
    onMobHurt: onMobHurt,
    // 方块事件
    // 其它事件
    onScoreChanged: onScoreChanged,
    onServerStarted: onServerStarted
    // 经济事件
}
