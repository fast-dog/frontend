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
        sources: any = {};

        @Provide()
        form: any = null;

        @Provide()
        destination: any = {};

        @Provide()
        openTab: any = null;

        mounted(): void {
            let me = this;

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

            me.$set(me, 'form', {
                'create_url': 'page\/create',
                'update_url': 'page\/create',
                'tabs':
                    [
                        {
                            'id': 'page-general-tab',
                            'name': '\u041e\u0441\u043d\u043e\u0432\u043d\u0430\u044f \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f',
                            'active': true,
                            'fields': [
                                {'type': 'text-form-field', 'name': 'name', 'label': '\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435', 'css_class': 'col-sm-6', 'form_group': false},
                                {
                                    'type': 'text-form-alias',
                                    'name': 'alias',
                                    'label': '\u041f\u0441\u0435\u0432\u0434\u043e\u043d\u0438\u043c'
                                },
                                {
                                    'type': 'tabs',
                                    'form_group': true,
                                    'tabs': [{
                                        'id': 'page-introtext-tab',
                                        'name': '\u0412\u0441\u0442\u0443\u043f\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0439 \u0442\u0435\u043a\u0441\u0442',
                                        'active': true,
                                        'fields': [{'id': 'introtext', 'type': 'text-editor-form-field', 'name': 'introtext', 'label': ''}]
                                    }, {'id': 'page-fulltext-tab', 'name': '\u041f\u043e\u043b\u043d\u044b\u0439 \u0442\u0435\u043a\u0441\u0442', 'active': false, 'fields': [{'id': 'fulltext', 'type': 'text-editor-form-field', 'name': 'fulltext', 'label': ''}]}]
                                }
                            ],
                            'side': [{
                                'id': 'access',
                                'type': 'access-list',
                                'name': 'site_id',
                                'label': '\u0414\u043e\u0441\u0442\u0443\u043f',
                                'items': [{'id': '000', 'name': '\u041e\u0431\u0449\u0438\u0439 \u0434\u043e\u0441\u0442\u0443\u043f'}, {
                                    'id': '001',
                                    'name': '\u0421\u0430\u0439\u0442 \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e',
                                    'url': '\/',
                                    'lang': 'ru',
                                    'item': {
                                        'id': 1,
                                        'name': '\u0421\u0430\u0439\u0442 \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e',
                                        'url': '\/',
                                        'code': '001',
                                        'data': '[]',
                                        'state': 0,
                                        'site_id': '001',
                                        'lang': 'ru',
                                        'created_at': '2019-07-30 19:12:20',
                                        'updated_at': '2019-07-30 19:12:20',
                                        'deleted_at': null
                                    }
                                }],
                                'css_class': 'col-sm-12',
                                'active': false
                            }]
                        },
                        {'id': 'page-media-tab', 'name': '\u041c\u0435\u0434\u0438\u0430 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b', 'fields': [{'type': 'media'}]},
                        {
                            'id': 'page-extend-tab',
                            'name': '\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u043e',
                            'fields': [{'type': 'sample-properties-table', 'model_id': 4788257, 'model': 'FastDog\\Menu\\Menu'}]
                        },
                        {
                            'id': 'page-templates-tab',
                            'name': '\u0428\u0430\u0431\u043b\u043e\u043d',
                            'expression': 'function(item){ return (item.template_raw != undefined) }',
                            'fields': [{'id': 'template_raw', 'type': 'code-editor-form-field', 'name': 'template_raw', 'css_class': 'col-sm-12 m-t-xs', 'label': 'HTML \u0442\u0435\u043a\u0441\u0442', 'default_mode': 'lazy'}]
                        },
                        {
                            'id': 'page-translate-tab', 'name': '\u041b\u043e\u043a\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f',
                            'expression': 'function(item){ return (item.translate != undefined) }',
                            'fields': [{'type': 'translate-items'}]
                        }
                    ]
            });

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

            console.log(me.form);
        }

        removeTab(idx: number, $event: Event): void {
            let me = this;
            me.form.tabs = me.form.tabs.filter(function (element, index) {
                if (index === idx) {
                    if (element.fields.length) {
                        for (let i in element.fields)
                            me.source.push(element.fields[i]);
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
