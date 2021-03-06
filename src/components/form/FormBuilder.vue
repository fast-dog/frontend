<template>
  <div v-if="$store.getters.getSplashScreen === false">
    <div :class="{'fadeIn': $store.getters.getSplashScreen == false}">
      <div class="row">
        <div class="col-lg-12">
          <div class="x_panel">
            <div class="x_title fixed-scroll">
              <button v-for="button in $store.getters.getForm.content.buttons" class="btn btn-responsive"
                      :id="button.id"
                      v-bind:class="button.cls"
                      data-style="zoom-in"
                      v-if="button.visible == null || button.visible == true"
                      v-on:click="button.action($event)">
                <i class="fa" v-bind:class="button.icon"></i>
                {{button.text}}
              </button>
              <div class="pull-right">
                <button v-if="$store.getters.getForm.form_builder" class="btn btn-success btn-responsive btn-sm animated fadeIn"
                        v-on:click="editForm($store.getters.getForm.form_builder)">
                  <i class="fa fa-gear"></i>
                </button>
                <button class="btn btn-sm btn-success btn-responsive" v-if="$store.getters.getForm.help" style="margin: 0 5px !important ;" type="button"
                        v-on:click="helpStatic($store.getters.getForm.help)">
                  <i class="fa fa-life-bouy"></i>
                  {{'Помощь'|_}}
                </button>
              </div>
            </div>
            <div class="x_content" :style="{minHeight: $store.getters.getTableHeight + 'px'}">
              <div class="row animated"
                   :class="{'fadeIn': $store.getters.getSplashScreen == false,'hidden': $store.getters.getSplashScreen}">
                <div class="tabs-container">
                  <ul class="nav nav-tabs bar_tabs">
                    <li v-for="(tab,idx) in $store.getters.getForm.content.tabs"
                        v-if="checkTabExpression(tab)"
                        :class="{'active': getActiveTab(tab.id, tab.active)}">
                      <a data-toggle="tab" data-action="check_tabs" :href="'#' + tab.id"
                         :data-id="tab.id">
                        {{tab.name|_}}
                      </a>
                    </li>
                  </ul>
                  <form method="get" class="form-horizontal">
                    <div class="tab-content" v-if="item">
                      <template v-if="$store.getters.getForm.is_preset === 'N'">
                        <div :id="tab.id" v-for="(tab,idx) in $store.getters.getForm.content.tabs"
                             v-if="checkTabExpression(tab)"
                             class="tab-pane" :class="{'active': getActiveTab(tab.id, tab.active) == true}">
                          <div class="panel-body">
                            <div :class="{'col-sm-9': tab.side && tab.side.length > 0,
                                                'col-sm-12': tab.side && tab.side.length == 0}">
                              <div v-for="(field,idx) in tab.fields">
                                <FormFields :field="field" :model="item"></FormFields>
                              </div>
                            </div>
                            <div class="col-sm-3" v-if="tab.side && tab.side.length > 0">
                              <div v-for="field in tab.side">
                                <FormFields :field="field" :model="item"></FormFields>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-if="$store.getters.getForm.is_preset === 'Y'">
                        <div :id="tab.id" v-for="(tab,idx) in $store.getters.getForm.content.tabs"
                             v-if="checkTabExpression(tab)"
                             class="tab-pane" :class="{'active': getActiveTab(tab.id, tab.active) == true}">
                          <div class="panel-body">
                            <div :class="{'col-sm-9': tab.side && tab.side.length > 0,
                                                'col-sm-12': tab.side && tab.side.length == 0}">
                              <div class="col-sm-6">
                                <div v-for="field in tab.fields.left">
                                  <FormFields :field="field" :model="item"></FormFields>
                                </div>
                              </div>
                              <div class="col-sm-6">
                                <div v-for="field in tab.fields.right">
                                  <FormFields :field="field" :model="item"></FormFields>
                                </div>
                              </div>
                              <div class="col-sm-12">
                                <div v-for="field in tab.fields.center">
                                  <FormFields :field="field" :model="item"></FormFields>
                                </div>
                              </div>
                              <div class="col-sm-12">
                                <div v-for="field in tab.fields.center_second">
                                  <FormFields :field="field" :model="item"></FormFields>
                                </div>
                              </div>
                            </div>
                            <div class="col-sm-3" v-if="tab.side && tab.side.length > 0">
                              <div v-for="field in tab.side">
                                <FormFields :field="field" :model="item"></FormFields>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import {Util} from '@/Util';
    import {FdTranslator} from '@/FdTranslator';
    import SplashScreen from '@/components/SplashScreen.vue';
    import FormFields from '@/components/form/FormFields.vue';


    declare let $: any;

    @Component({
        name: 'FormBuilder',
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        },
        components: {
            'SplashScreen': SplashScreen,
            'FormFields': FormFields,

        }
    })

    export default class FormBuilder extends Vue {

        @Provide()
        form: {
            name: string,
            help: false,
            content: {
                buttons: [any],
                tabs: [{
                    general: {
                        id: '',
                        name: '',
                        fields: [any],
                        side: [any]
                    }
                }]
            }
        } = null;

        @Provide()
        item: any = null;

        @Provide()
        openTab: any = null;

        @Prop({default: null})
        model: any;

        @Watch('model')
        onChangeModel(model) {
            if (model !== null) {
                this.$set(this, 'item', model);
            }
        }

        mounted(): void {

        }

        expression(code: string): any {
            let me = this,
                result = eval('(result = ' + code + ')');

            if (result !== undefined && me.item !== null) {
                return result(me.item);
            }
            return false;
        }

        checkFieldTypeWithExpression(field: any, type: string): boolean {
            let result = false;
            if (field.type == type && !field.expression) {
                result = true;
            } else if (field.expression && (this.expression(field.expression) && field.type == type)) {
                result = true;
            }
            return result;
        }

        public getModel(field: any, item: any): any {
            if (field.model) {
                return item[field.model];
            }
            return item;
        }

        helpStatic(name: string): void {
            Util.help(name, this)
        }

        getActiveTab(id: string, def: boolean): boolean {
            this.openTab = Util.getLocalVar('open-tab', null);
            if (this.openTab != null && this.openTab != 'null') {
                return (id == this.openTab);
            } else {

                return def;
            }

        }

        checkTabExpression(tab: any): boolean {
            if (tab.expression !== undefined) {
                return this.expression(tab.expression);
            }
            return true;
        }

        editForm(form_builder): void {
            this.$router.push({
                name: 'form_item',
                params: {
                    id: form_builder.id
                }
            })
        }

    }
</script>

<style scoped>

</style>
