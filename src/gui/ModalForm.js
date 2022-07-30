import { FormWindowModal } from 'cn.nukkit.form.window.FormWindowModal';

export class ModalForm {
    constructor(title, content, button1, button2) {
        this.title = title || 'Modal Form';
        this.content = content || '';
        this.button1 = button1 || '';
        this.button2 = button2 || '';
        this._id = Math.floor(Math.random() * 10000000);
        this._Form = new FormWindowModal(this.title, this.content, this.button1, this.button2);
        this._callback = function () {
        };
    }

    /**
     * 表单提交的内容
     * @returns {boolean|null}
     */
    get _response() {
        return this._Form.wasClosed() ? null : Boolean(this._Form.getResponse().getClickedButtonId() ? 0 : 1);
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
     * @returns {ModalForm} 表单对象
     */
    setTitle(title) {
        this.title = title;
        this._Form.setTitle(title);
        return this;
    }

    /**
     * 设置表单的内容
     * @param title {string} 表单内容
     * @returns {ModalForm} 表单对象
     */
    setContent(content) {
        this.content = content;
        this._Form.setContent(content);
        return this;
    }

    /**
     * 设置true按钮的文本
     * @param button1 {string} true按钮文本
     * @returns {ModalForm} 表单对象
     */
    setButton1(button1) {
        this._Form.setButton1(button1);
        return this;
    }

    /**
     * 设置false按钮的文本
     * @param button2 {string} false按钮文本
     * @returns {ModalForm} 表单对象
     */
    setButton2(button2) {
        this._Form.setButton1(button2);
        return this;
    }
}