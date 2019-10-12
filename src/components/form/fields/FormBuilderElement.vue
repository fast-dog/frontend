<template>
  <div class="row" style="margin: 0 5px" v-if="field">
    <div class="col-md-12">
      <div v-if="field.type === 'text-form-alias'">
        <text-form-alias
          :item="{id:0,alias:''}"
          :required="field.required"
          :validate="''"
          :label="field.label"
          :disabled="true"
          :placeholder="''"
          :form_group="false"
          :css_class="'col-sm-12'">
        </text-form-alias>
      </div>
      <div v-if="field.type === 'text-form-field'">
        <text-form-field
          :id="''"
          :name="field.name"
          :field="'name'"
          :label="field.label"
          :model="{name:''}"
          :scope="null"
          :required="field.required"
          :form_group="false"
          :readonly="true"
          :css_class="'col-sm-12'"
          :help_string="''"
          :placeholder="''"></text-form-field>
      </div>

      <div v-if="field.type === 'select-form-field' || field.type === 'access-list'">
        <select-form-field
          :label="field.label"
          :model="{value:''}"
          :required="false"
          :multiple="false"
          :readonly="true"
          :css_class="'col-sm-12'"
          :form_group="false"
          :option_group="false"
          :data="[]"
          :disabled="true"
          :placeholder="''"
          :field="''">
        </select-form-field>
      </div>
      <div :class="field.type" v-if="field.type === 'tabs'">
        <div class="handler">
          <div class="tabs-container">
            <ul class="nav nav-tabs bar_tabs">
              <li v-for="(tab,idx) in field.tabs">
                <a data-toggle="tab" :href="'#' + tab.id" :data-id="tab.id">
                  {{tab.name|_}}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="field.type === 'media'">
        <media :item="{media:[{type:'file',value:''}]}" :disabled=true :presentation="false"></media>
      </div>
      <div v-if="field.type === 'sample-properties-table'">

      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Prop, Provide, Watch} from 'vue-property-decorator'
    import {FormField} from '@/components/form/fields/FormField';
    import VueSuggestions from 'vue-suggestions/vue-suggestions.vue';
    import {FdTranslator} from '@/FdTranslator';
    import MediaItems from '@/components/form/components/MediaItems.vue';
    import TextAliasFormField from '@/components/form/fields/TextAliasFormField.vue';
    import TextFormField from '@/components/form/fields/TextFormField.vue';
    import SelectFormField from '@/components/form/fields/SelectFormField.vue';

    declare let $: any;

    @Component({
        name: 'form-builder-element',
        components: {
            'media': MediaItems,
            'text-form-field': TextFormField,
            'text-form-alias': TextAliasFormField,
            'select-form-field': SelectFormField,
        },
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        }
    })

    export default class FormBuilderElement extends Vue {
        @Prop()
        item: any;

        @Provide()
        field: any = null;

        mounted(): void {

            this.field = this.item;
        }
    }
</script>

<style scoped lang="scss">


  .media {
    .handler {
      height: auto;
    }
  }

</style>
