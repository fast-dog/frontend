<template>
    <div :class="(form_group)?'form-group':''">
        <div :class="css_class">
            <label class="control-label" v-if="label">{{label}}
                <strong class="text-danger text-bold" v-if="required">*</strong>
            </label>
            <multiselect v-if="option_group == false && set_data"
                         track-by="id"
                         label="name"
                         :id="id"
                         v-model="set_model"
                         open-direction="bottom"
                         :options="set_data"
                         :multiple="multiple">
            </multiselect>
            <multiselect v-if="option_group == true && set_data"
                         track-by="id"
                         label="name"
                         :id="id"
                         group-label="name"
                         v-model="set_model"
                         group-values="items"
                         open-direction="bottom"
                         :options="set_data"
                         :multiple="multiple">
            </multiselect>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Watch} from 'vue-property-decorator'
    import {FormField} from '@/components/form/fields/FormField';
    import {FdTranslator} from '@/FdTranslator';
    import moment from 'moment' ;


    declare let $: any;

    @Component({
        name: 'SelectFormField',
        components: {},
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        }
    })

    export default class SelectFormField extends FormField {

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
</script>

<style scoped>

</style>