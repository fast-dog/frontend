import {Component, Watch} from 'vue-property-decorator';
import moment from 'moment';
import {FormField} from './FormField';
import {FdTranslator} from '@/FdTranslator';


declare let $: any;
declare let parameters: any;
declare let CKEDITOR: any;

@Component({
    name: 'text-area-form-field',
    template: require('./views/text-area-form-field.html'),
    components: {},
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})
export class TextAreaFormField extends FormField {

    @Watch('set_model')
    onChangeSetModel(value, oldValue) {
        if (value !== oldValue && oldValue !== undefined) {
            let me = this;
            me.$store.commit('updateField', {
                model: me.model,
                value: value,
                field: me.field
            });
        }
    }

    mounted(): void {
        let me = this;
        if (me.field != '') {
            me.$set(me, 'set_model', me.model[me.field]);
        } else {
            me.$set(me, 'set_model', me.model);
        }

        me.$set(me, 'set_id', me.id + '_' + moment().milliseconds().toString());

        me.$nextTick(function () {
        })
    }

    beforeDestroy(): void {
        let me = this;
    }
}