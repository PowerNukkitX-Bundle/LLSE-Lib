import { EventPriority, PowerNukkitX as pnx } from ':powernukkitx';
import { Player } from '../object/Player.js';
import { Entity } from '../object/Entity.js';
import { Block } from '../object/Block.js';
import { server } from '../utils/util.js'
import { Player as PNXPlayer } from 'cn.nukkit.Player';
import { EntityDamageEvent } from 'cn.nukkit.event.entity.EntityDamageEvent';
import { PlayerInteractEvent } from 'cn.nukkit.event.player.PlayerInteractEvent';
import { ItemID } from 'cn.nukkit.item.ItemID';
import { ContainerInventory } from 'cn.nukkit.inventory.ContainerInventory';
import { PlayerEnderChestInventory } from 'cn.nukkit.inventory.PlayerEnderChestInventory';
import { PlayerInventory } from 'cn.nukkit.inventory.PlayerInventory';
import { SlotChangeAction } from 'cn.nukkit.inventory.transaction.action.SlotChangeAction';
import { BlockPressurePlateBase } from 'cn.nukkit.block.BlockPressurePlateBase';
import { EntityArrow } from 'cn.nukkit.entity.projectile.EntityArrow';
import { EntityEgg } from 'cn.nukkit.entity.projectile.EntityEgg';
import { EntityFishingHook } from 'cn.nukkit.entity.item.EntityFishingHook';
import { EntityEnderPearl } from 'cn.nukkit.entity.projectile.EntityEnderPearl';
import { EntitySnowball } from 'cn.nukkit.entity.projectile.EntitySnowball';
import { EntityThrownTrident } from 'cn.nukkit.entity.projectile.EntityThrownTrident';
import { BlockTNT } from 'cn.nukkit.block.BlockTNT';
import { DamageCause } from '../utils/DamageCause.js';
import { Item } from '../object/Item.js';
import { IntPos } from '../object/IntPos.js';
import { FloatPos } from '../object/FloatPos.js';

const PNXDamageCause = EntityDamageEvent.DamageCause;
const EventNameMap = {  /* Entity Events */
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
            if (event.getCause() !== EntityDamageEvent.DamageCause.ENTITY_ATTACK) {
                let player = event.getEntity();
                if (player instanceof PNXPlayer) {
                    if (player.getHealth() - event.getDamage() <= 0.2) {
                        callback(Player.getPlayer(player), null);
                    }
                }
            }
        });
        let e2 = pnx.listenEvent("cn.nukkit.event.entity.EntityDamageByEntityEvent", EventPriority.NORMAL, event => {
            let player = event.getEntity();
            if (player instanceof PNXPlayer) {
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
            if (player instanceof PNXPlayer) {
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
            let cancel = callback(Player.getPlayer(player), new Entity(entity));
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
                let cancel = callback(Player.getPlayer(player), Block.get(block), new Item(item));
                if (cancel === false) event.setCancelled(true);
            }
        });
    }
}

/**
 * @todo LLSE只有在Click Air的时候才会触发
 */
const onUseItem = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerInteractEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            if (event.getAction() === PlayerInteractEvent.Action.RIGHT_CLICK_AIR) {
                let item = event.getItem();
                let cancel = callback(Player.getPlayer(player), new Item(item));
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
                let cancel = callback(Player.getPlayer(player), new Item(item), Block.get(block), face);
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
            let cancel = callback(Player.getPlayer(player), itemEntity, new Item(item));
            if (cancel === false) event.setCancelled(true);
        });
    }
}

const onEat = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerItemConsumeEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            let item = event.getItem();
            let cancel = callback(Player.getPlayer(player), new Item(item));
            if (cancel === false) event.setCancelled(true);
        });
    }
}

const onDropItem = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerDropItemEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            let item = event.getItem();
            let cancel = callback(Player.getPlayer(player), new Item(item));
            if (cancel === false) event.setCancelled(true);
        });
    }
}

