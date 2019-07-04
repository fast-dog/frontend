import {Component, Prop, Provide, Watch} from 'vue-property-decorator';
import moment from 'moment';
import {FormField} from './FormField';
import {FdTranslator} from '@/FdTranslator';


declare let $: any;
declare let parameters: any;


@Component({
    name: 'text-form-field',
    template: require('./views/text-mask-form-field.html'),
    components: {},
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})
export class TextMaskFormField extends FormField {

    @Prop({default: ''})
    field_mask: string;

    @Prop({default: '+9 (999) 999-99?-999'})
    mask: string;

    @Prop({default: null})
    model_mask: any;

    @Provide()
    changeMask: boolean = false;

    @Provide()
    set_mask: any = null;

    @Watch('set_mask')
    onChangeSetMask(nv) {
        let me = this;
        me.$set(me.model_mask, me.field_mask, nv);
        $('#' + me.set_id).mask(nv);
    }

    mounted(): void {
        let me = this;
        me.$set(me, 'set_model', me.model[me.field]);
        me.$set(me, 'set_mask', me.model_mask[me.field_mask]);
        me.$set(me, 'set_id', me.id + '_' + moment().milliseconds().toString());
        me.$nextTick(function () {
            $('#' + me.set_id).mask(me.set_mask)
                .keyup(function () {
                    me.$set(me.model, me.field, this.value);
                });
        })
    }
}