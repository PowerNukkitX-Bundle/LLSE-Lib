/**
 * 定义一个名为OriginType的对象来表示类型DamageEvent.DamageCause;
 * @enum {number}
 */
export class OriginType {
    static Player = 0;              // 玩家
    static Block = 1;               // 方块
    static MinecartBlock = 2;       // 矿车方块
    static DevConsole = 3;          // 开发控制台
    static Test = 4;                // 测试
    static AutomationPlayer = 5;    // 自动化玩家
    static ClientAutomation = 6;    // 客户端自动化
    static Server = 7;              // 服务器
    static Actor = 8;               // 实体
    static Virtual = 9;             // 虚拟
    static GameArgument = 10;       // 游戏参数
    static ActorServer = 11;        // 实体服务器
    static Precompiled = 12;        // 预编译
    static GameDirectorEntity = 13; // 游戏指导员实体
    static Script = 14;             // 脚本
    static ExecuteContext = 15;     // 执行上下文
    static DedicatedServer = 7;// 专用服务器，与Server值相同
}
