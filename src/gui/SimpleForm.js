import { FormWindowSimple } from 'cn.nukkit.form.window.FormWindowSimple';
import { ElementButton } from 'cn.nukkit.form.element.ElementButton';
import { ElementButtonImageData } from 'cn.nukkit.form.element.ElementButtonImageData';

export class SimpleForm {
    constructor(title, content) {
        this.title = title || 'Simple Form';
        this.content = content || '';
        this._id = Math.floor(Math.random() * 10000000);
        this._Form = new FormWindowSimple(this.title, this.content);
        this._callback = function () {
        };
    }

    /**
     * 表单提交的内容
     * @returns {number|null}
     */
    get _response() {
        return this._Form.wasClosed() ? null : this._Form.getResponse().getClickedButtonId();
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
     * @returns {SimpleForm} 表单对象
     */
    setTitle(title) {
        this.title = title;
        this._Form.setTitle(title);
        return this;
    }

    /**
     * 设置表单的内容
     * @param title {string} 表单内容
     * @returns {SimpleForm} 表单对象
     */
    setContent(content) {
        this.content = content;
        this._Form.setContent(content);
        return this;
    }

    /**
     * 设置表单的内容
     * @param title {string} 按钮文本的字符串
     * @param image {string} （可选参数）按钮图片所在路径
     * @returns {SimpleForm} 表单对象
     */
    addButton(text, image) {
        var button;
        if (!image) {
            button = new ElementButton(text);
        } else if (image.indexOf('https://') === 0 || image.indexOf('http://') === 0) {
            button = new ElementButton(text, new ElementButtonImageData('url', image));
        } else if (typeof (image) === 'string') {
            button = new ElementButton(text, new ElementButtonImageData('path', image));
        } else {
            button = new ElementButton(text);
        }
        this._Form.addButton(button);
        return this;
    }
}