const onConsumeTotem = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.entity.EntityDamageEvent", EventPriority.NORMAL, event => {
            let player = event.getEntity();
            if (player instanceof PNXPlayer) {
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
            if (player instanceof PNXPlayer) {
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
            if (player instanceof PNXPlayer) {
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
            if (player instanceof PNXPlayer) {
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
        let e1 = pnx.listenEvent("cn.nukkit.event.inventory.InventoryOpenEvent", EventPriority.LOWEST, event => {
            if (event.getInventory() instanceof ContainerInventory || event.getInventory() instanceof PlayerEnderChestInventory) {
                let player = event.getPlayer();
                map.set(player, player.getTargetBlock(player.getViewDistance()));
            }
        });
        let e2 = pnx.listenEvent("cn.nukkit.event.inventory.InventoryCloseEvent", EventPriority.NORMAL, event => {
            if (event.getInventory() instanceof ContainerInventory || event.getInventory() instanceof PlayerEnderChestInventory) {
                let player = event.getPlayer();
                let cancel = callback(Player.getPlayer(player), new Block(map.get(player)));
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
            if (player instanceof PNXPlayer) {
                let slotNum = event.getSlot();
                let item = event.getOldItem();
                callback(Player.getPlayer(player), slotNum, new Item(item));
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

/**
 * @todo 测试
 */
const onExperienceAdd = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerExperienceChangeEvent", EventPriority.NORMAL, event => {
            let oldExp = event.getOldExperience();
            let newExp = event.getNewExperience();
            let oldLevel = event.getOldExperienceLevel();
            let newLevel = event.getNewExperienceLevel();
            let player = event.getPlayer();
            if (newLevel === oldLevel) {
                if (newExp >= oldExp) {
                    let cancel = callback(Player.getPlayer(player, newExp - oldExp));
                    if (cancel === false) event.setCancelled(true);
                }
            } else if (newLevel > oldLevel) {
                let add = newExp;
                for (let i = 0, len = newLevel - oldLevel; i < len; ++i) {
                    add += PNXPlayer.calculateRequireExperience(newLevel - i);
                }
                add += PNXPlayer.calculateRequireExperience(oldLevel) - oldExp;
                let cancel = callback(Player.getPlayer(player, add));
                if (cancel === false) event.setCancelled(true);
            }
        });
    }
}
/**
 * @todo 测试
 */
const onBedEnter = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerBedEnterEvent", EventPriority.NORMAL, event => {
            let player = Player.getPlayer(event.getPlayer());
            let pos = new IntPos(event.getBed());
            let cancel = callback(player, pos);
            if (cancel === false) event.setCancelled(true);
        });
    }
}

/* 实体事件 */
const onMobDie = {
    run: (callback) => {
        let e1 = pnx.listenEvent("cn.nukkit.event.entity.EntityDamageEvent", EventPriority.NORMAL, event => {
            if (event.getCause() !== EntityDamageEvent.DamageCause.ENTITY_ATTACK) {
                let entity = event.getEntity();
                if (entity.getHealth() - event.getDamage() <= 0.2) {
                    callback(new Entity(entity), null, DamageCause.getCause(event.getCause()));
                }
            }
        });
        let e2 = pnx.listenEvent("cn.nukkit.event.entity.EntityDamageByEntityEvent", EventPriority.NORMAL, event => {
            let entity = event.getEntity();
            let damager = event.getDamager();
            if (entity.getHealth() - event.getDamage() <= 0.2) {
                callback(new Entity(entity), new Entity(damager), DamageCause.getCause(PNXDamageCause.ENTITY_ATTACK));
            }
        });
        return e1 && e2;
    }
}

