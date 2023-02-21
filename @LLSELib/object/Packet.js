import { server } from "../utils/util.js";

export class Packet {

    /**
     * 构建指定id的数据包
     *
     * @param {number} id
     * @param {number[]} buffer
     * @returns {Packet} 数据包对象
     */
    constructor(id, buffer) {
        this.dataPacket = server.getNetwork().getPacket(id);
        this.dataPacket.reset();
        this.dataPacket.put(buffer);
        this.dataPacket.isEncoded = true;
    }

    /**
     * 获取数据包名称
     *
     * @returns {string}
     */
    getName() {
        return this.dataPacket.getClass().getSimpleName();
    }

    /**
     * 获取数据包ID
     *
     * @returns {number}
     */
    getId() {
        return this.dataPacket.pid();
    }
}