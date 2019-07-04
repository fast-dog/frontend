import {Component, Watch} from 'vue-property-decorator';
import {FormField} from './FormField';
import {FdTranslator} from '@/FdTranslator';

require('clockpicker/dist/bootstrap-clockpicker.js');

declare let $: any;
declare let parameters: any;


@Component({
    name: 'text-form-field',
    template: require('./views/clock-form-field.html'),
    components: {},
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})
export class ClockFormField extends FormField {

    @Watch('set_model')
    onChangeSetModel(nv, ov) {
        let me = this;
        if (me.field != '') {
            // console.log(nv, '-->')
        }
    }

    mounted(): void {
        let me = this;
        if (me.field != '' && me.model) {
            me.$set(me, 'set_model', me.model[me.field]);
        } else {
            me.$set(me, 'set_model', me.model);
        }

        me.$nextTick(function () {
            $('#' + me.id).clockpicker({
                donetext: FdTranslator._('Выбрать'),
                afterDone: function () {
                    me.set_model = $('#' + me.id).val();
                    me.$store.dispatch('updatedFieldModel', {
                        model: me.model,
                        field: me.field,
                        value: me.set_model
                    })
                }
            });
        })
    }

    clearTimes(): void {
        let me = this;
        me.set_model = '';
        me.$store.dispatch('updatedFieldModel', {
            model: me.model,
            field: me.field,
            value: ''
        })
    }

    beforeDestroy(): void {
        $('.clockpicker-popover').remove();
    }
}