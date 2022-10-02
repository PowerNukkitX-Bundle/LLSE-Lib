import { getLevels, server } from '../../@LiteLoaderLibs/utils/Mixins.js';
import { assertThat, JSAssert } from '../assert/Assert.js';
import { Skin } from 'cn.nukkit.entity.data.Skin';
import { BufferedImage } from 'java.awt.image.BufferedImage';
import { LoginPacket } from 'cn.nukkit.network.protocol.LoginPacket';
import { ProtocolInfo } from 'cn.nukkit.network.protocol.ProtocolInfo';
import { UUID } from 'java.util.UUID';
import { Iq80DBFactory } from 'org.iq80.leveldb.impl.Iq80DBFactory';
import { Long } from 'java.lang.Long';
import { Player } from "../../@LiteLoaderLibs/object/Player.js";
import { Player as PNXPlayer } from "cn.nukkit.Player";
import { MethodHandles } from "java.lang.invoke.MethodHandles";
import { Void } from "java.lang.Void";
import { isEmpty } from '../../@LiteLoaderLibs/utils/underscore-esm-min.js'

export const TestPlayer = () => {
    //测试环境配置
    try {
        var completeLoginSequence = PNXPlayer.class.getDeclaredMethod("completeLoginSequence");
        var doFirstSpawn = PNXPlayer.class.getDeclaredMethod("doFirstSpawn");
        completeLoginSequence.setAccessible(true);
        doFirstSpawn.setAccessible(true);
    } catch (e) {
        console.error(e);
    }
    const bytes = Iq80DBFactory.bytes;
    /// Setup Level ///
    let level = getLevels()[0];
    let safeSpawn = level.getSafeSpawn();
    /// Setup skin ///
    let skin = new Skin();
    skin.setSkinId("test");
    skin.setSkinData(new BufferedImage(64, 32, BufferedImage.TYPE_INT_BGR));
    /// Make player login ///
    let clientId = 32;
    let clientIp = "1.2.3.4";
    let clientPort = 3232;
    let sourceInterface = server.getNetwork().getInterfaces().toArray()[0];
    let _player = new PNXPlayer(sourceInterface, clientId, clientIp, clientPort);
    let loginPacket = new LoginPacket();
    loginPacket.username = "TestPlayer";
    loginPacket.protocol = ProtocolInfo.CURRENT_PROTOCOL;
    loginPacket.clientId = Long.parseLong("2");
    loginPacket.clientUUID = new UUID(3, 3);
    loginPacket.skin = skin;
    loginPacket.putLInt(2);
    loginPacket.put(bytes("{}"));
    loginPacket.putLInt(0);
    _player.handleDataPacket(loginPacket);
    try {
        completeLoginSequence.invoke(_player);
        doFirstSpawn.invoke(_player);
    } catch (e) {
        console.error(e);
    }
    var player = new Player(_player);
    //注册测试套件
    JSAssert.addTestSuite("Test Player", {
        testProperty: function () {
            assertThat(player.name).equals("TestPlayer", "name属性读取异常");
            assertThat(!isEmpty(player.pos)).isTrue("pos属性读取异常");
            assertThat(!isEmpty(player.blockPos)).isTrue("blockPos属性读取异常");
            assertThat(player.realName).equals("TestPlayer", "realName属性读取异常");
            assertThat(player.xuid).equals(null, "xuid属性读取异常");
            assertThat(player.uuid).equals(null, "uuid属性读取异常");
            assertThat(player.permLevel).equals(0, "permLevel属性读取异常");
            assertThat(player.gameMode).equals(0, "gameMode属性读取异常");
            assertThat(player.maxHealth).equals(20, "maxHealth属性读取异常");
            assertThat(player.health).equals(20.0, "health属性读取异常");
            assertThat(player.inAir).equals(false, "inAir属性读取异常");
            assertThat(player.sneaking).equals(false, "sneaking属性读取异常");
            assertThat(player.speed).equals(0.10000000149011612, "speed属性读取异常");
            assertThat(player.direction.toString()).equals(`{"pitch":0,"yaw":0,"facing":2}`, "direction属性读取异常");
            assertThat(player.uniqueId.toString()).equals("00000000-0000-0003-0000-000000000003", "uniqueId属性读取异常");
        }
    });
};