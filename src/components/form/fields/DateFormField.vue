<template>
    <div :class="{'has-error': errors.has(name), 'form-group':(form_group)}">
        <div :class="css_class">
            <label class="control-label">{{label|_}}
                <strong class="text-danger text-bold" v-if="required">*</strong>
            </label>
            <input type="text" v-model="set_model"
                   :id="set_id"
                   :name="field"
                   :readonly="readonly != ''"
                   v-validate="validate"
                   :placeholder="placeholder"
                   class="form-control">
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Watch} from 'vue-property-decorator'
    import {FormField} from '@/components/form/fields/FormField';
    import {FdTranslator} from '@/FdTranslator';
    import moment from 'moment' ;

    require('bootstrap-datepicker');
    require('bootstrap-datepicker/js/locales/bootstrap-datepicker.ru.js');

    declare let $: any;

    @Component({
        name: 'DateFormField',
        components: {},
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        }
    })

    export default class DateFormField extends FormField {
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
                        format: me.format,
                        language: 'ru'
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
</script>

<style scoped>

</style>
