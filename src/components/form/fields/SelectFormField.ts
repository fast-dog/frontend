import {Component, Prop, Provide, Watch} from 'vue-property-decorator';
import moment from 'moment';
import {FormField} from './FormField';
import {FdTranslator} from '@/FdTranslator';


declare let $: any;
declare let parameters: any;


@Component({
    name: 'select-form-field',
    template: require('./views/select-form-field.html'),
    components: {},
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})
export class SelectFormField extends FormField {

    @Prop({default: false})
    option_group: boolean;

    @Prop({default: false})
    multiple: boolean;

    @Prop({default: null})
    data: [any];

    @Provide()
    set_data: [any] = null;

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
        me.$set(me, 'set_id', me.id + '_' + moment().milliseconds().toString());
        me.$set(me, 'set_model', me.model[me.field]);

        me.$store.dispatch('setSelectData', {
            id: me.id,
            items: me.data,
            callback: function (data) {
                me.$set(me, 'set_data', data);
            },
            clearValue: function () {
                me.set_model = {id: 0, name: ''};
                // me.$store.commit('updateField', {
                //     model: me.set_model,
                //     value: {id: 0, name: ''},
                //     field: me.field
                // });
            }
        });
        me.$set(me, 'set_data', me.data);
    }


    beforeDestroy(): void {
        this.$store.dispatch('deleteSelectDataById', {id: this.id});
    }

}