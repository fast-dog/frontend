<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="x_panel" v-if="form">
        <!--
        <div class="x_title">
           {{form.name}}
         </div>
         -->
        <div class="x_title fixed-scroll">
          <button v-for="button in buttons" class="btn btn-responsive"
                  :id="button.id"
                  v-bind:class="button.cls"
                  data-style="zoom-in"
                  v-on:click="button.action($event)">
            <i class="fa" v-bind:class="button.icon"></i>
            {{button.text}}
          </button>
        </div>
        <div class="x_content">
          <div class="tabs-container">
            <ul class="nav nav-tabs bar_tabs">
              <li v-for="(tab,idx) in form.tabs"
                  :class="{'active': getActiveTab(tab.id, tab.active)}">
                <a data-toggle="tab" :href="'#' + tab.id"
                   v-bind:data-id="tab.id">
                  {{tab.name|_}}
                </a>
                <span class="badge bg-blue" v-if="idx === 0" v-on:click.prevent="addTab(idx,$event)"><i class="fa fa-plus-circle"></i></span>
                <span class="badge bg-red" v-bind:data-id="tab.id" v-if="idx > 0" v-on:click.prevent="removeTab(tab.id,$event)">
                  <i v-bind:data-id="tab.id" class="fa fa-trash"></i>
                </span>
              </li>
            </ul>
            <div class="tab-content">
              <div :id="tab.id" v-for="(tab,idx) in form.tabs"
                   class="tab-pane" :class="{'active': getActiveTab(tab.id, tab.active) === true}">
                <div class="panel-body" v-bind:data-id="tab.id" data-action="tab">
                  <div class="row">
                    <div class="col-sm-9">
                      <div class="col-sm-6 fields">
                        <div class="field_container  col-sm-6">
                          <draggable v-model="destination[tab.id].left"
                                     draggable=".field"
                                     group="field">
                            <div class="field" v-for="(field,idx) in destination[tab.id].left"
                                 :key="field.edit_id"
                                 v-bind:data-id="field.edit_id">
                              <div class="handler col-sm-12" :class="field.type">
                                <FormBuilderElement :item="field"></FormBuilderElement>
                              </div>
                            </div>
                          </draggable>
                        </div>
                      </div>
                      <div class="col-sm-6 fields">
                        <div class="field_container  col-sm-6">
                          <draggable v-model="destination[tab.id].right"
                                     draggable=".field"
                                     group="field">
                            <div class="field" v-for="(field,idx) in destination[tab.id].right"
                                 :key="field.edit_id"
                                 v-bind:data-id="field.edit_id">
                              <div class="handler col-sm-12" :class="field.type">
                                <FormBuilderElement :item="field"></FormBuilderElement>
                              </div>
                            </div>
                          </draggable>
                        </div>
                      </div>
                      <div class="col-sm-12">
                        <div class="fields">
                          <div class="field_container  col-sm-12">
                            <draggable v-model="destination[tab.id].center" draggable=".field"
                                       group="field">
                              <div class="field" v-for="(field,idx) in destination[tab.id].center"
                                   :key="field.edit_id"
                                   v-bind:data-id="field.edit_id">
                                <div class="handler col-sm-12" :class="field.type">
                                  <FormBuilderElement :item="field"></FormBuilderElement>
                                </div>
                              </div>
                            </draggable>
                          </div>
                        </div>
                      </div>
                      <div class="col-sm-12 fields">
                        <div class="field_container  col-sm-12">
                          <draggable v-model="destination[tab.id].center_second"
                                     draggable=".field"
                                     group="field">
                            <div class="field" v-for="(field,idx) in destination[tab.id].center_second"
                                 :key="field.edit_id"
                                 v-bind:data-id="field.edit_id">
                              <div class="handler col-sm-12" :class="field.type">
                                <FormBuilderElement :item="field"></FormBuilderElement>
                              </div>
                            </div>
                          </draggable>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-3">
                      <div class="row">
                        <div class="fields">
                          <div class="field_container col-sm-12">
                            <draggable v-model="destination[tab.id].side"
                                       draggable=".field"
                                       group="field">
                              <div class="field" v-for="(field,idx) in destination[tab.id].side"
                                   :key="field.edit_id"
                                   v-bind:data-id="field.edit_id">
                                <div class="handler col-sm-12" :class="field.type">
                                  <FormBuilderElement :item="field"></FormBuilderElement>
                                </div>
                              </div>
                            </draggable>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="exist-fields">
                          <div class="field_container col-sm-12">
                            <h5 class="text-center">{{'Доступные поля формы'|_}}</h5>
                            <draggable v-model="destination[tab.id].source_side"
                                       draggable=".field"
                                       group="field">
                              <div class="field" v-for="field in destination[tab.id].source_side"
                                   :key="field.edit_id"
                                   v-bind:data-id="field.edit_id">
                                <div class="handler col-sm-12" :class="field.type">
                                  <FormBuilderElement :item="field"></FormBuilderElement>
                                </div>
                              </div>
                            </draggable>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-9">
                      <div class="exist-fields col-sm-12">
                        <div class="field_container col-sm-12">
                          <h5 class="text-center">{{'Доступные поля формы'|_}}</h5>
                          <draggable v-model="destination[tab.id].source"
                                     draggable=".field"
                                     group="field">
                            <div class="field" v-for="field in destination[tab.id].source"
                                 :key="field.edit_id"
                                 v-bind:data-id="field.edit_id">
                              <div class="handler col-sm-12" :class="field.type">
                                <a href="#" class="next-tab" v-if="idx  >= 0 && idx < form.tabs.length"
                                   v-on:click.prevent="moveToNextTab(idx,field)">
                                  <i class="fa fa-arrow-circle-right"></i>
                                </a>
                                <a href="#" class="prev-tab" v-if="idx  > 0 && idx <= form.tabs.length"
                                   v-on:click.prevent="moveToPrevTab(idx,field)">
                                  <i class="fa fa-arrow-circle-left"></i>
                                </a>
                                <FormBuilderElement :item="field"></FormBuilderElement>
                              </div>
                            </div>
                          </draggable>
                        </div>
                      </div>
                    </div>
                  </div>
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
    import Vue from 'vue';
    import {Component, Provide, Watch} from 'vue-property-decorator'
    import draggable from 'vuedraggable'
    import {FdTranslator} from '@/FdTranslator';
    import {Util} from '@/Util';
    import FormBuilderElement from '@/components/form/fields/FormBuilderElement.vue';
    import {ConfigService} from '@/services/ConfigService';
    import {CrudService} from '@/services/CrudService';

    declare let $: any;


    @Component({
        name: 'FormItem',
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        },
        components: {
            'draggable': draggable,
            'FormBuilderElement': FormBuilderElement,


        },
    })

    export default class FormItem extends Vue {

        @Provide()
        source: any = {};

        @Provide()
        buttons: any = {};

        @Provide()
        form: any = null;

        @Provide()
        destination: any = {};

        @Provide()
        openTab: any = null;

        mounted(): void {
            let me = this;


            me.load();


        }

        load(): void {
            let me = this;
            ConfigService.getForm(me.$route.params.id).then((response: any) => {
                if (response.data.success) {
                    Util.showSuccess('Команда выполнена успешно');
                    me.prepareResponse(response);
                } else {
                    Util.errorHandler(response)
                }
            }, (response) => {
                Util.errorHandler(response)
            });
        }

        prepareResponse(response: any): void {
            let me = this,
                _destionation = {},
                preset = {};
            me.$store.dispatch('setBreadcrumbs', {
                items: response.data.breadcrumbs,
                page_title: response.data.page_title
            });
            response.data.items[0].data.form.name = response.data.items[0].name;
            me.$set(me, 'form', response.data.items[0].data.form);// <-- Обновляемый объект
            preset = response.data.items[0].data.preset;

            me.openTab = me.form.tabs[0].id;
            Util.setLocalVar('open-tab-editor', me.openTab);

            for (let i in me.form.tabs) {
                let id = me.form.tabs[i].id;

                if (me.form.tabs[i].edit_fields) {
                    me.form.tabs[i].fields = me.form.tabs[i].edit_fields;
                }

                _destionation[id] = (preset[id]) ? preset[id] : {
                    left: [],
                    right: [],
                    center: [],
                    center_second: [],
                    side: [],
                    source: (me.form.tabs[i].fields) ? me.form.tabs[i].fields : [],
                    source_side: (me.form.tabs[i].side) ? me.form.tabs[i].side : [],
                }
            }
            me.$set(me, 'destination', _destionation);


            let url: string = 'config/forms/' + response.data.items[0].id,
                item = {
                    form: me.form,
                    preset: me.destination
                };

            me.$set(me, 'buttons', Util.buttons([
                Util.buttonSave({
                    me: me,
                    url: url,
                    item: item,
                    callback: null,
                    route_name: ''
                }),
                Util.buttonSaveAndClose({
                    me: me,
                    url: url,
                    item: item,
                    route_name: 'users'
                }),
                Util.buttonUpdate({
                    callback: function () {
                        me.$store.dispatch('setBreadcrumbs', {
                            items: []
                        });
                        me.load();
                    }
                }),
                Util.buttonDelete('users/update', me.form)
            ]));
        }


        removeTab(id: any, $event: Event): void {
            let me = this,
                _destionation = {};
            for (let i in me.destination[id]) {
                me.destination[id][i] = me.destination[id][i].filter(function (field, idx) {
                    me.destination[me.form.tabs[0].id].source.push(field);
                })
            }
            for (let i in me.destination) {
                if (i != id) {
                    _destionation[i] = me.destination[i];
                }
            }

            me.$set(me, 'destination', _destionation);

            me.form.tabs = me.form.tabs.filter(function (element, index) {
                return (element.id.toString() != id.toString());
            });
        }

        addTab(): void {

        }

        getActiveTab(id: string, def: boolean): boolean {
            this.openTab = Util.getLocalVar('open-tab-editor', null);
            if (this.openTab != null && this.openTab != 'null') {
                return (id == this.openTab);
            } else {
                return def;
            }
        }


        saveForm(): void {
            let me = this;
            CrudService.post(Util.httpRoot + 'form', {
                id: me.$route.params.id,
                preset: me.destination
            }).then((response: any) => {
                if (response.data.success) {
                    me.load();
                } else {
                    Util.errorHandler(response)
                }
            }, (response) => {
                Util.errorHandler(response)
            });
        }

        getField(tab, name): any {
            let me = this, result = null;
            for (let i in me.form.tabs) {
                if (me.form.tabs[i].id === tab) {
                    me.form.tabs[i].fields.forEach(function (element) {
                        if (element.edit_id == name) {
                            result = element;

                            return;
                        }
                    })
                }
            }
            return result;
        }

        moveToPrevTab(idx, field): void {
            this.moveField(idx, field, 'prev');
        }

        moveToNextTab(idx, field): void {
            this.moveField(idx, field, 'next');
        }

        moveField(idx, field, to) {
            let me = this,
                current = me.form.tabs[idx].id,
                to_tab = me.form.tabs[(to == 'next') ? idx + 1 : idx - 1],
                destination = (to_tab) ? to_tab.id : null;
            if (destination) {
                me.destination[current].source = me.destination[current].source.filter(function (element, idx) {
                    if (field.edit_id === element.edit_id) {
                        me.destination[destination].source.push(element);
                    }
                    return field.edit_id !== element.edit_id;
                });
            }
        }

    }
