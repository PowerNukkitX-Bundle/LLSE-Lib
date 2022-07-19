declare module ":powernukkitx" {
    declare class EventPriority {
        static LOWEST;
        static LOW;
        static NORMAL;
        static HIGH;
        static HIGHEST;
        static MONITOR;
    }

    /**
     * 可以是任意事件名，不一定非得是这里声明了的
     */
    declare type EventNames = "cn.nukkit.event.Event" | "cn.nukkit.event.block.AnvilDamageEvent" | "cn.nukkit.event.server.BatchPacketsEvent" |
        "cn.nukkit.event.block.BellRingEvent" | "cn.nukkit.event.block.BigDripleafTiltChangeEvent" | "cn.nukkit.event.block.BlockBreakEvent" |
        "cn.nukkit.event.block.BlockBurnEvent" | "cn.nukkit.event.block.BlockEvent" | "cn.nukkit.event.block.BlockExplodeEvent" |
        "cn.nukkit.event.block.BlockExplosionPrimeEvent" | "cn.nukkit.event.block.BlockFadeEvent" | "cn.nukkit.event.block.BlockFallEvent" |
        "cn.nukkit.event.block.BlockFormEvent" | "cn.nukkit.event.block.BlockFromToEvent" | "cn.nukkit.event.block.BlockGrowEvent" |
        "cn.nukkit.event.block.BlockHarvestEvent" | "cn.nukkit.event.block.BlockIgniteEvent" | "cn.nukkit.event.block.BlockPistonChangeEvent" |
        "cn.nukkit.event.block.BlockPistonEvent" | "cn.nukkit.event.block.BlockPlaceEvent" | "cn.nukkit.event.block.BlockRedstoneEvent" |
        "cn.nukkit.event.block.BlockSpreadEvent" | "cn.nukkit.event.blockstate.BlockStateRepairEvent" | "cn.nukkit.event.blockstate.BlockStateRepairFinishEvent" |
        "cn.nukkit.event.block.BlockUpdateEvent" | "cn.nukkit.event.inventory.BrewEvent" | "cn.nukkit.event.inventory.CampfireSmeltEvent" |
        "cn.nukkit.event.block.CauldronFilledByDrippingLiquidEvent" | "cn.nukkit.event.level.ChunkEvent" | "cn.nukkit.event.level.ChunkLoadEvent" |
        "cn.nukkit.event.level.ChunkPopulateEvent" | "cn.nukkit.event.level.ChunkUnloadEvent" | "cn.nukkit.event.command.CommandBlockExecuteEvent" |
        "cn.nukkit.event.block.ComposterEmptyEvent" | "cn.nukkit.event.block.ComposterFillEvent" | "cn.nukkit.event.block.ConduitActivateEvent" |
        "cn.nukkit.event.block.ConduitDeactivateEvent" | "cn.nukkit.event.inventory.CraftItemEvent" | "cn.nukkit.event.entity.CreatureSpawnEvent" |
        "cn.nukkit.event.entity.CreeperPowerEvent" | "cn.nukkit.event.server.DataPacketReceiveEvent" | "cn.nukkit.event.server.DataPacketSendEvent" |
        "cn.nukkit.event.block.DoorToggleEvent" | "cn.nukkit.event.inventory.EnchantItemEvent" | "cn.nukkit.event.entity.EntityArmorChangeEvent" |
        "cn.nukkit.event.entity.EntityBlockChangeEvent" | "cn.nukkit.event.entity.EntityCombustByBlockEvent" | "cn.nukkit.event.entity.EntityCombustByEntityEvent" |
        "cn.nukkit.event.entity.EntityCombustEvent" | "cn.nukkit.event.entity.EntityDamageBlockedEvent" | "cn.nukkit.event.entity.EntityDamageByBlockEvent" |
        "cn.nukkit.event.entity.EntityDamageByChildEntityEvent" | "cn.nukkit.event.entity.EntityDamageByEntityEvent" | "cn.nukkit.event.entity.EntityDamageEvent" |
        "cn.nukkit.event.entity.EntityDeathEvent" | "cn.nukkit.event.entity.EntityDespawnEvent" | "cn.nukkit.event.entity.EntityEffectRemoveEvent" |
        "cn.nukkit.event.entity.EntityEffectUpdateEvent" | "cn.nukkit.event.vehicle.EntityEnterVehicleEvent" | "cn.nukkit.event.entity.EntityEvent" |
        "cn.nukkit.event.vehicle.EntityExitVehicleEvent" | "cn.nukkit.event.entity.EntityExplodeEvent" | "cn.nukkit.event.entity.EntityExplosionPrimeEvent" |
        "cn.nukkit.event.entity.EntityFallEvent" | "cn.nukkit.event.entity.EntityInteractEvent" | "cn.nukkit.event.entity.EntityInventoryChangeEvent" |
        "cn.nukkit.event.entity.EntityLevelChangeEvent" | "cn.nukkit.event.entity.EntityMotionEvent" | "cn.nukkit.event.entity.EntityMoveByPistonEvent" |
        "cn.nukkit.event.entity.EntityPortalEnterEvent" | "cn.nukkit.event.entity.EntityRegainHealthEvent" | "cn.nukkit.event.entity.EntityShootBowEvent" |
        "cn.nukkit.event.entity.EntityShootCrossbowEvent" | "cn.nukkit.event.entity.EntitySpawnEvent" | "cn.nukkit.event.entity.EntityTeleportEvent" |
        "cn.nukkit.event.entity.EntityVehicleEnterEvent" | "cn.nukkit.event.entity.EntityVehicleExitEvent" | "cn.nukkit.event.entity.ExplosionPrimeEvent" |
        "cn.nukkit.event.inventory.FurnaceBurnEvent" | "cn.nukkit.event.inventory.FurnaceSmeltEvent" | "cn.nukkit.event.inventory.GrindstoneEvent" |
        "cn.nukkit.event.inventory.InventoryClickEvent" | "cn.nukkit.event.inventory.InventoryCloseEvent" | "cn.nukkit.event.inventory.InventoryEvent" |
        "cn.nukkit.event.inventory.InventoryMoveItemEvent" | "cn.nukkit.event.inventory.InventoryOpenEvent" | "cn.nukkit.event.inventory.InventoryPickupArrowEvent" |
        "cn.nukkit.event.inventory.InventoryPickupItemEvent" | "cn.nukkit.event.inventory.InventoryPickupTridentEvent" | "cn.nukkit.event.inventory.InventoryTransactionEvent" |
        "cn.nukkit.event.entity.ItemDespawnEvent" | "cn.nukkit.event.block.ItemFrameDropItemEvent" | "cn.nukkit.event.entity.ItemSpawnEvent" | "cn.nukkit.event.block.LeavesDecayEvent" |
        "cn.nukkit.event.block.LecternDropBookEvent" | "cn.nukkit.event.block.LecternPageChangeEvent" | "cn.nukkit.event.block.LecternPlaceBookEvent" | "cn.nukkit.event.level.LevelEvent" |
        "cn.nukkit.event.level.LevelInitEvent" | "cn.nukkit.event.level.LevelLoadEvent" | "cn.nukkit.event.level.LevelSaveEvent" | "cn.nukkit.event.level.LevelUnloadEvent" |
        "cn.nukkit.event.weather.LightningStrikeEvent" | "cn.nukkit.event.block.LiquidFlowEvent" | "cn.nukkit.event.player.PlayerAchievementAwardedEvent" |
        "cn.nukkit.event.player.PlayerAnimationEvent" | "cn.nukkit.event.player.PlayerAsyncPreLoginEvent" | "cn.nukkit.event.player.PlayerBedEnterEvent" |
        "cn.nukkit.event.player.PlayerBedLeaveEvent" | "cn.nukkit.event.player.PlayerBlockPickEvent" | "cn.nukkit.event.player.PlayerBucketEmptyEvent" |
        "cn.nukkit.event.player.PlayerBucketFillEvent" | "cn.nukkit.event.player.PlayerChangeSkinEvent" | "cn.nukkit.event.player.PlayerChatEvent" |
        "cn.nukkit.event.player.PlayerChunkRequestEvent" | "cn.nukkit.event.player.PlayerCommandPreprocessEvent" | "cn.nukkit.event.player.PlayerCreationEvent" |
        "cn.nukkit.event.server.PlayerDataSerializeEvent" | "cn.nukkit.event.player.PlayerDeathEvent" | "cn.nukkit.event.player.PlayerDialogRespondedEvent" |
        "cn.nukkit.event.player.PlayerDropItemEvent" | "cn.nukkit.event.player.PlayerEatFoodEvent" | "cn.nukkit.event.player.PlayerEditBookEvent" |
        "cn.nukkit.event.player.PlayerEvent" | "cn.nukkit.event.player.PlayerExperienceChangeEvent" | "cn.nukkit.event.player.PlayerFishEvent" |
        "cn.nukkit.event.player.PlayerFoodLevelChangeEvent" | "cn.nukkit.event.player.PlayerFormRespondedEvent" | "cn.nukkit.event.player.PlayerFreezeEvent" |
        "cn.nukkit.event.player.PlayerGameModeChangeEvent" | "cn.nukkit.event.player.PlayerGlassBottleFillEvent" | "cn.nukkit.event.player.PlayerInteractEntityEvent" |
        "cn.nukkit.event.player.PlayerInteractEvent" | "cn.nukkit.event.player.PlayerInvalidMoveEvent" | "cn.nukkit.event.player.PlayerItemConsumeEvent" |
        "cn.nukkit.event.player.PlayerItemHeldEvent" | "cn.nukkit.event.player.PlayerJoinEvent" | "cn.nukkit.event.player.PlayerJumpEvent" |
        "cn.nukkit.event.player.PlayerKickEvent" | "cn.nukkit.event.player.PlayerLocallyInitializedEvent" | "cn.nukkit.event.player.PlayerLoginEvent" |
        "cn.nukkit.event.player.PlayerMapInfoRequestEvent" | "cn.nukkit.event.player.PlayerMessageEvent" | "cn.nukkit.event.player.PlayerMouseOverEntityEvent" |
        "cn.nukkit.event.player.PlayerMoveEvent" | "cn.nukkit.event.player.PlayerPreLoginEvent" | "cn.nukkit.event.player.PlayerQuitEvent" |
        "cn.nukkit.event.player.PlayerRespawnEvent" | "cn.nukkit.event.player.PlayerServerSettingsRequestEvent" | "cn.nukkit.event.player.PlayerSettingsRespondedEvent" |
        "cn.nukkit.event.player.PlayerShowCreditsEvent" | "cn.nukkit.event.player.PlayerTeleportEvent" | "cn.nukkit.event.player.PlayerToggleFlightEvent" |
        "cn.nukkit.event.player.PlayerToggleGlideEvent" | "cn.nukkit.event.player.PlayerToggleSneakEvent" | "cn.nukkit.event.player.PlayerToggleSpinAttackEvent" |
        "cn.nukkit.event.player.PlayerToggleSprintEvent" | "cn.nukkit.event.player.PlayerToggleSwimEvent" | "cn.nukkit.event.inventory.PlayerTypingAnvilInventoryEvent" |
        "cn.nukkit.event.plugin.PluginDisableEvent" | "cn.nukkit.event.plugin.PluginEnableEvent" | "cn.nukkit.event.plugin.PluginEvent" |
        "cn.nukkit.event.potion.PotionApplyEvent" | "cn.nukkit.event.potion.PotionCollideEvent" | "cn.nukkit.event.potion.PotionEvent" |
        "cn.nukkit.event.entity.ProjectileHitEvent" | "cn.nukkit.event.entity.ProjectileLaunchEvent" | "cn.nukkit.event.server.QueryRegenerateEvent" |
        "cn.nukkit.event.redstone.RedstoneUpdateEvent" | "cn.nukkit.event.server.RemoteServerCommandEvent" | "cn.nukkit.event.inventory.RepairItemEvent" |
        "cn.nukkit.event.command.ScoreboardEvent" | "cn.nukkit.event.command.ScoreboardObjectiveChangeEvent" | "cn.nukkit.event.command.ScoreboardScoreChangeEvent" |
        "cn.nukkit.event.server.ServerCommandEvent" | "cn.nukkit.event.server.ServerEvent" | "cn.nukkit.event.server.ServerStopEvent" | "cn.nukkit.event.block.SignChangeEvent" |
        "cn.nukkit.event.block.SignColorChangeEvent" | "cn.nukkit.event.block.SignGlowEvent" | "cn.nukkit.event.inventory.SmithingTableEvent" | "cn.nukkit.event.level.SpawnChangeEvent" |
        "cn.nukkit.event.inventory.StartBrewEvent" | "cn.nukkit.event.level.StructureGrowEvent" | "cn.nukkit.event.level.ThunderChangeEvent" |
        "cn.nukkit.event.block.TurtleEggHatchEvent" | "cn.nukkit.event.vehicle.VehicleCreateEvent" | "cn.nukkit.event.vehicle.VehicleDamageByEntityEvent" |
        "cn.nukkit.event.vehicle.VehicleDamageEvent" | "cn.nukkit.event.vehicle.VehicleDestroyByEntityEvent" | "cn.nukkit.event.vehicle.VehicleDestroyEvent" |
        "cn.nukkit.event.vehicle.VehicleEvent" | "cn.nukkit.event.vehicle.VehicleMoveEvent" | "cn.nukkit.event.vehicle.VehicleUpdateEvent" |
        "cn.nukkit.event.block.WaterFrostEvent" | "cn.nukkit.event.level.WeatherChangeEvent" | "cn.nukkit.event.level.WeatherEvent";

    declare type PowerNukkitXEvents = {
        "cn.nukkit.event.Event": cn.nukkit.event.Event,
        "cn.nukkit.event.block.AnvilDamageEvent": cn.nukkit.event.block.AnvilDamageEvent,
        "cn.nukkit.event.server.BatchPacketsEvent": cn.nukkit.event.server.BatchPacketsEvent,
        "cn.nukkit.event.block.BellRingEvent": cn.nukkit.event.block.BellRingEvent,
        "cn.nukkit.event.block.BigDripleafTiltChangeEvent": cn.nukkit.event.block.BigDripleafTiltChangeEvent,
        "cn.nukkit.event.block.BlockBreakEvent": cn.nukkit.event.block.BlockBreakEvent,
        "cn.nukkit.event.block.BlockBurnEvent": cn.nukkit.event.block.BlockBurnEvent,
        "cn.nukkit.event.block.BlockEvent": cn.nukkit.event.block.BlockEvent,
        "cn.nukkit.event.block.BlockExplodeEvent": cn.nukkit.event.block.BlockExplodeEvent,
        "cn.nukkit.event.block.BlockExplosionPrimeEvent": cn.nukkit.event.block.BlockExplosionPrimeEvent,
        "cn.nukkit.event.block.BlockFadeEvent": cn.nukkit.event.block.BlockFadeEvent,
        "cn.nukkit.event.block.BlockFallEvent": cn.nukkit.event.block.BlockFallEvent,
        "cn.nukkit.event.block.BlockFormEvent": cn.nukkit.event.block.BlockFormEvent,
        "cn.nukkit.event.block.BlockFromToEvent": cn.nukkit.event.block.BlockFromToEvent,
        "cn.nukkit.event.block.BlockGrowEvent": cn.nukkit.event.block.BlockGrowEvent,
        "cn.nukkit.event.block.BlockHarvestEvent": cn.nukkit.event.block.BlockHarvestEvent,
        "cn.nukkit.event.block.BlockIgniteEvent": cn.nukkit.event.block.BlockIgniteEvent,
        "cn.nukkit.event.block.BlockPistonChangeEvent": cn.nukkit.event.block.BlockPistonChangeEvent,
        "cn.nukkit.event.block.BlockPistonEvent": cn.nukkit.event.block.BlockPistonEvent,
        "cn.nukkit.event.block.BlockPlaceEvent": cn.nukkit.event.block.BlockPlaceEvent,
        "cn.nukkit.event.block.BlockRedstoneEvent": cn.nukkit.event.block.BlockRedstoneEvent,
        "cn.nukkit.event.block.BlockSpreadEvent": cn.nukkit.event.block.BlockSpreadEvent,
        "cn.nukkit.event.blockstate.BlockStateRepairEvent": cn.nukkit.event.blockstate.BlockStateRepairEvent,
        "cn.nukkit.event.blockstate.BlockStateRepairFinishEvent": cn.nukkit.event.blockstate.BlockStateRepairFinishEvent,
        "cn.nukkit.event.block.BlockUpdateEvent": cn.nukkit.event.block.BlockUpdateEvent,
        "cn.nukkit.event.inventory.BrewEvent": cn.nukkit.event.inventory.BrewEvent,
        "cn.nukkit.event.inventory.CampfireSmeltEvent": cn.nukkit.event.inventory.CampfireSmeltEvent,
        "cn.nukkit.event.block.CauldronFilledByDrippingLiquidEvent": cn.nukkit.event.block.CauldronFilledByDrippingLiquidEvent,
        "cn.nukkit.event.level.ChunkEvent": cn.nukkit.event.level.ChunkEvent,
        "cn.nukkit.event.level.ChunkLoadEvent": cn.nukkit.event.level.ChunkLoadEvent,
        "cn.nukkit.event.level.ChunkPopulateEvent": cn.nukkit.event.level.ChunkPopulateEvent,
        "cn.nukkit.event.level.ChunkUnloadEvent": cn.nukkit.event.level.ChunkUnloadEvent,
        "cn.nukkit.event.command.CommandBlockExecuteEvent": cn.nukkit.event.command.CommandBlockExecuteEvent,
        "cn.nukkit.event.block.ComposterEmptyEvent": cn.nukkit.event.block.ComposterEmptyEvent,
        "cn.nukkit.event.block.ComposterFillEvent": cn.nukkit.event.block.ComposterFillEvent,
        "cn.nukkit.event.block.ConduitActivateEvent": cn.nukkit.event.block.ConduitActivateEvent,
        "cn.nukkit.event.block.ConduitDeactivateEvent": cn.nukkit.event.block.ConduitDeactivateEvent,
        "cn.nukkit.event.inventory.CraftItemEvent": cn.nukkit.event.inventory.CraftItemEvent,
        "cn.nukkit.event.entity.CreatureSpawnEvent": cn.nukkit.event.entity.CreatureSpawnEvent,
        "cn.nukkit.event.entity.CreeperPowerEvent": cn.nukkit.event.entity.CreeperPowerEvent,
        "cn.nukkit.event.server.DataPacketReceiveEvent": cn.nukkit.event.server.DataPacketReceiveEvent,
        "cn.nukkit.event.server.DataPacketSendEvent": cn.nukkit.event.server.DataPacketSendEvent,
        "cn.nukkit.event.block.DoorToggleEvent": cn.nukkit.event.block.DoorToggleEvent,
        "cn.nukkit.event.inventory.EnchantItemEvent": cn.nukkit.event.inventory.EnchantItemEvent,
        "cn.nukkit.event.entity.EntityArmorChangeEvent": cn.nukkit.event.entity.EntityArmorChangeEvent,
        "cn.nukkit.event.entity.EntityBlockChangeEvent": cn.nukkit.event.entity.EntityBlockChangeEvent,
        "cn.nukkit.event.entity.EntityCombustByBlockEvent": cn.nukkit.event.entity.EntityCombustByBlockEvent,
        "cn.nukkit.event.entity.EntityCombustByEntityEvent": cn.nukkit.event.entity.EntityCombustByEntityEvent,
        "cn.nukkit.event.entity.EntityCombustEvent": cn.nukkit.event.entity.EntityCombustEvent,
        "cn.nukkit.event.entity.EntityDamageBlockedEvent": cn.nukkit.event.entity.EntityDamageBlockedEvent,
        "cn.nukkit.event.entity.EntityDamageByBlockEvent": cn.nukkit.event.entity.EntityDamageByBlockEvent,
        "cn.nukkit.event.entity.EntityDamageByChildEntityEvent": cn.nukkit.event.entity.EntityDamageByChildEntityEvent,
        "cn.nukkit.event.entity.EntityDamageByEntityEvent": cn.nukkit.event.entity.EntityDamageByEntityEvent,
        "cn.nukkit.event.entity.EntityDamageEvent": cn.nukkit.event.entity.EntityDamageEvent,
        "cn.nukkit.event.entity.EntityDeathEvent": cn.nukkit.event.entity.EntityDeathEvent,
        "cn.nukkit.event.entity.EntityDespawnEvent": cn.nukkit.event.entity.EntityDespawnEvent,
        "cn.nukkit.event.entity.EntityEffectRemoveEvent": cn.nukkit.event.entity.EntityEffectRemoveEvent,
        "cn.nukkit.event.entity.EntityEffectUpdateEvent": cn.nukkit.event.entity.EntityEffectUpdateEvent,
        "cn.nukkit.event.vehicle.EntityEnterVehicleEvent": cn.nukkit.event.vehicle.EntityEnterVehicleEvent,
        "cn.nukkit.event.entity.EntityEvent": cn.nukkit.event.entity.EntityEvent,
        "cn.nukkit.event.vehicle.EntityExitVehicleEvent": cn.nukkit.event.vehicle.EntityExitVehicleEvent,
        "cn.nukkit.event.entity.EntityExplodeEvent": cn.nukkit.event.entity.EntityExplodeEvent,
        "cn.nukkit.event.entity.EntityExplosionPrimeEvent": cn.nukkit.event.entity.EntityExplosionPrimeEvent,
        "cn.nukkit.event.entity.EntityFallEvent": cn.nukkit.event.entity.EntityFallEvent,
        "cn.nukkit.event.entity.EntityInteractEvent": cn.nukkit.event.entity.EntityInteractEvent,
        "cn.nukkit.event.entity.EntityInventoryChangeEvent": cn.nukkit.event.entity.EntityInventoryChangeEvent,
        "cn.nukkit.event.entity.EntityLevelChangeEvent": cn.nukkit.event.entity.EntityLevelChangeEvent,
        "cn.nukkit.event.entity.EntityMotionEvent": cn.nukkit.event.entity.EntityMotionEvent,
        "cn.nukkit.event.entity.EntityMoveByPistonEvent": cn.nukkit.event.entity.EntityMoveByPistonEvent,
        "cn.nukkit.event.entity.EntityPortalEnterEvent": cn.nukkit.event.entity.EntityPortalEnterEvent,
        "cn.nukkit.event.entity.EntityRegainHealthEvent": cn.nukkit.event.entity.EntityRegainHealthEvent,
        "cn.nukkit.event.entity.EntityShootBowEvent": cn.nukkit.event.entity.EntityShootBowEvent,
        "cn.nukkit.event.entity.EntityShootCrossbowEvent": cn.nukkit.event.entity.EntityShootCrossbowEvent,
        "cn.nukkit.event.entity.EntitySpawnEvent": cn.nukkit.event.entity.EntitySpawnEvent,
        "cn.nukkit.event.entity.EntityTeleportEvent": cn.nukkit.event.entity.EntityTeleportEvent,
        "cn.nukkit.event.entity.EntityVehicleEnterEvent": cn.nukkit.event.entity.EntityVehicleEnterEvent,
        "cn.nukkit.event.entity.EntityVehicleExitEvent": cn.nukkit.event.entity.EntityVehicleExitEvent,
        "cn.nukkit.event.entity.ExplosionPrimeEvent": cn.nukkit.event.entity.ExplosionPrimeEvent,
        "cn.nukkit.event.inventory.FurnaceBurnEvent": cn.nukkit.event.inventory.FurnaceBurnEvent,
        "cn.nukkit.event.inventory.FurnaceSmeltEvent": cn.nukkit.event.inventory.FurnaceSmeltEvent,
        "cn.nukkit.event.inventory.GrindstoneEvent": cn.nukkit.event.inventory.GrindstoneEvent,
        "cn.nukkit.event.inventory.InventoryClickEvent": cn.nukkit.event.inventory.InventoryClickEvent,
        "cn.nukkit.event.inventory.InventoryCloseEvent": cn.nukkit.event.inventory.InventoryCloseEvent,
        "cn.nukkit.event.inventory.InventoryEvent": cn.nukkit.event.inventory.InventoryEvent,
        "cn.nukkit.event.inventory.InventoryMoveItemEvent": cn.nukkit.event.inventory.InventoryMoveItemEvent,
        "cn.nukkit.event.inventory.InventoryOpenEvent": cn.nukkit.event.inventory.InventoryOpenEvent,
        "cn.nukkit.event.inventory.InventoryPickupArrowEvent": cn.nukkit.event.inventory.InventoryPickupArrowEvent,
        "cn.nukkit.event.inventory.InventoryPickupItemEvent": cn.nukkit.event.inventory.InventoryPickupItemEvent,
        "cn.nukkit.event.inventory.InventoryPickupTridentEvent": cn.nukkit.event.inventory.InventoryPickupTridentEvent,
        "cn.nukkit.event.inventory.InventoryTransactionEvent": cn.nukkit.event.inventory.InventoryTransactionEvent,
        "cn.nukkit.event.entity.ItemDespawnEvent": cn.nukkit.event.entity.ItemDespawnEvent,
        "cn.nukkit.event.block.ItemFrameDropItemEvent": cn.nukkit.event.block.ItemFrameDropItemEvent,
        "cn.nukkit.event.entity.ItemSpawnEvent": cn.nukkit.event.entity.ItemSpawnEvent,
        "cn.nukkit.event.block.LeavesDecayEvent": cn.nukkit.event.block.LeavesDecayEvent,
        "cn.nukkit.event.block.LecternDropBookEvent": cn.nukkit.event.block.LecternDropBookEvent,
        "cn.nukkit.event.block.LecternPageChangeEvent": cn.nukkit.event.block.LecternPageChangeEvent,
        "cn.nukkit.event.block.LecternPlaceBookEvent": cn.nukkit.event.block.LecternPlaceBookEvent,
        "cn.nukkit.event.level.LevelEvent": cn.nukkit.event.level.LevelEvent,
        "cn.nukkit.event.level.LevelInitEvent": cn.nukkit.event.level.LevelInitEvent,
        "cn.nukkit.event.level.LevelLoadEvent": cn.nukkit.event.level.LevelLoadEvent,
        "cn.nukkit.event.level.LevelSaveEvent": cn.nukkit.event.level.LevelSaveEvent,
        "cn.nukkit.event.level.LevelUnloadEvent": cn.nukkit.event.level.LevelUnloadEvent,
        "cn.nukkit.event.weather.LightningStrikeEvent": cn.nukkit.event.weather.LightningStrikeEvent,
        "cn.nukkit.event.block.LiquidFlowEvent": cn.nukkit.event.block.LiquidFlowEvent,
        "cn.nukkit.event.player.PlayerAchievementAwardedEvent": cn.nukkit.event.player.PlayerAchievementAwardedEvent,
        "cn.nukkit.event.player.PlayerAnimationEvent": cn.nukkit.event.player.PlayerAnimationEvent,
        "cn.nukkit.event.player.PlayerAsyncPreLoginEvent": cn.nukkit.event.player.PlayerAsyncPreLoginEvent,
        "cn.nukkit.event.player.PlayerBedEnterEvent": cn.nukkit.event.player.PlayerBedEnterEvent,
        "cn.nukkit.event.player.PlayerBedLeaveEvent": cn.nukkit.event.player.PlayerBedLeaveEvent,
        "cn.nukkit.event.player.PlayerBlockPickEvent": cn.nukkit.event.player.PlayerBlockPickEvent,
        "cn.nukkit.event.player.PlayerBucketEmptyEvent": cn.nukkit.event.player.PlayerBucketEmptyEvent,
        "cn.nukkit.event.player.PlayerBucketFillEvent": cn.nukkit.event.player.PlayerBucketFillEvent,
        "cn.nukkit.event.player.PlayerChangeSkinEvent": cn.nukkit.event.player.PlayerChangeSkinEvent,
        "cn.nukkit.event.player.PlayerChatEvent": cn.nukkit.event.player.PlayerChatEvent,
        "cn.nukkit.event.player.PlayerChunkRequestEvent": cn.nukkit.event.player.PlayerChunkRequestEvent,
        "cn.nukkit.event.player.PlayerCommandPreprocessEvent": cn.nukkit.event.player.PlayerCommandPreprocessEvent,
        "cn.nukkit.event.player.PlayerCreationEvent": cn.nukkit.event.player.PlayerCreationEvent,
        "cn.nukkit.event.server.PlayerDataSerializeEvent": cn.nukkit.event.server.PlayerDataSerializeEvent,
        "cn.nukkit.event.player.PlayerDeathEvent": cn.nukkit.event.player.PlayerDeathEvent,
        "cn.nukkit.event.player.PlayerDialogRespondedEvent": cn.nukkit.event.player.PlayerDialogRespondedEvent,
        "cn.nukkit.event.player.PlayerDropItemEvent": cn.nukkit.event.player.PlayerDropItemEvent,
        "cn.nukkit.event.player.PlayerEatFoodEvent": cn.nukkit.event.player.PlayerEatFoodEvent,
        "cn.nukkit.event.player.PlayerEditBookEvent": cn.nukkit.event.player.PlayerEditBookEvent,
        "cn.nukkit.event.player.PlayerEvent": cn.nukkit.event.player.PlayerEvent,
        "cn.nukkit.event.player.PlayerExperienceChangeEvent": cn.nukkit.event.player.PlayerExperienceChangeEvent,
        "cn.nukkit.event.player.PlayerFishEvent": cn.nukkit.event.player.PlayerFishEvent,
        "cn.nukkit.event.player.PlayerFoodLevelChangeEvent": cn.nukkit.event.player.PlayerFoodLevelChangeEvent,
        "cn.nukkit.event.player.PlayerFormRespondedEvent": cn.nukkit.event.player.PlayerFormRespondedEvent,
        "cn.nukkit.event.player.PlayerFreezeEvent": cn.nukkit.event.player.PlayerFreezeEvent,
        "cn.nukkit.event.player.PlayerGameModeChangeEvent": cn.nukkit.event.player.PlayerGameModeChangeEvent,
        "cn.nukkit.event.player.PlayerGlassBottleFillEvent": cn.nukkit.event.player.PlayerGlassBottleFillEvent,
        "cn.nukkit.event.player.PlayerInteractEntityEvent": cn.nukkit.event.player.PlayerInteractEntityEvent,
        "cn.nukkit.event.player.PlayerInteractEvent": cn.nukkit.event.player.PlayerInteractEvent,
        "cn.nukkit.event.player.PlayerInvalidMoveEvent": cn.nukkit.event.player.PlayerInvalidMoveEvent,
        "cn.nukkit.event.player.PlayerItemConsumeEvent": cn.nukkit.event.player.PlayerItemConsumeEvent,
        "cn.nukkit.event.player.PlayerItemHeldEvent": cn.nukkit.event.player.PlayerItemHeldEvent,
        "cn.nukkit.event.player.PlayerJoinEvent": cn.nukkit.event.player.PlayerJoinEvent,
        "cn.nukkit.event.player.PlayerJumpEvent": cn.nukkit.event.player.PlayerJumpEvent,
        "cn.nukkit.event.player.PlayerKickEvent": cn.nukkit.event.player.PlayerKickEvent,
        "cn.nukkit.event.player.PlayerLocallyInitializedEvent": cn.nukkit.event.player.PlayerLocallyInitializedEvent,
        "cn.nukkit.event.player.PlayerLoginEvent": cn.nukkit.event.player.PlayerLoginEvent,
        "cn.nukkit.event.player.PlayerMapInfoRequestEvent": cn.nukkit.event.player.PlayerMapInfoRequestEvent,
        "cn.nukkit.event.player.PlayerMessageEvent": cn.nukkit.event.player.PlayerMessageEvent,
        "cn.nukkit.event.player.PlayerMouseOverEntityEvent": cn.nukkit.event.player.PlayerMouseOverEntityEvent,
        "cn.nukkit.event.player.PlayerMoveEvent": cn.nukkit.event.player.PlayerMoveEvent,
        "cn.nukkit.event.player.PlayerPreLoginEvent": cn.nukkit.event.player.PlayerPreLoginEvent,
        "cn.nukkit.event.player.PlayerQuitEvent": cn.nukkit.event.player.PlayerQuitEvent,
        "cn.nukkit.event.player.PlayerRespawnEvent": cn.nukkit.event.player.PlayerRespawnEvent,
        "cn.nukkit.event.player.PlayerServerSettingsRequestEvent": cn.nukkit.event.player.PlayerServerSettingsRequestEvent,
        "cn.nukkit.event.player.PlayerSettingsRespondedEvent": cn.nukkit.event.player.PlayerSettingsRespondedEvent,
        "cn.nukkit.event.player.PlayerShowCreditsEvent": cn.nukkit.event.player.PlayerShowCreditsEvent,
        "cn.nukkit.event.player.PlayerTeleportEvent": cn.nukkit.event.player.PlayerTeleportEvent,
        "cn.nukkit.event.player.PlayerToggleFlightEvent": cn.nukkit.event.player.PlayerToggleFlightEvent,
        "cn.nukkit.event.player.PlayerToggleGlideEvent": cn.nukkit.event.player.PlayerToggleGlideEvent,
        "cn.nukkit.event.player.PlayerToggleSneakEvent": cn.nukkit.event.player.PlayerToggleSneakEvent,
        "cn.nukkit.event.player.PlayerToggleSpinAttackEvent": cn.nukkit.event.player.PlayerToggleSpinAttackEvent,
        "cn.nukkit.event.player.PlayerToggleSprintEvent": cn.nukkit.event.player.PlayerToggleSprintEvent,
        "cn.nukkit.event.player.PlayerToggleSwimEvent": cn.nukkit.event.player.PlayerToggleSwimEvent,
        "cn.nukkit.event.inventory.PlayerTypingAnvilInventoryEvent": cn.nukkit.event.inventory.PlayerTypingAnvilInventoryEvent,
        "cn.nukkit.event.plugin.PluginDisableEvent": cn.nukkit.event.plugin.PluginDisableEvent,
        "cn.nukkit.event.plugin.PluginEnableEvent": cn.nukkit.event.plugin.PluginEnableEvent,
        "cn.nukkit.event.plugin.PluginEvent": cn.nukkit.event.plugin.PluginEvent,
        "cn.nukkit.event.potion.PotionApplyEvent": cn.nukkit.event.potion.PotionApplyEvent,
        "cn.nukkit.event.potion.PotionCollideEvent": cn.nukkit.event.potion.PotionCollideEvent,
        "cn.nukkit.event.potion.PotionEvent": cn.nukkit.event.potion.PotionEvent,
        "cn.nukkit.event.entity.ProjectileHitEvent": cn.nukkit.event.entity.ProjectileHitEvent,
        "cn.nukkit.event.entity.ProjectileLaunchEvent": cn.nukkit.event.entity.ProjectileLaunchEvent,
        "cn.nukkit.event.server.QueryRegenerateEvent": cn.nukkit.event.server.QueryRegenerateEvent,
        "cn.nukkit.event.redstone.RedstoneUpdateEvent": cn.nukkit.event.redstone.RedstoneUpdateEvent,
        "cn.nukkit.event.server.RemoteServerCommandEvent": cn.nukkit.event.server.RemoteServerCommandEvent,
        "cn.nukkit.event.inventory.RepairItemEvent": cn.nukkit.event.inventory.RepairItemEvent,
        "cn.nukkit.event.command.ScoreboardEvent": cn.nukkit.event.command.ScoreboardEvent,
        "cn.nukkit.event.command.ScoreboardObjectiveChangeEvent": cn.nukkit.event.command.ScoreboardObjectiveChangeEvent,
        "cn.nukkit.event.command.ScoreboardScoreChangeEvent": cn.nukkit.event.command.ScoreboardScoreChangeEvent,
        "cn.nukkit.event.server.ServerCommandEvent": cn.nukkit.event.server.ServerCommandEvent,
        "cn.nukkit.event.server.ServerEvent": cn.nukkit.event.server.ServerEvent,
        "cn.nukkit.event.server.ServerStopEvent": cn.nukkit.event.server.ServerStopEvent,
        "cn.nukkit.event.block.SignChangeEvent": cn.nukkit.event.block.SignChangeEvent,
        "cn.nukkit.event.block.SignColorChangeEvent": cn.nukkit.event.block.SignColorChangeEvent,
        "cn.nukkit.event.block.SignGlowEvent": cn.nukkit.event.block.SignGlowEvent,
        "cn.nukkit.event.inventory.SmithingTableEvent": cn.nukkit.event.inventory.SmithingTableEvent,
        "cn.nukkit.event.level.SpawnChangeEvent": cn.nukkit.event.level.SpawnChangeEvent,
        "cn.nukkit.event.inventory.StartBrewEvent": cn.nukkit.event.inventory.StartBrewEvent,
        "cn.nukkit.event.level.StructureGrowEvent": cn.nukkit.event.level.StructureGrowEvent,
        "cn.nukkit.event.level.ThunderChangeEvent": cn.nukkit.event.level.ThunderChangeEvent,
        "cn.nukkit.event.block.TurtleEggHatchEvent": cn.nukkit.event.block.TurtleEggHatchEvent,
        "cn.nukkit.event.vehicle.VehicleCreateEvent": cn.nukkit.event.vehicle.VehicleCreateEvent,
        "cn.nukkit.event.vehicle.VehicleDamageByEntityEvent": cn.nukkit.event.vehicle.VehicleDamageByEntityEvent,
        "cn.nukkit.event.vehicle.VehicleDamageEvent": cn.nukkit.event.vehicle.VehicleDamageEvent,
        "cn.nukkit.event.vehicle.VehicleDestroyByEntityEvent": cn.nukkit.event.vehicle.VehicleDestroyByEntityEvent,
        "cn.nukkit.event.vehicle.VehicleDestroyEvent": cn.nukkit.event.vehicle.VehicleDestroyEvent,
        "cn.nukkit.event.vehicle.VehicleEvent": cn.nukkit.event.vehicle.VehicleEvent,
        "cn.nukkit.event.vehicle.VehicleMoveEvent": cn.nukkit.event.vehicle.VehicleMoveEvent,
        "cn.nukkit.event.vehicle.VehicleUpdateEvent": cn.nukkit.event.vehicle.VehicleUpdateEvent,
        "cn.nukkit.event.block.WaterFrostEvent": cn.nukkit.event.block.WaterFrostEvent,
        "cn.nukkit.event.level.WeatherChangeEvent": cn.nukkit.event.level.WeatherChangeEvent,
        "cn.nukkit.event.level.WeatherEvent": cn.nukkit.event.level.WeatherEvent
    }

    type cmdBuilder = {
        getCommandName: () => string,
        setCommandName: (string) => cmdBuilder,
        getDescription: () => string,
        setDescription: (string) => cmdBuilder,
        getUsageMessage: () => string,
        setUsageMessage: (string) => cmdBuilder,
        getAlias: () => string[],
        setAlias: (...string) => cmdBuilder,
        addAlias: (...string) => cmdBuilder,
        getPermission: () => string,
        setPermission: (string) => cmdBuilder,
        getPermissionMessage: () => string,
        setPermissionMessage: (string) => cmdBuilder,
        getCommandParameters: () => Map<string, Object[]>,
        setCommandParameters: (parameterJavaMap: Map<string, Object[]>) => cmdBuilder,
        getCallback: () => (sender: sender, args: string[]) => void,
        setCallback: (callback: (sender: sender, args: string[]) => void) => cmdBuilder,
        createCommandPattern: (string) => cmdBuilder,
        createDefaultPattern: () => cmdBuilder,
        addTypeParameter: (name: string, optional: boolean, commandParamType: Object) => cmdBuilder,
        addIntParameter: (name: string, optional: boolean) => cmdBuilder,
        addFloatParameter: (name: string, optional: boolean) => cmdBuilder,
        addValueParameter: (name: string, optional: boolean) => cmdBuilder,
        addWildcardIntParameter: (name: string, optional: boolean) => cmdBuilder,
        addTargetParameter: (name: string, optional: boolean) => cmdBuilder,
        addWildcardTargetParameter: (name: string, optional: boolean) => cmdBuilder,
        addStringParameter: (name: string, optional: boolean) => cmdBuilder,
        addBlockPositionParameter: (name: string, optional: boolean) => cmdBuilder,
        addPositionParameter: (name: string, optional: boolean) => cmdBuilder,
        addMessageParameter: (name: string, optional: boolean) => cmdBuilder,
        addTextParameter: (name: string, optional: boolean) => cmdBuilder,
        addJsonParameter: (name: string, optional: boolean) => cmdBuilder,
        addSubCommandParameter: (name: string, optional: boolean) => cmdBuilder,
        addFilePathParameter: (name: string, optional: boolean) => cmdBuilder,
        addOperatorParameter: (name: string, optional: boolean) => cmdBuilder,
        addEnumParameter: (name: string, optional: boolean, ...string) => cmdBuilder,
        register: () => boolean
    };

    type EventHandler<T> = {
        (T): void;
    }

    declare const PowerNukkitX = {
        getVersion(): string { },
        listenEvent<E extends string & keyof PowerNukkitXEvents>(fullEventName: `${E}`, priority: EventPriority, callback: (event: PowerNukkitXEvents[E]) => void): boolean { },
        commandBuilder(): cmdBuilder { }
    }
}

declare module ":concurrent" {
    class JSSafeObject<T> {
        atomicUse(): T;
        use(): Promise<T>;
        endUse(): void;
        getTimeout(): number;
        setTimeout(timeout: number): number;
    }

    declare class Job {
        constructor(sourcePath: string, startImmediately = true);
        start(): void;
        work(...args): Promise<any>;
        terminate(): void;
    }

    declare class Worker {
        constructor(sourcePath: string, startImmediately = true);
        onmessage: (...args) => void;
        start(): void;
        postMessageAsync(...args): Promise<any>;
        postMessage(...args): any;
        terminate(): void;
    }

    declare function atomic<T>(object: T): JSSafeObject<T> { };
    declare function getAtomicTimeout(): number { };
    declare function setAtomicTimeout(timeout: number): void { };
}