const onMobHurt = {
    run: (callback) => {
        let e1 = pnx.listenEvent("cn.nukkit.event.entity.EntityDamageEvent", EventPriority.NORMAL, event => {
            if (event.getCause() !== EntityDamageEvent.DamageCause.ENTITY_ATTACK) {
                let entity = event.getEntity();
                let cancel = callback(new Entity(entity), null, event.getDamage(), DamageCause.getCause(event.getCause()));
                if (cancel === false) event.setCancelled(true);
            }
        });
        let e2 = pnx.listenEvent("cn.nukkit.event.entity.EntityDamageByEntityEvent", EventPriority.NORMAL, event => {
            let entity = event.getEntity();
            let cancel = callback(new Entity(entity), new Entity(event.getDamager()), event.getDamage(), DamageCause.getCause(PNXDamageCause.ENTITY_ATTACK));
            if (cancel === false) event.setCancelled(true);
        });
        return e1 && e2;
    }
}

const onEntityExplode = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.entity.EntityExplodeEvent", EventPriority.NORMAL, event => {
            let source = new Entity(event.getEntity());
            let pos = new FloatPos(event.getPosition());
            let radius = event.getYield();
            let maxResistance = 999;//pnx没有实现这个事件项
            let isDestroy = !event.getBlockList().isEmpty();
            let isFire = !event.getIgnitions().isEmpty();
            let cancel = callback(source, pos, radius, maxResistance, isDestroy, isFire);
            if (cancel === false) event.setCancelled(true);
        });
    }
}

const onMobSpawn = {
    run: (callback) => {
        //todo pnx暂未实现实体生成
    }
}

const onProjectileHitEntity = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.entity.ProjectileHitEvent", EventPriority.NORMAL, event => {
            let entity = new Entity(event.getMovingObjectPosition().entityHit);
            let source = new Entity(event.getEntity());
            callback(entity, source);
        });
    }
}

const onWitherBossDestroy = {
    run: (callback) => {
        //todo pnx暂未实现凋零BOSS
    }
}

const onRide = {
    run: (callback) => {
        //todo pnx暂未实现生物骑乘
    }
}

const onStepOnPressurePlate = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.entity.EntityInteractEvent", EventPriority.NORMAL, event => {
            let block = event.getBlock();
            if (block instanceof BlockPressurePlateBase) {
                let entity = new Entity(event.getEntity());
                let cancel = callback(entity, new Block(block));
                if (cancel === false) event.setCancelled(true);
            }
        });
    }
}
const onSpawnProjectile = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.entity.ProjectileLaunchEvent", EventPriority.NORMAL, event => {
            let shooter = event.getShooter();
            let entity = event.getEntity();
            let type = "";
            //todo 不完全实现 pnx这个实现也没有监测全部实体
            if (entity instanceof EntityEgg) {
                type = "minecraft:egg";
            } else if (entity instanceof EntityArrow) {
                type = "minecraft:arrow";
            } else if (entity instanceof EntityFishingHook) {
                type = "minecraft:fishing_hook";
            } else if (entity instanceof EntityEnderPearl) {
                type = "minecraft:ender_pearl";
            } else if (entity instanceof EntitySnowball) {
                type = "minecraft:snowball";
            } else if (entity instanceof EntityThrownTrident) {
                type = "minecraft:trident";
            }
            let cancel = callback(new Entity(shooter), type);
            if (cancel === false) event.setCancelled(true);
        });
    }
}

const onProjectileCreated = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.entity.ProjectileLaunchEvent", EventPriority.NORMAL, event => {
            let shooter = event.getShooter();
            let entity = event.getEntity();
            callback(new Entity(shooter), new Entity(entity));
        });
    }
}

const onNpcCmd = {
    run: (callback) => {
        //todo 弄懂这个NPC是啥
    }
}

const onChangeArmorStand = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.entity.PlayerChangeArmorStandEvent", EventPriority.NORMAL, event => {
            let cancel = callback(new Entity(event.getArmorStand()), new Player(event.getPlayer()), event.getSlot());
            if (cancel === false) event.setCancelled(true);
        });
    }
}

