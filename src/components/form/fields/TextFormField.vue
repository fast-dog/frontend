<template>
    <div :class="{'has-error': errors.has(name), 'has-error': errors.has(scope+'.'+name), 'form-group':(form_group)}">
        <div :class="css_class">
            <label class="control-label">{{label|_}}
                <strong class="text-danger text-bold" v-if="required">*</strong>
            </label>
            <input type="text" :id="id" :placeholder="placeholder"
                   :readonly="readonly != ''"
                   v-validate="validate"
                   :name="name"
                   v-model="set_model" class="form-control">
            <span class="help-block m-b-none" v-if="help_string !=''">
            <i class="fa fa-exclamation"></i>
            {{help_string|_}}
        </span>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Watch} from 'vue-property-decorator'
    import {FormField} from '@/components/form/fields/FormField';
    import {FdTranslator} from '@/FdTranslator';
    require('jquery.maskedinput/src/jquery.maskedinput.js');

    declare let $: any;

    @Component({
        name: 'TextFormField',
        components: {},
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        }
    })

    export default class TextFormField extends FormField {

        @Prop({default: ''})
        mask: string;

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

            if(me.mask){
                me.$nextTick(function () {
                    $('#' + me.id).mask(me.mask)
                        .keyup(function () {
                            me.$store.dispatch('updatedFieldModel', {
                                model: me.model,
                                field: me.field,
                                value: this.value
                            })
                        });
                })
            }
        }
    }
</script>

<style scoped>

</style>