import {Component, Watch} from 'vue-property-decorator';
import {FormField} from './FormField';
import {FdTranslator} from '@/FdTranslator';


declare let $: any;
declare let parameters: any;


@Component({
    name: 'text-form-field',
    template: require('./views/text-form-field.html'),
    components: {},
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})
export class TextFormField extends FormField {

    @Watch('set_model')
    onChangeSetModel(nv, ov) {
        let me = this;
        if (me.field != '') {
            me.$store.dispatch('updatedFieldModel', {
                model: me.model,
                field: me.field,
                value: nv
            })
        }
    }

    mounted(): void {
        let me = this;
        if (me.field != '' && me.model) {
            me.$set(me, 'set_model', me.model[me.field]);
        } else {
            me.$set(me, 'set_model', me.model);
        }
    }
}