const onEntityTransformation = {
    run: (callback) => {
        //todo pnx还没实现村民转变
    }
}

/* 方块事件 */
const onBlockInteracted = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerInteractEvent", EventPriority.NORMAL, event => {
            let b = event.getBlock();
            if (b.getId() !== 0 && b.canBeActivated()) {
                let player = Player.getPlayer(event.getPlayer());
                let block = new Block(b);
                let cancel = callback(player, block);
                if (cancel === false) event.setCancelled(true);
            }
        });
    }
}

const onBlockChanged = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerInteractEvent", EventPriority.NORMAL, event => {

        });
    }
}
const onBlockExplode = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.block.BlockExplodeEvent", EventPriority.NORMAL, event => {
            let block = event.getBlock();
            if (block instanceof BlockTNT) {
                let pos = event.getPosition();
                let affects = event.getAffectedBlocks();
                let ignitions = event.getIgnitions();
                let isDestroy = false;
                let isFire = false;
                if (!affects.isEmpty()) isDestroy = true;
                if (!ignitions.isEmpty()) isFire = true;
                let radius = event.getYield();
                let cancel = callback(block, pos, radius, 999, isDestroy, isFire);
                if (cancel === false) event.setCancelled(true);
            }
        });
    }
}

const onRespawnAnchorExplode = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.block.BlockExplosionPrimeEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            if (player != null) {
                let block = event.getBlock();
                if (block.getId() === 527) {
                    let cancel = callback(new IntPos(block), Player.getPlayer(player));
                    if (cancel === false) event.setCancelled(true);
                }
            }
        });
    }
}

const onBlockExploded = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.entity.EntityExplodeEvent", EventPriority.NORMAL, event => {
            let entity = event.getEntity();
            let blocks = event.getBlockList();
            for (let block of blocks) {
                callback(new Block(block), new Entity(entity));
            }
        });
    }
}

const onFireSpread = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.block.BlockIgniteEvent", EventPriority.NORMAL, event => {
            let block = event.getBlock();
            let cancel = callback(new IntPos(block));
            if (cancel === false) event.setCancelled(true);
        });
    }
}

const onCmdBlockExecute = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.command.CommandBlockExecuteEvent", EventPriority.NORMAL, event => {
            let block = event.getBlock();
            let cmd = event.getCommand();
            let cancel = callback(cmd, new IntPos(block), false);//暂时还没有命令方块矿车，所以是false
            if (cancel === false) event.setCancelled(true);
        });
    }
}

const onContainerChange = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.inventory.InventoryTransactionEvent", EventPriority.NORMAL, event => {
            let transaction = event.getTransaction();
            let player = transaction.getSource();
            let actionList = transaction.getActionList();
            for (let action of actionList) {
                if (action instanceof SlotChangeAction && action.getInventory() instanceof ContainerInventory) {
                    let inv = action.getInventory();
                    let container = new Block(inv.getHolder().getBlock());
                    let slot = action.getSlot();
                    let oldItem = action.getSourceItem();
                    let newItem = action.getTargetItem();
                    callback(player, container, slot, oldItem, newItem);
                }
            }
        });
    }
}

const onProjectileHitBlock = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.entity.ProjectileHitEvent", EventPriority.NORMAL, event => {
            let hit = event.getMovingObjectPosition();
            if (hit.typeOfHit === 0) {
                let entity = event.getEntity();
                let block = entity.getLevel().getBlock(hit.blockX, hit.blockY, hit.blockZ);
                callback(new Block(block), new Entity(entity));
            }
        });
    }
}

const onRedStoneUpdate = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.block.BlockRedstoneEvent", EventPriority.NORMAL, event => {
            let level = event.getNewPower();
            let isActive = level === 0;
            let block = event.getBlock();
            let cancel = callback(new Block(block), level, isActive);
            // if (cancel === false) event.setCancelled(true);//todo
        });
    }
}

