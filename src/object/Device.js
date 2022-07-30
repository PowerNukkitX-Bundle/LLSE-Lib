import { Player } from './Player.js';

/**
 * 玩家设备信息对象
 * @class
 * @param player {JPlayer} 玩家对象
 * @returns {Device} 设备信息对象
 */
export class Device {
    constructor(player) {
        /**
         * IP地址
         * @member {string}
         */
        this.ip = player.getAddress();
        /**
         * 平均ping值
         * @member {number}
         */
        this.avgPing = player.getPing();
        /**
         * 平均丢包率(0~1)
         * @member {number}
         */
        this.avgPacketLoss = 0;
        /**
         * 玩家设备名
         * @member {string}
         */
        this.os = getPlayerDeviceOS(player);
        /**
         * 客户端uuid识别码
         * @member {string}
         */
        this.clientId = player.getLoginChainData().getDeviceId();
    }
}

/**
 * 获取玩家设备名
 * @param player {Player} 玩家对象
 * @returns {string} 设备名
 */
export function getPlayerDeviceOS(player) {
    const os = player.getLoginChainData().getDeviceOS();
    switch (os) {
        case 1:
            return "Android";
        case 2:
            return "iOS";
        case 3:
            return "OSX";// macOS
        case 4:
            return "Amazon";// FireOS
        case 5:
            return "GearVR";
        case 6:
            return "Hololens";
        case 7:
            return "Windows10";
        case 8:
            return "Win32";// Windows
        case 9:
            return "TVOS";// Dedicated
        case 10:
            return "PlayStation";// PS4
        case 11:
        case 12:
            return "Nintendo";// Switch
        case 13:
            return "Xbox";// Xbox One
        case 14:
            return "WindowsPhone";
    }
    return "Unknown";
}
