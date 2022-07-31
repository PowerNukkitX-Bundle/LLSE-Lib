import { EntityDamageEvent } from 'cn.nukkit.event.entity.EntityDamageEvent';

const JDamageCause = EntityDamageEvent.DamageCause;

/**
 * 伤害原因枚举
 */
export class DamageCause {
    static None = -0x01;
    static Override = 0x00;
    static Contact = 0x01;
    static EntityAttack = 0x02;
    static Projectile = 0x03;
    static Suffocation = 0x04;
    static Fall = 0x05;
    static Fire = 0x06;
    static FireTick = 0x07;
    static Lava = 0x08;
    static Drowning = 0x09;
    static BlockExplosion = 0x0A;
    static EntityExplosion = 0x0B;
    static Void = 0x0C;
    static Suicide = 0x0D;
    static Magic = 0x0E;
    static Wither = 0x0F;
    static Starve = 0x10;
    static Anvil = 0x11;//没实现
    static Thorns = 0x12;
    static FallingBlock = 0x13;
    static Piston = 0x14;//没实现
    static FlyIntoWall = 0x15;
    static Magma = 0x16;
    static Fireworks = 0x17;
    static Lightning = 0x18;
    static Charging = 0x19;//没实现
    static Temperature = 0x1A;//无法细分
    static Freezing = 0x1B;
    static Stalactite = 0x1C;//没实现
    static Stalagmite = 0x1D;//没实现
    static All = 0x1F;

    static getCause(Cause) {
        switch (Cause) {
            case JDamageCause.NONE:
                return DamageCause.None;
            case JDamageCause.CONTACT:
                return DamageCause.Contact;
            case JDamageCause.ENTITY_ATTACK:
                return DamageCause.EntityAttack;
            case JDamageCause.PROJECTILE:
                return DamageCause.Projectile;
            case JDamageCause.SUFFOCATION:
                return DamageCause.Suffocation;
            case JDamageCause.FALL:
                return DamageCause.Fall;
            case JDamageCause.FIRE:
                return DamageCause.Fire;
            case JDamageCause.FIRE_TICK:
                return DamageCause.FireTick;
            case JDamageCause.LAVA:
                return DamageCause.Lava;
            case JDamageCause.DROWNING:
                return DamageCause.Drowning;
            case JDamageCause.BLOCK_EXPLOSION:
                return DamageCause.BlockExplosion;
            case JDamageCause.ENTITY_EXPLOSION:
                return DamageCause.EntityExplosion;
            case JDamageCause.VOID:
                return DamageCause.Void;
            case JDamageCause.SUICIDE:
                return DamageCause.Suicide;
            case JDamageCause.MAGIC:
                return DamageCause.Magic;
            case JDamageCause.CUSTOM:
                return DamageCause.Override;
            case JDamageCause.LIGHTNING:
                return DamageCause.Lightning;
            case JDamageCause.HUNGER:
                return DamageCause.Starve;
            case JDamageCause.WITHER:
                return DamageCause.Wither;
            case JDamageCause.THORNS:
                return DamageCause.Thorns;
            case JDamageCause.FALLING_BLOCK:
                return DamageCause.FallingBlock;
            case JDamageCause.FLYING_INTO_WALL:
                return DamageCause.FlyIntoWall;
            case JDamageCause.HOT_FLOOR:
                return DamageCause.Magma;
            case JDamageCause.FIREWORKS:
                return DamageCause.Fireworks;
            case JDamageCause.FREEZING:
                return DamageCause.Freezing;
            default:
                return DamageCause.All;
        }
    }
}