const onHopperSearchItem = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.block.HopperSearchItemEvent", EventPriority.NORMAL, event => {
            let pos = event.getHopper().getPosition();
            let isMinecart = event.isMinecart();
            let cancel = callback(new Block(block), level, isActive);
            if (cancel === false) event.setCancelled(true);
        });
    }
}

const onHopperPushOut = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.inventory.InventoryMoveItemEvent", EventPriority.NORMAL, event => {
            let source = event.getSource();
            if (event.getAction().ordinal() === 0 && event.getTargetInventory() !== source.getInventory()) {
                if (source instanceof BlockEntityHopper || source instanceof EntityMinecartHopper) {
                    let pos = source.getPosition();
                    let cancel = callback(new FloatPos(pos));
                    if (cancel === false) event.setCancelled(true);
                }
            }
        });
    }
}

const onPistonTryPush = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.block.BlockPistonEvent", EventPriority.NORMAL, event => {
            let block = event.getBlock();
            let target = event.getBlocks().get(0);
            let cancel = callback(new FloatPos(block), new Block(target));
            if (cancel === false) event.setCancelled(true);
        });
    }
}

const onPistonPush = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.block.BlockPistonEvent", EventPriority.NORMAL, event => {
            let block = event.getBlock();
            let target = event.getBlocks().get(0);
            callback(new FloatPos(block), new Block(target));
        });
    }
}

const onFarmLandDecay = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.block.FarmLandDecayEvent", EventPriority.NORMAL, event => {
            if (event.getEntity() !== null) {
                let block = evnet.getBlock();
                let cancel = callback(new FloatPos(block), new Entity(event.getEntity()));
                if (cancel === false) event.setCancelled(true);
            }
        });
    }
}

const onUseFrameBlock = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.player.PlayerUseItemFrameEvent", EventPriority.NORMAL, event => {
            let player = event.getPlayer();
            let block = event.getBlock();
            let cancel = callback(new Player(player), new Block(block));
            if (cancel === false) event.setCancelled(true);
        });
    }
}

const onLiquidFlow = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.block.LiquidFlowEvent", EventPriority.NORMAL, event => {
            let from = event.getSource();
            let to = event.getTo();
            let cancel = callback(new Block(from), new IntPos(to));
            if (cancel === false) event.setCancelled(true);
        });
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

const onTick = {
    run: (callback) => {
        setInterval(callback, 50);
    }
}

const onConsoleCmd = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.server.ServerCommandEvent", EventPriority.NORMAL, event => {
            let cancel = callback(event.getCommand());
            if (cancel === false) event.setCancelled(true);
        });
    }
}

const onConsoleOutput = {
    run: (callback) => {
        return pnx.listenEvent("cn.nukkit.event.server.ConsoleCommandOutputEvent", EventPriority.NORMAL, event => {
            let cancel = callback(event.getMessage());
            if (cancel === false) event.setCancelled(true);
        });
    }
}

