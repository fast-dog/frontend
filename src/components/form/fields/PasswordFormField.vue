<template>
    <div :class="(form_group)?'form-group':''">
        <div :class="css_class">
            <label class="control-label">{{label|_}}
                <strong class="text-danger text-bold" v-if="required">*</strong>
            </label>
            <input type="password" :id="id" :placeholder="placeholder"
                   data-toggle="password" maxlength="32"
                   v-model="set_model"
                   class="form-control">
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Watch} from 'vue-property-decorator'
    import {FormField} from '@/components/form/fields/FormField';
    import {FdTranslator} from '@/FdTranslator';

    require('bootstrap-show-password');

    declare let $: any;

    @Component({
        name: 'PasswordFormField',
        components: {},
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        }
    })

    export default class PasswordFormField extends FormField {
        @Watch('set_model')
        onChangeSetModel(nv, ov) {
            let me = this;
            me.$set(me.model, me.field, nv);
        }

        mounted(): void {
            let me = this;
            me.$set(me, 'set_model', me.model[me.field]);
            this.$nextTick(function () {
                me.initPassword();
            })
        }

        initPassword(): void {
            console.log(this.id);
            let input = $('input#' + this.id),
                init = $('[data-action="generate"]', $($(input).parent())).length;

            if (init === 0) {
                $(input).password({
                    message: 'Отобразить пароль',
                    eyeClass: 'glyphicon',
                    eyeOpenClass: 'glyphicon-eye-close',
                    eyeCloseClass: 'glyphicon-eye-open'
                });
            }
        }
    }
</script>

<style scoped>

</style>