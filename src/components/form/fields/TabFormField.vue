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
                <FormFields :field="subField" :model="set_model" v-for="(subField,idx) in subTab.fields"></FormFields>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Watch} from 'vue-property-decorator'
    import {FormField} from '@/components/form/fields/FormField';
    import FormFields from '../FormFields.vue';
    import {FdTranslator} from '@/FdTranslator';
    import Vue from 'vue';



    declare let $: any;

    @Component({
        name: 'TabFormField',
        components: {
              FormFields,
        },
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        }
    })

    export default class TabFormField extends Vue {

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
