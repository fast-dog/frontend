<template>
  <div class="row" style="margin: 0 5px" v-if="field">
    <div class="col-md-12">
      <div :class="field.type"
           v-if="['text-form-alias','text-form-field'].indexOf(field.type) >=0">
        <div class="handler">
          <i class="fa fa-hand-grab-o"></i>
          {{field.label}}
        </div>
      </div>
      <div :class="field.type"
           v-if="['tabs'].indexOf(field.type) >=0">
        <div class="handler">
          <i class="fa fa-hand-grab-o"></i>
          {{'Группа панелей'|_}}
        </div>
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
      <div v-if="field.type === 'media'" :class="field.type">
        <div class="handler col-sm-12">
          <i class="fa fa-hand-grab-o"></i>
          <media :item="{media:[{type:'file',value:''}]}" :disabled=true :presentation="false"></media>
        </div>
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

    declare let $: any;

    @Component({
        name: 'form-builder-element',
        components: {
            'media': MediaItems

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

  .field {

    .handler {
      line-height: 25px;
      cursor: move;
      padding: 5px;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, .14), 0 2px 1px -1px rgba(0, 0, 0, .2), 0 1px 3px 0 rgba(0, 0, 0, .12);
    }
  }

  .media {
    .handler {
      height: auto;
    }
  }

  .text-form-field, .text-form-alias, .tabs, .media {
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    // box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
  }
</style>
