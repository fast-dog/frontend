<template>
  <div class="form-group" v-if="set_model">
    <div class="col-sm-12">
      <div class="tabs-container">
        <ul class="nav nav-tabs">
          <li v-for="(subTab,subIdx) in  field.tabs"
              :class="{'active': subTab.active}">
            <a data-toggle="tab" :href="'#' + subTab.id">
              {{subTab.name|_}}
            </a>
          </li>
        </ul>
        <div class="tab-content">
          <div :id="subTab.id" v-for="(subTab,subIdx) in  field.tabs"
               class="tab-pane" :class="{'active': subTab.active}">
            <div class="panel-body">
              <template v-for="(subField,idx) in subTab.fields">
                <text-editor-form-field
                  v-if="$parent.checkFieldTypeWithExpression(subField,'text-editor-form-field')"
                  :id="subField.id"
                  :name="subField.name"
                  :field="subField.name"
                  :label="subField.label"
                  :model="set_model"
                  :required="(subField.required != undefined) ? subField.required : false"
                  :validate="subField.validate"
                  :readonly="(subField.readonly != undefined) ? subField.readonly : false"
                  :placeholder="(subField.placeholder  != undefined )?subField.placeholder:''">
                </text-editor-form-field>
                <code-editor-form-field
                  v-if="$parent.checkFieldTypeWithExpression(subField,'code-editor-form-field')"
                  :id="subField.id"
                  :name="subField.name"
                  :field="subField.name"
                  :label="(subField.label)?subField.label:'HTML оформление'"
                  :model="set_model"
                  :default_mode="subField.default_mode"
                  :event="subField.event"
                  :required="(subField.required != undefined) ? subField.required : false"
                  :validate="subField.validate"
                  :form_group="subField.form_group"
                  :readonly="(subField.readonly != undefined) ? subField.readonly : false"
                  :css_class="(subField.css_class) ? subField.css_class : 'col-sm-6'"
                  :help_string="(subField.help != undefined) ? subField.help : ''"
                  :placeholder="(subField.placeholder)?subField.placeholder:''"></code-editor-form-field>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Watch} from 'vue-property-decorator'
    import {FdTranslator} from '@/FdTranslator';
    import Vue from 'vue';
    import CodeEditorFormField from '@/components/form/fields/CodeEditorFormField.vue';
    import TextEditorFormField from '@/components/form/fields/TextEditorFormField.vue';

    declare let $: any;

    @Component({
        name: 'TabFormField',
        components: {
            'code-editor-form-field': CodeEditorFormField,
            'text-editor-form-field': TextEditorFormField,
        },
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        }
    })

    export default class TabFormField extends Vue {

        @Prop({default: 'TabFormField'})
        name: string = 'TabFormField';

        @Prop({default: null})
        field: any;

        @Provide()
        set_model: any = null;

        @Prop({default: null})
        model: any;

        @Watch('set_model')
        onChangeSetModel(nv, ov) {
            // let me = this;
            // if (me.field != '') {
            //     me.$set(me.model, me.field, nv);
            // }
        }

        mounted(): void {
            let me = this;
            console.log(me.model)
            me.$set(me, 'set_model', me.model);
        }
    }
</script>

<style scoped>

</style>
