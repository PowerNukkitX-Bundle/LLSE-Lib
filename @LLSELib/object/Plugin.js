import { Plugin as PNXPlugin } from "cn.nukkit.plugin.Plugin";

const type = PNXPlugin;

export class Plugin {
    constructor(PNXPlugin) {
        this._PNXPlugin = PNXPlugin;
    }

    /**
     * @return {string}
     *
     */
    get name() {
        return this._PNXPlugin.getName();
    }

    /**
     * @return {string}
     */
    get desc() {
        return this._PNXPlugin.getDescription().getDescription();
    }

    /**
     * @return {number[]}
     */
    get version() {
        return this._PNXPlugin.getDescription().getVersion().split(",");
    }

    /**
     * @return {string}
     */
    get versionStr() {
        return this._PNXPlugin.getDescription().getVersion();
    }

    /**
     * @return {string}
     */
    get filePath() {
        return this._PNXPlugin.getFile().getPath();
    }

    /**
     * @return {Object}
     */
    get others() {
        return this._PNXPlugin.getDescription();
    }
}