</script>

<style scoped lang="scss">


  .fields {
    .field_container {
      min-height: 60px;
      border: 1px dashed #1c84c6;
      margin: 2px 0;
      background: rgba(0, 136, 249, 0.09);

      div {
        min-height: 60px;
      }
    }
  }

  .exist-fields {
    .field_container {
      min-height: 60px;
      margin: 2px 0;
      border: 1px dashed #ED5565;
      background: rgba(249, 38, 8, 0.09);
    }
  }

  .field_container {
    width: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .field {
    margin: 2px;
  }

  .bar_tabs {
    li {
      span {
        position: absolute;
        right: -8px;
        top: -8px;
        color: white;
        cursor: pointer;
      }
    }
  }


  .handler {
    line-height: 25px;
    cursor: move;
    padding: 5px;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, .14), 0 2px 1px -1px rgba(0, 0, 0, .2), 0 1px 3px 0 rgba(0, 0, 0, .12);

    .next-tab {
      position: absolute;
      right: 0;
      top: -5px;
      font-size: 16px;
    }

    .prev-tab {
      position: absolute;
      left: 0;
      top: -5px;
      font-size: 16px;
    }
  }


  .media {
    .handler {
      height: auto;
    }
  }

  .text-form-field, .text-form-alias, .tabs, .media, .access-list, .select-form-field, .map, .media-form-field {
    color: #555;
    background-color: #fff;
    background-image: none;
    margin: 0 1px;
    // border: 1px solid #ccc;
    // box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
  }
</style>
