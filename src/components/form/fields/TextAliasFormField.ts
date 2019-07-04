import Vue from 'vue';
import {Component, Prop, Provide} from 'vue-property-decorator';
import {FdTranslator} from '@/FdTranslator';
import {Util} from '@/Util';


declare let $: any;
declare let parameters: any;


@Component({
    name: 'text-form-alias',
    template: require('./views/alias.html'),
    components: {},
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})

export class TextAliasFormField extends Vue {

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

    changeAlias(): void {
        let me = this;
        if (me.readonly === true) {
            Util.deleteDialog({
                title: '',
                text: FdTranslator._('Изменение псевдонима может нарушить текущую маршрутизацию. Если вы уверены в выполняемых действиях можете продолжать.')
                + '<br />' +
                FdTranslator._('Пожалуйста, ознакомьтесь с изменениями вызванными Вашими действиями в разделе системных уведомлений.'),
                callback: function () {
                    me.$set(me, 'readonly', false);
                },
                text_ok: FdTranslator._('Продолжить')
            })
        } else {
            me.$set(me, 'readonly', true);
        }
    }
}