const onMoneyAdd = {
    run: (callback) => {
        return pnx.listenEvent("cn.coolloong.economyevent.MoneyAddEvent", EventPriority.NORMAL, event => {
            callback(event.getXuid(), event.getAmount());
        });
    }
}
const onMoneyReduce = {
    run: (callback) => {
        return pnx.listenEvent("cn.coolloong.economyevent.MoneyReduceEvent", EventPriority.NORMAL, event => {
            callback(event.getXuid(), event.getAmount());
        });
    }
}
const onMoneySet = {
    run: (callback) => {
        return pnx.listenEvent("cn.coolloong.economyevent.MoneySetEvent", EventPriority.NORMAL, event => {
            callback(event.getXuid(), event.getAmount());
        });
    }
}
const onMoneyTrans = {
    run: (callback) => {
        return pnx.listenEvent("cn.coolloong.economyevent.MoneyTransEvent", EventPriority.NORMAL, event => {
            callback(event.getFromXuid(), event.getToXuid(), event.getAmount());
        });
    }
}
const beforeMoneyAdd = {
    run: (callback) => {
        return pnx.listenEvent("cn.coolloong.economyevent.BeforeMoneyAddEvent", EventPriority.NORMAL, event => {
            let cancel = callback(event.getXuid(), event.getAmount());
            if (cancel === false) event.setCancelled(true);
        });
    }
}
const beforeMoneyReduce = {
    run: (callback) => {
        return pnx.listenEvent("cn.coolloong.economyevent.BeforeMoneyReduceEvent", EventPriority.NORMAL, event => {
            let cancel = callback(event.getXuid(), event.getAmount());
            if (cancel === false) event.setCancelled(true);
        });
    }
}
const beforeMoneySet = {
    run: (callback) => {
        return pnx.listenEvent("cn.coolloong.economyevent.BeforeMoneySetEvent", EventPriority.NORMAL, event => {
            let cancel = callback(event.getXuid(), event.getAmount());
            if (cancel === false) event.setCancelled(true);
        });
    }
}
const beforeMoneyTrans = {
    run: (callback) => {
        return pnx.listenEvent("cn.coolloong.economyevent.BeforeMoneyTransEvent", EventPriority.NORMAL, event => {
            let cancel = callback(event.getFromXuid(), event.getToXuid(), event.getAmount());
            if (cancel === false) event.setCancelled(true);
        });
    }
}

export const Event = {
    /*玩家事件*/
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
    onChangeSprinting: onChangeSprinting,
    onSetArmor: onSetArmor,
    onUseRespawnAnchor: onUseRespawnAnchor,
    onOpenContainerScreen: onOpenContainerScreen,
    onExperienceAdd: onExperienceAdd,
    onBedEnter: onBedEnter,
    /*实体事件*/
    onMobDie: onMobDie,
    onMobHurt: onMobHurt,
    onEntityExplode: onEntityExplode,
    // onMobSpawn: onMobSpawn,
    onProjectileHitEntity: onProjectileHitEntity,
    // onWitherBossDestroy: onWitherBossDestroy,
    // onRide: onRide,
    onStepOnPressurePlate: onStepOnPressurePlate,
    onSpawnProjectile: onSpawnProjectile,
    onProjectileCreated: onProjectileCreated,
    onNpcCmd: onNpcCmd,
    onChangeArmorStand: onChangeArmorStand,
    // onEntityTransformation: onEntityTransformation
    /*方块事件*/
    onBlockInteracted: onBlockInteracted,
    // onBlockChanged: onBlockChanged,
    onBlockExplode: onBlockExplode,
    onRespawnAnchorExplode: onRespawnAnchorExplode,
    onBlockExploded: onBlockExploded,
    onFireSpread: onFireSpread,
    onCmdBlockExecute: onCmdBlockExecute,
    onContainerChange: onContainerChange,
    onProjectileHitBlock: onProjectileHitBlock,
    onRedStoneUpdate: onRedStoneUpdate,
    onHopperSearchItem: onHopperSearchItem,
    onHopperPushOut: onHopperPushOut,
    onPistonTryPush: onPistonTryPush,
    onPistonPush: onPistonPush,
    onFarmLandDecay: onFarmLandDecay,
    onUseFrameBlock: onUseFrameBlock,
    onLiquidFlow: onLiquidFlow,
    // 其它事件
    onScoreChanged: onScoreChanged,
    onServerStarted: onServerStarted,
    onConsoleCmd: onConsoleCmd,
    onConsoleOutput: onConsoleOutput,
    // 经济事件
    onMoneyAdd: onMoneyAdd,
    onMoneyReduce: onMoneyReduce,
    onMoneyTrans: onMoneyTrans,
    onMoneySet: onMoneySet,
    beforeMoneyAdd: beforeMoneyAdd,
    beforeMoneyReduce: beforeMoneyReduce,
    beforeMoneyTrans: beforeMoneyTrans,
    beforeMoneySet
}
