<template>
    <div :class="(form_group) ? 'form-group' : '' ">
        <div :class="css_class">
            <label class="control-label">{{label|_}}</label>
            <div style="position: relative" v-if="item && item.id >= 0">
                <input type="text" class="form-control" v-model="item.alias"
                       v-bind:readonly="readonly">
                <span class="pull-right">
                <button type="button"
                        :class="{'btn-danger': (readonly),'btn-primary': (readonly === false)}"
                        v-on:click="changeAlias" class="btn btn-xs"
                        style="position: absolute; top: 6px; right: 20px;">
                    {{'Изменить'|_}}
                    <i data-style="zoom-in" class="fa"
                       :class="{'fa-lock':(readonly),'fa-unlock-alt': (readonly === false)}"></i>
                </button>
            </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Vue} from 'vue-property-decorator';
    import {FdTranslator} from '@/FdTranslator';
    import {Util} from "@/Util";


    declare let $: any;

    @Component({
        name: 'TextAliasFormField',
        components: {},
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        }
    })

    export default class TextAliasFormField extends Vue {

        @Prop({default: null})
        item: any;

        @Provide()
        set_item: any;

        @Provide()
        readonly: boolean = true;

        @Prop({default: 'col-sm-12'})
        css_class: string;

        @Prop({default: ''})
        label: string;

        @Prop({default: false})
        form_group: boolean;

        mounted(): void {

        }

        changeAlias(): void {
            let me = this;
            if (me.readonly === true) {
                Util.deleteDialog({
                    title: '',
                    text: FdTranslator._('Изменение псевдонима может вызвать непредвиденные последствия. Если вы уверены в выполняемых действиях можете продолжать.')
                        + '<br />' + '<br />' +
                        FdTranslator._('Пожалуйста, ознакомьтесь с изменениями вызванными Вашими действиями в разделе системных уведомлений.'),
                    callback: function () {
                        me.$store.dispatch('updatedFieldModel', {
                            model: me,
                            field: 'readonly',
                            value: false
                        })// = false;
                    },
                    text_ok: FdTranslator._('Продолжить')
                })
            } else {
                me.readonly = true;
            }
        }
    }
</script>

<style scoped>

</style>
