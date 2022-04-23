import {PowerNukkitX as pnx, EventPriority} from ':powernukkitx'

const EventNameMap = {  "onPreJoin": "PlayerPreLoginEvent",
                        "onJoin": "PlayerJoinEvent",
                        "onLeft": "PlayerQuitEvent",
                        "onRespawn": "PlayerRespawnEvent", "onPlayerDie": "PlayerDeathEvent", "onPlayerCmd": "PlayerCommandPreprocessEvent", "onChat": 6,
                        "onChangeDim": 7, "onJump": 8, "onSneak": 9, "onAttackEntity": 10, "onAttackBlock": 11, "onUseItem": 12, "onUseItemOn": 13,
                        "onTakeItem": 14, "onDropItem": 15, "onEat": 17, "onConsumeTotem": 18, "onEffectAdded": 19, "onEffectUpdated": 20,
                        "onEffectRemoved": 21, "onStartDestroyBlock": 22, "onDestroyBlock": 23, "onPlaceBlock": 24, "onOpenContainer": 25,
                        "onCloseContainer": 26, "onInventoryChange": 27, "onMove": 28, "onChangeSprinting": 29, "onSetArmor": 30, "onUseRespawnAnchor": 31,
                        "onOpenContainerScreen": 32,
                        /* Entity Events */
                        "onMobDie": 33, "onMobHurt": 34, "onEntityExplode": 35, "onProjectileHitEntity": 36, "onWitherBossDestroy": 37, "onRide": 38,
                        "onStepOnPressurePlate": 39, "onSpawnProjectile": 40, "onProjectileCreated": 41, "onNpcCmd": 42, "onChangeArmorStand": 43,
                        "onEntityTransformation": 44,
                        /* Block Events */
                        "onBlockInteracted": 10, "onBlockChanged": 10, "onBlockExplode": 10, "onRespawnAnchorExplode": 10, "onBlockExploded": 10,
                        "onFireSpread": 10, "onCmdBlockExecute": 10, "onContainerChange": 10, "onProjectileHitBlock": 10, "onRedStoneUpdate": 10,
                        "onHopperSearchItem": 10, "onHopperPushOut": 10, "onPistonTryPush": 10, "onPistonPush": 10, "onFarmLandDecay": 10,
                        "onUseFrameBlock": 10, "onLiquidFlow": 10,
                        /* Other Events */
                        "onScoreChanged": 10, "onTick": 10, "onServerStarted": 10, "onConsoleCmd": 10, "onConsoleOutput": 10,
                        /* Economic Events */
                        "onMoneyAdd": 10, "onMoneyReduce": 10, "onMoneyTrans": 10, 'onMoneySet': 10,
                        "beforeMoneyAdd": 10, "beforeMoneyReduce": 10, "beforeMoneyTrans": 10, "beforeMoneySet": 10,
                        /* Outdated Events */
                        "onAttack": 10, "onExplode": 10, "onBedExplode": 10,
                        /* Internal */
                        "onFormSelected": 10, "EVENT_COUNT":0};



const onPreJoin = {
    run: (callback)=>{
        pnx.listenEvent("cn.nukkit.event.player.PlayerPreLoginEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            callback(player);
        });
    }
}

const onJump = {
    run: (callback)=>{
        pnx.listenEvent("cn.nukkit.event.player.PlayerJumpEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            callback(player);
        });
    }
}

export const Event = {
    onPreJoin: onPreJoin,
    onJump: onJump
}