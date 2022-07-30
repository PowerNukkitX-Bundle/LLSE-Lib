import { FormWindowCustom } from 'cn.nukkit.form.window.FormWindowCustom';
import { ElementLabel } from 'cn.nukkit.form.element.ElementLabel';
import { ElementInput } from 'cn.nukkit.form.element.ElementInput';
import { ElementToggle } from 'cn.nukkit.form.element.ElementToggle';
import { ElementDropdown } from 'cn.nukkit.form.element.ElementDropdown';
import { ElementSlider } from 'cn.nukkit.form.element.ElementSlider';
import { ElementStepSlider } from 'cn.nukkit.form.element.ElementStepSlider';
import { ArrayList as JList } from 'java.util.ArrayList';

export class CustomForm {
    constructor(title) {
        this.title = title || 'Custom Form';
        this._id = Math.floor(Math.random() * 10000000);
        this._Form = new FormWindowCustom(this.title);
        this._callback = function () {
        };
    }

    /**
     * 表单提交的内容
     * @returns {array|null}
     */
    get _response() {
        if (this._Form.wasClosed()) {
            return null;
        }
        let arr = [];
        let res = this._Form.getResponse();
        let content = this._Form.getElements();
        for (let i = 0; i < content.size(); i++) {
            let e = content.get(i);
            if (e instanceof ElementDropdown) {
                arr.push(res.getDropdownResponse(i).getElementID());
            } else if (e instanceof ElementStepSlider) {
                arr.push(res.getStepSliderResponse(i).getElementID());
            } else {
                arr.push(res.getResponses().get(i));
            }
        }
        return arr;
    }

    setCallback(func) {
        if (typeof func != 'function') {
            return false;
        }
        this._callback = func;
        return true;
    }

    /**
     * 设置表单的标题
     * @param title {string} 表单标题
     * @returns {CustomForm} 表单对象
     */
    setTitle(title) {
        this.title = title;
        this._Form.setTitle(title);
        return this;
    }

    /**
     * 向表单内增加一行文本
     * @param text {string} 一行文本
     * @returns {CustomForm} 表单对象
     */
    addLabel(text) {
        this._Form.addElement(new ElementLabel(text));
        return this;
    }

    /**
     * 向表单内增加一行输入框
     * @param title {string} 标题
     * @param placeholder {string} 提示文本
     * @param default {string} 默认文本
     * @returns {CustomForm} 表单对象
     */
    addInput(title, placeholder = '', def = '') {
        this._Form.addElement(new ElementInput(title, placeholder, def));
        return this;
    }

    addSwitch(title, def = false) {
        this._Form.addElement(new ElementToggle(title, Boolean(def)));
        return this;
    }

    addDropdown(title, items = [], def = 0) {
        var lists = new JList();
        items.forEach(v => lists.add(v));
        this._Form.addElement(new ElementDropdown(title, lists, isNaN(def) ? 0 : Math.floor(Number(def))));
        return this;
    }

    addSlider(title, min, max, step = -1, def = -1) {
        this._Form.addElement(new ElementSlider(title, min, max, step, def));
        return this;
    }

    addStepSlider(title, items = [], def = 0) {
        var lists = new JList();
        items.forEach(v => lists.add(v));
        this._Form.addElement(new ElementStepSlider(title, lists, def));
        return this;
    }
}