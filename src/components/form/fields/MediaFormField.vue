<template>
  <div :class="(form_group)?'form-group':''">
    <div :class="css_class">
      <label class="control-label">{{label|_}}
        <strong class="text-danger text-bold" v-if="required">*</strong>
      </label>
      <div class="input-group">
        <input type="text"
               :id="set_id" :placeholder="placeholder"
               :readonly="readonly !== ''"
               class="form-control"
               :disabled="disabled"
               v-model="set_model" id="image">
        <span class="input-group-btn">
                <button type="button"
                        v-on:click="openFinder('image')"
                        :disabled="disabled"
                        class="btn btn-primary">
                    <i class="fa fa-folder-o"></i>
                </button>
            </span>
      </div>
      <span class="help-block m-b-none" v-if="help_string !== ''">
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
    import {Util} from '@/Util';


    declare let $: any;

    @Component({
        name: 'MediaFormField',
        components: {},
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        }
    })

    export default class MediaFormField extends FormField {

        @Watch('set_model')
        onChangeSetModel(nv, ov) {
            let me = this;
            if (me.field != '') {
                me.$set(me.model, me.field, nv);
            }
        }

        mounted(): void {
            let me = this;
            if (me.field != '') {
                me.$set(me, 'set_model', me.model[me.field]);
            } else {
                me.$set(me, 'set_model', me.model);
            }
        }

        openFinder(name: string, params: string): void {
            let me = this;
            Util.openElFinder({
                name: name,
                params: params,
                callback: function (selectedFile) {
                    if (selectedFile) {
                        me.$set(me, 'set_model', selectedFile.url.toString().replace(window.location.protocol + '//' + window.location.hostname, ''));
                    }
                }
            })
        }
    }
</script>

<style scoped>

</style>
