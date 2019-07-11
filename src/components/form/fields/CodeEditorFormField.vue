<template>
    <div :class="(form_group)?'form-group':''">
        <div :class="css_class">
            <label class="control-label">
                {{label|_}}
                <strong class="text-danger text-bold" v-if="required">*</strong>
            </label>
            <textarea v-model="set_model"
                      :style="{height: height + 'px'}"
                      class="form-control col-sm-12" :id="set_id" value=""></textarea>
            <div class="btn-group pull-right">
                <button class="btn btn-sm"
                        style="margin: 2px 0 !important ;"
                        v-bind:class="{'btn-default':mode_html == 'html', 'btn-success': mode_html == 'editor'}"
                        v-on:click="switchModeHtml('editor')"
                        data-toggle="tooltip"
                        type="button">
                    <i class="fa fa-file-word-o"></i>
                    {{'Текстовый редактор'|_}}
                </button>
                <button class="btn btn-sm"
                        v-bind:class="{'btn-default':mode_html == 'editor', 'btn-success': mode_html == 'html'}"
                        style="margin: 2px 0 !important;"
                        v-on:click="switchModeHtml('html')"
                        data-toggle="tooltip"
                        type="button">
                    <i class="fa fa-file-code-o"></i>
                    {{'Исходный код'|_}}
                </button>
            </div>
            <span class="help-block m-b-none" v-if="help_string !=''">
            <i class="fa fa-exclamation"></i>
            {{help_string|_}}
        </span>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Watch} from 'vue-property-decorator'
    import {FormField} from '@/components/form/fields/FormField';
    import {FdTranslator} from '@/FdTranslator';
    import moment from 'moment';
    import * as CodeMirror from 'codemirror';
    import {Util} from '@/Util';

    declare let $: any;
    declare let parameters: any;
    declare let CKEDITOR: any;

    @Component({
        name: 'CodeEditorFormField',
        components: {},
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        }
    })

    export default class CodeEditorFormField extends FormField {
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
</script>

<style scoped>

</style>