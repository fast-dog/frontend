import {Component, Prop, Watch} from 'vue-property-decorator';
import moment from 'moment';
import {FormField} from './FormField';
import {FdTranslator} from '@/FdTranslator';

require('bootstrap-datepicker');

declare let $: any;
declare let parameters: any;


@Component({
    name: 'date-form-field',
    template: require('./views/date-form-field.html'),
    components: {},
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})
export class DateFormField extends FormField {

    @Prop({default: 'yyyy-mm-dd'})
    format: string;

    @Watch('set_model')
    onChangeSetModel(value) {
        let me = this;
        me.$set(me.model, me.field, value);
    }

    mounted(): void {
        let me = this;
        me.$set(me, 'set_id', me.id + '_' + moment().milliseconds().toString());
        me.$set(me, 'set_model', me.model[me.field]);

        this.$nextTick(function () {
            if (this.readonly !== true) {
                $('#' + me.set_id).datepicker({
                    todayBtn: 'linked',
                    keyboardNavigation: false,
                    forceParse: false,
                    calendarWeeks: true,
                    autoclose: true,
                    format: me.format
                }).on('changeDate', function (e) {
                    me.$store.dispatch('updatedFieldModel', {
                        model: me.model,
                        field: me.field,
                        value: moment(e.date).format('YYYY-MM-DD')
                    })
                });
            }
        })
    }
}