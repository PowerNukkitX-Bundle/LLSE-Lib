export class Device {
	constructor (player) {
		this.ip = player.getAddress();
		this.avgPing = player.getPing();
		this.avgPacketLoss = 0;
		this.os = getPlayerDeviceOS(player);
		this.clientId = player.getLoginChainData().getDeviceId();
	}
}
export function getPlayerDeviceOS(player) {
	const os = player.getLoginChainData().getDeviceOS();
	switch (os) {
		case 1: return "Android";
		case 2: return "iOS";
		case 3: return "OSX";// macOS
		case 4: return "Amazon";// FireOS
		case 5: return "GearVR";
		case 6: return "Hololens";
		case 7: return "Windows10";
		case 8: return "Win32";// Windows
		case 9: return "TVOS";// Dedicated
		case 10: return "PlayStation";// PS4
		case 11: case 12: return "Nintendo";// Switch
		case 13: return "Xbox";// Xbox One
		case 14: return "WindowsPhone";
	}
	return "Unknown";
}