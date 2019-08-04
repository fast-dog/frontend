<template>
    <div v-if="$store.getters.getSplashScreen === false">
        <preview></preview>
        <div class="x_panel">
            <div v-if="option.title !== '' || option.tools === true">
                <div class="control-btn">
                    <button v-for="button in actionButtons" class="btn btn-responsive"
                            v-bind:class="button.cls"
                            v-bind:data-disabled_selection="button.disabled_selection"
                            data-style="zoom-in"
                            :title="button.text"
                            data-placement="bottom"
                            data-toggle="tooltip"
                            v-if="button.visible == null || button.visible === true"
                            v-on:click="button.action($event)">
                        <i class="fa" v-bind:class="button.icon"></i>
                        {{button.text}}
                    </button>
                    <button class="btn btn-sm btn-success pull-right btn-responsive" v-if="option.help === true"
                            type="button"
                            v-on:click="helpStatic()">
                        <i class="fa fa-life-bouy"></i>
                    </button>
                </div>
            </div>
            <div class="x_content" style="padding: 0 !important;">
                <div class="table-responsive "
                     :class="{'col-md-9':$store.getters.getExternalFilters}">
                    <table class="table table-striped table-hover _table_"
                           v-bind:class="{'opacity-03':process}">
                        <slot name="thead">
                            <thead>
                            <tr v-if="message_help !== ''">
                                <td v-bind:colspan="total_col">
                                    <div class="alert alert-info" v-html="message_help"></div>
                                </td>
                            </tr>
                            <tr v-if="search_active === true && 1 === 0">
                                <td v-bind:colspan="total_col" style="padding: 0 !important;">
                                    <div class="col-md-4 pull-right text-right"
                                         v-if="$store.getters.getFilters.length > 1">
                                        <a href="#"
                                           v-on:click.prevent="closeExternalFilters"
                                           class="open-filter">
                                            <i class="fa"
                                               :class="{'fa-caret-square-o-left':!$store.getters.getExternalFilters,
                                            'fa-caret-square-o-right':$store.getters.getExternalFilters}"
                                            ></i>
                                        </a>
                                    </div>
                                    <filters></filters>
                                </td>
                            </tr>
                            <tr class="fixed" style="display: none;">
                                <th :style="{width:50+'px'}" class="text-center" v-if="checked === true">
                                    <div class="form-check abc-checkbox">
                                        <input class="form-check-input" id="check-all_hidden" type="checkbox"
                                               v-on:change="checkAll($event)">
                                        <label class="form-check-label" for="check-all_hidden"
                                               style="cursor:default;"></label>
                                    </div>
                                </th>
                                <th v-for="column in $store.getters.getTableCols"
                                    :class="column.class"
                                    v-on:click="sort($event,column)"
                                    :style="{width: (column.width)?column.width+'px':'auto'}">
                                    {{column.name}}
                                </th>
                            </tr>
                            <tr>
                                <th :style="{width:50+'px'}" class="text-center" v-if="checked === true">
                                    <div class="form-check abc-checkbox">
                                        <input class="form-check-input" id="check-all" type="checkbox"
                                               v-on:change="checkAll($event)">
                                        <label class="form-check-label" for="check-all"
                                               style="cursor:default;"></label>
                                    </div>
                                </th>
                                <th v-for="(column, index) in $store.getters.getTableCols"
                                    :class="column.class"
                                    v-on:click="sort($event,column)"
                                    :style="{width: (column.width)?column.width+'px':'auto'}">
                                    {{column.name}}
                                </th>
                            </tr>
                            </thead>
                        </slot>
                        <slot name="tbody">
                            <tbody>
                            <slot name="tr-empty" v-if="$store.getters.getTableItems.length == 0">
                                <tr>
                                    <td v-bind:colspan="total_col">
                                        <div class="alert alert-info text-center">
                                            {{'Нет данных для отображения'|_}}
                                        </div>
                                    </td>
                                </tr>
                            </slot>
                            <slot name="tr" v-for="(item, index) in $store.getters.getTableItems">
                                <tr>
                                    <td class="text-center" v-if="checked === true">
                                        <div class="form-check abc-checkbox">
                                            <input class="form-check-input" type="checkbox"
                                                   :checked="item.checked" :id="'record-'+item.id"
                                                   v-on:change="checkItem(item,$event)">
                                            <label class="form-check-label" style="cursor:default;"
                                                   :for="'record-'+item.id"></label>
                                        </div>
                                    </td>
                                    <td v-for="(column,index) in $store.getters.getTableCols"
                                        :class="column.class"
                                        :style="{width: (column.width) ? column.width + 'px' : 'auto'}">
                                        <span v-if="column.domain && item.suffix">
                                            &nbsp;
                                            <i class="fa fa-globe" v-if="item.site_id == '000' && item.suffix == null"
                                               data-toggle="tooltip"
                                               data-placement="top" title="Общий доступ"></i>
                                            <i class="fa fa-globe" v-if="item.suffix" data-toggle="tooltip"
                                               data-placement="top"
                                               v-bind:title="'#'+item.suffix.code +' '+item.suffix.text.name"
                                               v-bind:style="{color: '#' + item.suffix.color }"></i>
                                            &nbsp;
                                        </span>
                                        <span class="_link-block">
                                          <router-link v-if="column.link != null"
                                                  :to="{name:column.link,params:{id:item.id}}"
                                                  v-html="getItemData(item,column.key)">
                                          </router-link>
                                          <router-link
                                                  v-if="(item.link != null && item.blank == null)"
                                                  :to="{path:item.link,params:{id:item.id}}"
                                                  v-html="getItemData(item,column.key)">
                                          </router-link>
                                          <span v-if="(column.link == null && item.link  == null) && !column.modal"
                                                v-html="getItemData(item,column.key)">
                                          </span>
                                          <a href="#" class="text-danger" v-if="column.modal"
                                             v-html="getItemData(item,column.key)"
                                             v-on:click.prevent="showModal($event,item)">
                                          </a>
                                      </span>
                                        <div class="hidden _action_block_" v-if="column.action">
                                            <span class="label label-default" v-if="column.action.edit">
                                               <router-link v-if="column.link != null"
                                                            :to="{name: (column.edit_link) ? column.edit_link : column.link ,params:{id:item.id}}">
                                                   <i class="fa fa-edit"></i>
                                                   {{'Редактировать'|_}}
                                               </router-link>
                                            </span>
                                            <span class="label label-default" v-if="column.action.replicate">
                                                 <a href="#" v-on:click.prevent="replicateItem($event,item.id)">
                                                   <i class="fa fa-copy"></i> {{'Копировать'|_}}
                                                 </a>
                                            </span>
                                            <span class="label label-danger"
                                                  v-if="column.action.delete && access.delete">
                                              <a href="#" v-on:click.prevent="deleteItems($event,item.id)">
                                                  <i class="fa fa-trash"></i> {{'Удалить'|_}}
                                              </a>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </slot>
                            </tbody>
                        </slot>
                        <tfoot>
                        <tr>
                            <td :colspan="total_col">
                                <div class="col-sm-12">
                                    <div class="col-md-2">
                                        <div class="form-group" style="margin-top: 20px;">
                                            <select v-model="limit"
                                                    name="limit" class="chosen-select-filter form-control"
                                                    tabindex="2">
                                                <option v-for="item in tableLimit"
                                                        v-bind:value="item.id">
                                                    {{item.name}}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <ul class="pagination pull-right" v-if="pages > 1">
                                        <li class="footable-page-arrow"
                                            v-bind:class="{ 'disabled': (current_page === 1)}"
                                            v-on:click="paginate($event,1)"
                                            v-if="pages > 1">
                                            <a href="#">«</a>
                                        </li>
                                        <li class="footable-page-arrow"
                                            v-bind:class="{ 'disabled': (current_page === 1)}"
                                            v-on:click="paginate($event,current_page-1)"
                                            v-if="pages > 1">
                                            <a href="#">‹</a>
                                        </li>
                                        <li class="footable-page" v-if="(current_page - 2) > 0">
                                            <a href="#" v-on:click="paginate($event,current_page - 2)">
                                                {{current_page - 2}}
                                            </a>
                                        </li>
                                        <li class="footable-page" v-if="(current_page - 1) > 0">
                                            <a href="#" v-on:click="paginate($event,current_page - 1)">
                                                {{current_page - 1}}
                                            </a>
                                        </li>
                                        <li class="active">
                                            <span>{{current_page}}</span>
                                        </li>
                                        <li class="footable-page" v-if="(current_page + 1) <= pages">
                                            <a href="#" v-on:click="paginate($event,current_page + 1)">
                                                {{current_page + 1}}
                                            </a>
                                        </li>
                                        <li class="footable-page" v-if="(current_page + 2) < pages">
                                            <a href="#" v-on:click="paginate($event,current_page + 2)">
                                                {{current_page + 2}}
                                            </a>
                                        </li>
                                        <li class="footable-page-arrow"
                                            v-bind:class="{ 'disabled': (current_page === pages)}"
                                            v-if="pages > 1">
                                            <a href="#" v-on:click="paginate($event,current_page+1)">›</a>
                                        </li>
                                        <li class="footable-page-arrow"
                                            v-bind:class="{ 'disabled': (current_page === pages)}"
                                            v-if="pages > 1">
                                            <a href="#" v-on:click="paginate($event, pages)"
                                               data-toggle="tooltip">»</a>
                                        </li>
                                    </ul>
                                </div>

                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="col-md-3" v-if="$store.getters.getExternalFilters">
                    <filters-side></filters-side>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import Vue from 'vue';
    import {FdTranslator} from '@/FdTranslator';
    import {Util} from '@/Util';
    import {CrudService} from '@/services/CrudService';
    import Component from 'vue-class-component';
    import {Prop, Provide, Watch} from 'vue-property-decorator';
    import Filters from '@/components/table/Filters.vue';
    import DataPreview from '@/components/table/DataPreview.vue';
    import FiltersSide from '@/components/table/FiltersSide.vue';

    declare let ADMIN_ACCESS: string;
    declare let $: any;

    @Component({
        name: 'DataTable',
        components: {
            'filters': Filters,
            'preview': DataPreview,
            'filters-side': FiltersSide
        },
        filters: {
            'json': function (value) {
                return JSON.stringify(value, null, 2)
            },
            _: function (value) {
                return FdTranslator._(value);
            }
        }
    })

    export default class DataTable extends Vue {

        @Prop({
            default: {
                title: '',
                tools: false,
                url: '/',
                help: false,
                help_name: ''
            }
        })
        option: {
            title: string,
            tools: boolean,
            url: '/',
            help: boolean,
            help_name: string
        };

        @Provide()
        total_col: number = 0;

        @Provide()
        limit: number = 25;

        @Provide()
        access: any = {};

        @Provide()
        items: any = [];

        @Provide()
        cols: any = [];

        @Provide()
        message_help: string = '';

        @Provide()
        url: string = '';

        @Provide()
        process: boolean = true;

        @Provide()
        checked: boolean = true;


        @Provide()
        tableData: {
            data?: {
                view?: string,
                page?: number,
                order_by?: string,
                direction?: string,
                filter?: {
                    title?: string,
                    status?: string,
                    date?: {},
                    site_id?: string
                }
            }
        } = {
            data: {
                view: 'table',
                page: 1,
                order_by: '',
                direction: '',
                filter: {
                    title: '',
                    status: '',
                    date: {},
                    site_id: '001'
                }
            }
        };

        @Provide()
        headerInit: boolean = false;

        /**
         * Классы фиксированного заголовка
         */
        @Provide()
        headerCls: {
            animated: boolean,
            fadeIn: boolean,
            fadeDown: boolean
        } = {
            animated: true,
            fadeIn: false,
            fadeDown: false
        };

        /**
         * Массив элементов управления (кнопок) выводимых в верхней части таблицы
         */
        @Provide()
        actionButtons: any = [];

        /**
         * Флаг доступности использования фильтров
         */
        @Prop({default: true})
        search_active: boolean;

        /**
         * Массив возможных состояний, иногда передается с сервера для более персонализированного поиска
         */
        @Provide()
        state: any = [];

        /**
         * Флаг отображения дополнительных кнопок управления в таблице
         */
        @Prop({default: true})
        show_buttons: boolean;

        /**
         * Внешний метод для выполнения в случае успешного запроса к серверу
         */
        @Provide()
        tableCallback: any = null;

        /**
         * Массив вариантов кол-ва записей на страницу, 25\50\100 и т.д.
         */
        @Provide()
        tableLimit: any = [];

        /**
         * Текущая страница
         */
        @Provide()
        current_page: number = 1;

        /**
         * Кол-во страниц
         */
        @Provide()
        pages: number = 1;

        @Watch('limit')
        onTableFilterLimitChange(newValue, oldValue) {
            if (newValue) {
                let me = this;
                me.$set(me, 'tableData.data.limit', newValue);
                me.update();
            }
        }

        @Watch('$store.getters.getTableCols')
        onChangeTableCols(newCols, oldCols) {
            let me = this;
            me.total_col = (me.$store.getters.getTableCols) ? me.$store.getters.getTableCols.length : 0;
            if (me.checked == true) {
                me.total_col += 1;
            }
        }

        @Watch('$store.getters.getSelectedItems')
        onChangeTableColsSelected(newCols, oldCols) {
            let me = this;
            if (me.$store.getters.getSelectedItems.length == 0) {
                $('*[data-disabled_selection=Y]').addClass('disabled');
            } else {
                $('*[data-disabled_selection=Y]').removeClass('disabled');
            }
        }

        mounted(): void {
            let me = this,
                parent: any = me.$parent;
            me.url = [window.location.protocol + '//' + window.location.hostname, ADMIN_ACCESS, me.option.url].join('/');

            me.$set(me, 'tableLimit', [
                {id: 25, name: 25},
                {id: 50, name: 50},
                {id: 100, name: 100}
            ]);

            me.$store.commit('setSplashScreen', true);

            if (me.show_buttons === true) {

                let actionButtons = [
                    {
                        text: FdTranslator._('Создать'),
                        icon: 'fa-plus',
                        cls: 'btn-success btn-sm',
                        visible: (parent.create_route) ? true : false,
                        action: function ($event) {
                            let route = parent.create_route;
                            if (typeof route == 'string') {
                                me.$router.push({
                                    name: parent.create_route, params: {
                                        id: '0',
                                        alias: me.$route.params.alias
                                    }
                                });
                            }
                            if (typeof route == 'function') {
                                route(me);
                            }
                        }
                    },
                    {
                        text: FdTranslator._('Изменить'),
                        icon: 'fa-pencil-square-o',
                        cls: 'btn-default btn-sm disabled',
                        visible: (parent.create_route) ? true : false,
                        disabled_selection: 'Y',
                        action: function ($event) {
                            let ids = me.$store.getters.getSelectedItems;
                            switch (ids.length) {
                                case 0:
                                    Util.showWarning(FdTranslator._('Не выбран элемент'));
                                    break;
                                case 1:
                                    me.$router.push({name: parent.create_route, params: {id: ids[0].id}});
                                    break;
                                default:
                                    Util.showWarning(FdTranslator._('Выбрано более одного элемента'));
                                    break;
                            }
                        }
                    },
                    {
                        text: FdTranslator._('В корзину'),
                        icon: 'fa-trash',
                        visible: true,
                        disabled_selection: 'Y',
                        cls: 'btn-default btn-sm disabled',
                        action: function ($event) {
                            me.deleteItems($event);
                        }
                    },
                    {
                        text: FdTranslator._('Обновить'),
                        icon: 'fa-repeat',
                        cls: 'btn-sm btn-default animated fadeIn',
                        visible: true,
                        action: function ($event) {
                            me.$store.commit('setSplashScreen', true);
                            me.headerInit = false;
                            me.loadPage(me.tableData, me.tableCallback);
                        }
                    },
                    {
                        text: FdTranslator._('Удалить'),
                        icon: 'fa-trash-o',
                        cls: 'btn-danger btn-sm animated fadeIn disabled',
                        visible: true,
                        disabled_selection: 'Y',
                        action: function ($event) {
                            let ids = [],
                                selected = me.$store.getters.getSelectedItems;

                            if (selected.length) {
                                Util.deleteDialog({
                                    title: '', text: '',
                                    callback: function () {
                                        selected.forEach(function (element) {
                                            ids.push(element.id);
                                        });
                                        me.itemUpdate({
                                            ids: ids,
                                            field: 'deleted',
                                            value: 1
                                        });
                                    }
                                })
                            } else {
                                Util.showWarning(FdTranslator._('Не выбраны записи в таблице'));
                            }
                        }
                    }
                ];
                if (window.history.length > 1) {
                    actionButtons.unshift(Util.buttonBack());
                }
                me.$set(me, 'actionButtons', actionButtons)
            } else {
                me.$set(me, 'actionButtons', []);
            }
            let name_view_tables = (parent.name_view_tables !== undefined) ? parent.name_view_tables : 'default_table';

            me.$set(me, 'tableData', {
                data: {
                    view: Util.getLocalVar(name_view_tables, 'table'),
                    page: 1,
                    order_by: '',
                    direction: '',
                    filter: {
                        title: '',
                        status: '',
                        date: {},
                        site_id: '001'
                    }
                }
            });

            if (parent.status) {
                me.$set(me, 'state', parent.state);
            } else {
                me.$set(me, 'state', me.$store.getters.getCrudStateList);
            }

            if (parent.extend_buttons) {
                parent.extend_buttons.forEach(function (element, idx) {
                    element.me = me;
                    me.actionButtons.push(element);
                });
                me.$set(me, 'actionButtons', me.actionButtons)
            }

            me.loadPage({
                url: me.url,
                data: {
                    page: (me.$route.params.page) ? me.$route.params.page : 1,
                    filter: {},
                    view: me.tableData.data.view
                }
            }, function (response: any) {
                if (me.$parent && response.data.instance_name) {
                    me.$parent.$set(me, 'name', response.data.instance_name);
                }

                if (response.data.message) {
                    me.message_help = response.data.message;
                }
            });

            me.$store.dispatch('setTableUpdate', me.update);
        }

        loadPage(data: any, callback: any = null) {
            let me = this,
                parent: any = me.$parent;
            data.data.limit = me.limit;
            data.data.filters = me.$store.getters.getApplyFilters;
            if (data.url !== undefined) {
                me.$set(me, 'tableData', data);
                me.$set(me, 'tableCallback', callback);
                me.$set(me, 'process', true);

                CrudService.postPage(data.url, data.data).then((response: any) => {
                    me.$set(me, 'process', false);

                    if (response.data.success) {
                        if (response.data.breadcrumbs !== undefined) {
                            me.$store.dispatch('setBreadcrumbs', {
                                items: response.data.breadcrumbs,
                                page_title: response.data.page_title
                            });
                        }
                        if (response.data.notifications !== undefined) {
                            me.$store.dispatch('setNotifications', response.data.notifications);
                        }
                        if (response.data.filters != undefined && me.$store.getters.getApplyFilters.length == 0) {
                            me.$store.dispatch('setFilters', response.data.filters);
                        }
                        if (response.data.access != undefined) {
                            me.$set(me, 'access', response.data.access);
                        }
                        if (response.data.status != undefined) {
                            me.$set(me, 'status', response.data.status);
                        }

                        me.$set(me, 'pages', (response.data.pages !== undefined) ? response.data.pages : 1);
                        me.$set(me, 'current_page', (response.data.current_page !== undefined) ? parseInt(response.data.current_page) : 1);
                        me.$store.dispatch('setTableItems', {
                            items: response.data.items,
                            cols: response.data.cols
                        });

                        callback(response);
                        Util.showSuccess('Команда выполнена успешно');
                        me.$nextTick(function () {

                            if (me.headerInit === false) {
                                me.initScrollHeader();
                                me.headerInit = true;
                            }
                            if (me.show_buttons) {
                                me.buttonCmd({
                                    icon: 'fa-trash',
                                    field: 'visible',
                                    value: me.access.delete
                                });
                                me.buttonCmd({
                                    icon: 'fa-trash-o',
                                    field: 'visible',
                                    value: me.access.delete
                                });
                                me.buttonCmd({
                                    icon: 'fa-plus',
                                    field: 'visible',
                                    value: me.access.create
                                });
                                me.buttonCmd({
                                    icon: 'fa-check',
                                    field: 'visible',
                                    value: me.access.update
                                });
                                me.buttonCmd({
                                    icon: 'fa-pencil-square-o',
                                    field: 'visible',
                                    value: me.access.update
                                });
                            }
                            Util.initTooltip();
                            Util.documentUp();
                        })
                    } else {
                        me.errorLoadPage(response);
                    }
                }).catch((response) => {
                    me.errorLoadPage(response);
                });
            }
        }

        errorLoadPage(response): void {
            let me = this;
            me.$set(me, 'process', false);

            me.$store.dispatch('setBreadcrumbs', {
                items: [{
                    url: false,
                    name: ''
                }],
                page_title: FdTranslator._('Ошибка выполнения запроса')
            });
            Util.errorHandler(response);
        }

        initScrollHeader(): void {
            let me = this,
                table = $('table'),
                tr = $('tr.fixed', table);
            if (tr.length == 0) {
                return;
            }

            if ($(tr).next().length) {
                let origOffsetY = $(tr).next().offset().top,
                    cloneTr = tr,
                    fixTable = $('<table class="table table-bordered table-striped _table_"><thead></thead></table>'),
                    buttonBar = $('.control-btn'),
                    tableOffset = $(table).offset();

                $(fixTable).css({
                    width: $(table).outerWidth(),
                    display: 'none',
                    top: 0,
                    left: tableOffset.left,
                    position: 'fixed',
                    zIndex: 2500,
                    background: 'white'
                });

                buttonBar.css({
                    top: 40,
                    zIndex: 2510,
                    // left: (tableOffset.left + (($(table).outerWidth() / 2) - (buttonBarWidth / 2))) + 'px'
                });

                $(fixTable).children('thead').append(cloneTr);
                $('.x_panel').append(fixTable);
                $(window).resize(function () {
                    fixTable.css({
                        width: $(table).outerWidth(),
                    })
                });


                $(document).scroll(function () {
                    let y = ($(window).scrollTop());
                    if (y > origOffsetY) {
                        fixTable.show();
                        cloneTr.show();
                        buttonBar
                            .addClass('btn-group')
                            .css({
                                position: 'fixed',
                                left: (tableOffset.left + (($(table).outerWidth() / 2) - ((buttonBar).outerWidth() / 2))) + 'px'
                            });
                        $('button > span', buttonBar).hide();
                        me.headerCls.fadeIn = true;
                    } else {
                        fixTable.hide();
                        cloneTr.hide();
                        buttonBar
                            .removeClass('btn-group')
                            .css({
                                position: 'inherit',
                            });
                    }
                });
            }
        }

        buttonCmd(data: { icon: string, field: string, value: any }): void {
            let me = this;
            me.$set(me, 'actionButtons', Util.buttonCmd(me.actionButtons, data));
        }

        paginate(event: Event, page: any) {
            event.preventDefault();

            let me = this, parent: any = me.$parent;
            if (parent.page_route) {
                me.$router.push({
                    name: parent.page_route,
                    params: {page: page, alias: me.$route.params.alias}
                })
            }
            me.tableData.data.page = page;
            if (!parent.skip_load_page) {
                me.headerInit = false;
                me.loadPage(me.tableData, me.tableCallback);
            }
        }

        checkAll($event: any): void {
            if ($event) {
                this.$store.dispatch('setTableItemCheckedAll', {state: $event.target.checked});
            }
        }

        checkItem(item: any, $event: any): void {
            if ($event) {
                this.$store.dispatch('setTableItemChecked', {item: item, state: $event.target.checked});
            }
        }

        update(): void {
            this.loadPage(this.tableData, this.tableCallback);
        }

        replicateItem($event: Event, id?: any): void {
            let me = this,
                parent: any = me.$parent;

            CrudService.post(me.url + '/update', {
                id: id,
                field: 'replicate',
                value: 1
            }).then((response: any) => {
                if (response.data.success) {
                    console.log(parent.create_route)
                    if (response.data.items.length) {
                        me.$router.push({
                            name: parent.create_route, params: {
                                id: response.data.items[0].id
                            }
                        });
                    } else {
                        Util.showSuccess('');
                        me.update();
                    }
                } else {
                    Util.errorHandler(response);
                    me.update();
                }
            }, (response) => {
                Util.errorHandler(response)
            });
        }

        deleteItems($event: Event, id?: any): void {
            let ids = [], me = this,
                selected = me.$store.getters.getSelectedItems;
            if (selected.length || id) {
                Util.deleteDialog({
                    title: '', text: '',
                    callback: function () {
                        selected.forEach(function (element) {
                            ids.push(element.id);
                        });
                        me.itemUpdate({
                            ids: (ids.length) ? ids : [id],
                            field: 'deleted',
                            value: 1
                        });
                    }
                })
            } else {
                Util.showWarning(FdTranslator._('Не выбраны записи в таблице'));
            }
        }

        getItemData(item: any, name: string): any {
            return item[name];
        }

        cmd(item: any, command: string, $event: Event): void {
            this.$set(this, 'process', true);
            switch (command) {
                case 'published':
                case 'favorites':
                case 'trash':
                case 'state':
                    if (command == 'published' && !item[command]) {
                        command = 'state';
                    }
                    this.itemUpdate({
                        id: item.id,
                        field: command,
                        value: (item[command] == 1) ? 0 : 1
                    });
                    break;
            }
        }

        itemUpdate(item: any): void {
            let me = this;
            CrudService.post(me.url + '/update', item).then((response: any) => {
                if (response.data.success) {
                    me.update();
                } else {
                    Util.errorHandler(response)
                }
            }, (response) => {
                Util.errorHandler(response)
            });
        }

        sort($event: Event, column: any): void {
            $event.preventDefault();
        }

        sortTable(event): void {
            let dir = $(event.srcElement).data('direction'),
                field = $(event.srcElement).data('field');
            dir = (dir == '' || dir == 'asc') ? 'desc' : 'asc';
            $('.sorting').removeClass('sorting_asc').removeClass('sorting_desc');
            this.tableData.data.order_by = field;
            this.tableData.data.direction = dir;
            switch (dir) {
                case 'asc':
                    $(event.srcElement).removeClass('sorting_desc')
                        .addClass('sorting_asc').data('direction', dir);
                    break;
                case 'desc':
                    $(event.srcElement).removeClass('sorting_asc')
                        .addClass('sorting_desc').data('direction', dir);
                    break;
            }
            this.loadPage(this.tableData, this.tableCallback);
        }

        helpStatic(): void {
            Util.help(this.option.help_name, this)
        }

        showModal($event, item) {
            this.$store.dispatch('setPreview', item._modal);
        }

        closeExternalFilters() {
            this.$store.dispatch('setExternalFilters', (!this.$store.getters.getExternalFilters))
        }

        beforeDestroy(): void {
            let me = this;
            me.$store.dispatch('setPreview', null);
        }
    }
</script>

<style scoped lang="scss">
    .opacity-03 {
        opacity: 0.3;
    }

    .open-filter {
        font-size: 20px;
    }
</style>
