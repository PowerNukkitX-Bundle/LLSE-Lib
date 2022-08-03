import { getLevels, server } from '../../@LiteLoaderLibs/utils/Mixins.js';
import { JSAssert } from '../assert/Assert.js';
import { Player as PNXPlayer } from 'cn.nukkit.Player';
import { Skin } from 'cn.nukkit.entity.data.Skin';
import { BufferedImage } from 'java.awt.image.BufferedImage';
import { LoginPacket } from 'cn.nukkit.network.protocol.LoginPacket';
import { ProtocolInfo } from 'cn.nukkit.network.protocol.ProtocolInfo';
import { UUID } from 'java.util.UUID';
import { Iq80DBFactory } from 'org.iq80.leveldb.impl.Iq80DBFactory';
import { Long } from 'java.lang.Long';
import { Player } from "../../@LiteLoaderLibs/object/Player.js";
import { JavaClassBuilder } from ":jvm";

export const TestPlayer = () => {
    const DelegatePlayer = new JavaClassBuilder("DelegatePlayer", "cn.nukkit.Player");
    const bytes = Iq80DBFactory.bytes;
    //测试环境配置
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
    let _player = new DelegatePlayer(sourceInterface, clientId, clientIp, clientPort);
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
    _player.completeLoginSequence();//不能调用protected方法
    _player.doFirstSpawn();
    var player = new Player(_player);
    //注册测试套件
    JSAssert.addTestSuite("Test Player", {
        testProperty: function () {
            /*console.log(player.name());
            console.log(player.pos());*/
        }
    });
};