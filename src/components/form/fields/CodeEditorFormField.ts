import {Component, Prop, Provide, Watch} from 'vue-property-decorator';
import moment from 'moment';
import {FormField} from './FormField';
import * as CodeMirror from 'codemirror';
import {FdTranslator} from '@/FdTranslator';
import {Util} from '@/Util';

declare let $: any;
declare let parameters: any;
declare let CKEDITOR: any;

@Component({
    name: 'code-editor-form-field',
    template: require('./views/code-editor-form-field.html'),
    components: {},
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})
export class CodeEditorFormField extends FormField {

    @Provide()
    editor: any = null;

    @Prop({default: 'text/html'})
    mode: string;

    @Prop({default: 'html'})
    default_mode: string;

    @Prop({default: 600})
    height: number;

    @Provide()
    mode_html: string = 'html';

    @Watch('set_model')
    onChangeSetModel(nv, ov) {
        let me = this;
        me.$store.commit('updateField', {
            model: me.model,
            value: nv,
            field: me.field
        });
    }

    mounted(): void {
        let me = this;
        if (me.field != '') {
            me.$set(me, 'set_model', me.model[me.field]);
        } else {
            me.$set(me, 'set_model', me.model);
        }
        me.$set(me, 'set_id', me.id + '_' + moment().milliseconds().toString());
        me.$set(me, 'mode_html', me.default_mode);

        me.$nextTick(function () {
            setTimeout(function () {
                if ($('#' + me.set_id).length > 0) {
                    switch (me.mode_html) {
                        case 'html':
                            me.initCodeMirror();
                            break;
                        case 'editor':
                            me.initCkEditor(me.set_id);
                            break;
                        default:
                            me.$store.dispatch('setFormItem', {
                                id: me.id,
                                instance: function () {
                                    return me;
                                }
                            });
                            break;
                    }
                }
            }, 100)
        });
    }

    beforeDestroy(): void {
        let me = this;
        switch (me.mode_html) {
            case 'html':
                if (me.editor) {
                    me.editor.toTextArea();
                    me.$set(me, 'editor', null);
                }
                break;
            case 'editor':
                if (CKEDITOR.instances[me.set_id]) {
                    CKEDITOR.instances[me.set_id].destroy();
                }
                break;
        }
    }

    initCodeMirror(value?: string): void {
        let me = this;
        if (me.editor === null && $('#' + me.set_id).length > 0) {
            me.editor = CodeMirror.fromTextArea($('#' + me.set_id)[0], {
                mode: me.mode,
                lineNumbers: true,
                lineWrapping: true,
                value: (value) ? value : ''
            });
            me.editor.setSize(null, me.height);
            me.editor.on('change', function (cm) {
                // me.$set(me.model, me.field, cm.getValue());
                me.$store.commit('updateField', {
                    model: me.model,
                    value: cm.getValue(),
                    field: me.field
                });
            });
        }
        if (me.editor !== null && value) {
            me.editor.getDoc().setValue(value)
        }
    }

    switchModeHtml(mode: string): void {
        let me = this;
        me.$set(me, 'mode_html', mode);
        Util.setLocalVar('html_components_editor', mode);
        switch (me.mode_html) {
            case 'editor':
                if (me.editor) {
                    me.editor.toTextArea();
                    me.$set(me, 'editor', null);
                }
                me.$nextTick(function () {
                    me.initCkEditor(me.set_id);
                });
                break;
            case 'html':
                if (CKEDITOR.instances[me.set_id]) {
                    CKEDITOR.instances[me.set_id].destroy();
                }
                me.$nextTick(function () {
                    me.initCodeMirror();
                });
                break;
            default:
                me.initCodeMirror();
                break;
        }
    }

    initCkEditor(id: string): void {
        let me = this;
        setTimeout(function () {
            if ($('#' + id).length && !me.editor) {
                if (!CKEDITOR.instances[id]) {
                    let introtextEditor = CKEDITOR.replace(id, {
                        //stylesSet: Util.ckEditorStyleConfig,
                        extraPlugins: 'justify,autoembed,div,codemirror,colorbutton',
                        div_wrapTable: true,
                        basePath: '/',
                        height: me.height,
                        on: {
                            change: function (event) {
                                me.$store.commit('updateField', {
                                    model: me.model,
                                    value: this.getData(),
                                    field: me.field
                                });
                            }
                        }
                    });
                }
            }
        }, 100)
    }

}