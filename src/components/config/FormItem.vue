<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="x_panel">
        <div class="x_title">form name</div>
        <div class="x_content" v-if="form">
          <div class="tabs-container">
            <ul class="nav nav-tabs bar_tabs">
              <li v-for="(tab,idx) in form.tabs"
                  :class="{'active': getActiveTab(tab.id, tab.active)}">
                <a data-toggle="tab" :href="'#' + tab.id"
                   v-bind:data-id="tab.id">
                  {{tab.name|_}}
                </a>
                <span class="badge bg-blue" v-if="idx === 0" v-on:click.prevent="addTab(idx,$event)"><i class="fa fa-plus-circle"></i></span>
                <span class="badge bg-red" v-if="idx > 0" v-on:click.prevent="removeTab(idx,$event)"><i class="fa fa-trash"></i></span>
              </li>
            </ul>
            <div class="tab-content">
              <div :id="tab.id" v-for="(tab,idx) in form.tabs"
                   class="tab-pane" :class="{'active': getActiveTab(tab.id, tab.active) === true}">
                <div class="panel-body"
                     v-bind:data-id="tab.id"
                     data-action="tab">
                  <div class="row">
                    <div class="col-sm-9">
                      <div class="col-sm-6 fields">
                        <div class="field_container connectedSortable col-sm-6"
                             data-action="fields"
                             data-position="left">
                          <div class="field" v-for="(field,idx) in destination[tab.id].left"
                               v-bind:data-id="field.name"
                          >
                            {{field.name}} #{{field.id}}
                          </div>
                        </div>
                      </div>
                      <div class="col-sm-6 fields">
                        <div class="field_container connectedSortable col-sm-6"
                             data-position="right"
                             data-action="fields">
                          <div class="field" v-for="(field,idx) in destination[tab.id].right"
                               v-bind:data-id="field.name">
                            {{field.name}} #{{field.id}}
                          </div>
                        </div>
                      </div>
                      <div class="col-sm-12">
                        <div class="fields">
                          <div class="field_container connectedSortable col-sm-12"
                               data-action="fields"
                               data-position="center">
                            <div class="field" v-for="(field,idx) in destination[tab.id].center"
                                 v-bind:data-id="field.name">
                              {{field.name}} #{{field.id}}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="col-sm-12 fields">
                        <div class="field_container connectedSortable col-sm-12"
                             data-action="fields"
                             data-position="center_second">
                          <div class="field" v-for="(field,idx) in destination[tab.id].center_second"
                               v-bind:data-id="field.name"
                          >
                            {{field.name}} #{{field.id}}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-3">
                      <div class="fields">
                        <div class="field_container connectedSortable col-sm-12"
                             data-action="fields"
                             data-position="side">
                          <div class="field" v-for="(field,idx) in destination[tab.id].side"
                               v-bind:data-id="field.name">
                            {{field.name}} #{{field.id}}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-12">
                      <div class="exist-fields col-sm-9">
                        <div class="field_container connectedSortable col-sm-12"
                             data-action="fields"
                             data-position="source">
                          <h5 class="text-center">{{'Доступные поля формы'|_}}</h5>
                          <div class="field" v-for="field in tab.fields"
                               v-bind:data-id="field.name">
                            <FormBuilderElement :item="field"></FormBuilderElement>
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
  </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Provide, Watch} from 'vue-property-decorator'
    import {Container, Draggable, smoothDnD} from 'vue-smooth-dnd'
    import {FdTranslator} from '@/FdTranslator';
    import {Util} from '@/Util';
    import se from 'gentelella/vendors/moment/src/locale/se';
    import vi from 'gentelella/vendors/moment/src/locale/vi';
    import FormBuilderElement from '@/components/form/fields/FormBuilderElement.vue';
    import {ConfigService} from '@/services/ConfigService';

    declare let $: any;


    @Component({
        name: 'FormItem',
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        },
        components: {
            'Container': Container,
            'FormBuilderElement': FormBuilderElement

        },
    })

    export default class FormItem extends Vue {

        @Provide()
        source: any = {};

        @Provide()
        form: any = null;

        @Provide()
        destination: any = {};

        @Provide()
        openTab: any = null;

        mounted(): void {
            let me = this;
            ConfigService.getForm(me.$route.params.id).then((response: any) => {
                if (response.data.success) {
                    me.prepareResponse(response);
                } else {
                    Util.errorHandler(response)
                }
            }, (response) => {
                Util.errorHandler(response)
            });

        }

        prepareResponse(response: any): void {
            let me = this;
            me.$store.dispatch('setBreadcrumbs', {
                items: response.data.breadcrumbs,
                page_title: response.data.page_title
            });

            me.$set(me, 'form', response.data.items[0].data.form);// <-- Обновляемый объект

            me.openTab = me.form.tabs[0].id;
            Util.setLocalVar('open-tab-editor', me.openTab);

            for (let i in me.form.tabs) {
                me.destination[me.form.tabs[i].id] = {
                    left: [],
                    right: [],
                    center: [],
                    center_second: [],
                    side: [],
                    source: me.form.tabs[i].fields,
                }
            }

            me.$nextTick(function () {
                $('.connectedSortable').sortable({
                    connectWith: '.field_container',
                    placeholder: 'field',
                    forcePlaceholderSize: true,
                    start: function (e, ui) {
                        ui.placeholder.height(ui.item.height());
                        ui.placeholder.css({
                            opacity: 1,
                            backgroundColor: 'rgba(26,179,148,0.4)',
                            display: 'block',
                            visibility: 'visible',
                            border: '1px solid #1ab394'
                        });
                    },
                    receive: function (event, ui) {
                        me.buildForm();
                    }
                });
            });
        }

        removeTab(idx: number, $event: Event): void {
            let me = this;
            me.form.tabs = me.form.tabs.filter(function (element, index) {
                if (index === idx) {
                    if (element.fields.length) {
                        for (let i in element.fields)
                            me.destination[me.form.tabs[0].id].source.push(element.fields[i]);
                    }
                }
                return (idx !== index);
            })
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

        buildForm(): void {
            let me = this;

            $('*[data-action=tab]').each(function () {
                let tab_id = $(this).data('id');
                me.destination[tab_id] = {
                    left: [],
                    right: [],
                    center: [],
                    center_second: [],
                    side: [],
                    source: [],
                };

                $('*[data-action=fields] > *').each(function () {
                    let section = $(this).parent().data('position'),
                        id = $(this).data('id');

                    if (id) {
                        let field = me.getField(tab_id, id);
                        if (field) {
                            me.destination[tab_id][section].push(field);
                        }
                    }
                })
            });

            console.log(me.destination);
        }

        getField(tab, name): any {
            let me = this, result = null;
            for (let i in me.form.tabs) {
                if (me.form.tabs[i].id === tab) {
                    me.form.tabs[i].fields.forEach(function (element) {
                        if (element.name == name) {
                            result = element;

                            return;
                        }
                    })
                }
            }
            return result;
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
</style>
