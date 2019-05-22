<template>
    <div class="animated fadeInUp" v-if="$store.getters.getSplashScreen === false">
        <div class="x_panel">
            <div class="x_title" v-if="option.title !== '' || option.tools === true">
                <h2 v-if="option.title !== ''">{{option.title}}</h2>
                <ul class="nav navbar-right panel_toolbox" v-if="option.tools">
                    <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href="#">Settings 1</a>
                            </li>
                            <li><a href="#">Settings 2</a>
                            </li>
                        </ul>
                    </li>
                    <li><a class="close-link"><i class="fa fa-close"></i></a>
                    </li>
                </ul>
                <div class="clearfix"></div>
            </div>
            <div class="x_content">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <slot name="thead">
                            <thead>
                            <tr v-if="message_help !== ''">
                                <td v-bind:colspan="total_col">
                                    <div class="alert alert-info" v-html="message_help"></div>
                                </td>
                            </tr>
                            <tr>
                                <th v-for="col in $store.getters.getTableCols">
                                    {{col.name}}
                                </th>
                            </tr>
                            </thead>
                        </slot>
                        <slot name="tbody">
                            <tbody>
                            <slot name="tr">
                                <tr v-for="(item, index) in $store.getters.getTableItems">
                                    <td v-for="column in cols"
                                        :class="column.class"
                                        :style="{width: (column.width) ? column.width + 'px' : 'auto'}">
                                        {{item[column.key]}}
                                    </td>
                                </tr>
                            </slot>
                            </tbody>
                        </slot>
                    </table>
                </div>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
    import {Component, Provide, Prop, Vue, Watch} from 'vue-property-decorator'
    import {CrudService} from '@/services/CrudService';
    import {FdTranslator} from '@/FdTranslator';
    import {Util} from '@/Util';

    declare let ADMIN_ACCESS: string;
    declare let $: any;

    @Component({
        name: 'DataTable',
        components: {}
    })

    export default class DataTable extends Vue {

        @Prop({
            default: {
                title: '',
                tools: false,
                url: '/'
            }
        })
        option: {
            title: string,
            tools: boolean,
            url: '/'
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
         * Флаг отображения дополнительных кнопок управления в таблице
         */
        @Prop({default: true})
        show_buttons: boolean;

        /**
         * Внешний метод для выполнения в случае успешного запроса к серверу
         */
        @Provide()
        tableCallback: any = null;

        @Watch('$store.getters.getTableCols')
        onChangeTableCols(newCols, oldCols) {
            let me = this;
            me.total_col = (me.$store.getters.getTableCols) ? me.$store.getters.getTableCols.length : 0;
            if (me.checked == true) {
                me.total_col += 1;
            }
        }

        mounted(): void {
            let me = this, parent: any = me.$parent;
            me.url = [window.location.protocol + '//' + window.location.hostname, ADMIN_ACCESS, me.option.url].join('/');

            me.$store.commit('setSplashScreen', true);

            if (me.show_buttons === true) {

                let actionButtons = [
                    {
                        text: FdTranslator._('Создать'),
                        icon: 'fa-plus',
                        cls: 'btn-primary btn-sm',
                        visible: (parent.create_route) ? true : false,
                        action: function ($event) {
                            let route = parent.create_route;
                            if (typeof route == 'string') {

                                me.$router.push({
                                    name: parent.create_route, params: {
                                        id: 'new',
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
                        cls: 'btn-default btn-sm',
                        visible: (parent.create_route) ? true : false,
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
                        cls: 'btn-default btn-sm',
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
                            me.loadPage(me.tableData, me.tableCallback);
                        }
                    },
                    {
                        text: FdTranslator._('Удалить'),
                        icon: 'fa-trash-o',
                        cls: 'btn-danger btn-sm animated fadeIn',
                        visible: true,
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
                me.$set(me, 'status', parent.status);
            } else {
                me.$set(me, 'status', me.$store.getters.getCrudStateList);
            }
            if (parent.extend_buttons) {
                parent.extend_buttons.forEach(function (element, idx) {
                    element.me = me;
                    me.actionButtons.push(element);
                });
                me.$set(me, 'actionButtons', me.actionButtons)
            }

            me.loadPage({
                url:  me.url,
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

                        switch (me.tableData.data.view) {
                            case 'table':
                                me.$set(me, 'pages', (response.data.pages !== undefined) ? response.data.pages : 1);
                                me.$set(me, 'current_page', (response.data.current_page !== undefined) ? parseInt(response.data.current_page) : 1);
                                me.$store.dispatch('setTableItems', {
                                    items: response.data.items,
                                    cols: response.data.cols
                                });
                                break;
                            case 'tree':
                                me.$set(me, 'items', response.data.items);
                                break;
                        }
                        callback(response);
                        Util.showSuccess('Команда выполнена успешно');
                        setTimeout(function () {
                            me.$set(me, 'animationCls', false);
                        }, 700);
                        me.$nextTick(function () {
                            switch (me.tableData.data.view) {
                                case 'table':
                                    if (me.headerInit === false) {
                                        me.initScrollHeader();
                                        me.headerInit = true;
                                    }
                                    // if ((me.access !== undefined) && me.access.reorder) {
                                    //     me.initListSortable();
                                    // }
                                    // $('.chosen-select-filter').trigger('chosen:updated');
                                    break;
                                case 'tree':
                                    // me.headerInit = false;
                                    // if (me.access.reorder) {
                                    //     me.tree_plugins.push('dnd');
                                    // }
                                    // if (me.tree == null) {
                                    //     me.initTree({
                                    //         reorder_url: parent.reorder_url + '-tree',
                                    //         edit_route_name: parent.create_route,
                                    //         delete_callback: function () {
                                    //             Util.deleteDialog({
                                    //                 title: '', text: '',
                                    //                 callback: function () {
                                    //                     me.itemUpdate({
                                    //                         ids: [],
                                    //                         field: 'deleted',
                                    //                         value: 1
                                    //                     });
                                    //                 }
                                    //             })
                                    //         },
                                    //         state_callback: function () {
                                    //
                                    //         }
                                    //     });
                                    // } else {
                                    //     me.updateTree();
                                    // }
                                    break;
                            }
                            if (me.show_buttons) {
                                me.buttonCmd({
                                    icon: 'fa-trash',
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
                        })
                    } else {
                        if (response.data['404'] == true) {// todo: fix my
                            me.$set(me, 'is_error', true);
                        }
                        me.$store.dispatch('setBreadcrumbs', {
                            items: [{
                                url: false, name: ''
                            }],
                            page_title: FdTranslator._('Ошибка выполнения запроса')
                        });
                        Util.errorHandler(response)
                    }
                }).catch((response) => {
                    me.$set(me, 'process', false);
                    me.$store.dispatch('setBreadcrumbs', {
                        items: [{
                            url: false, name: ''
                        }],
                        page_title: FdTranslator._('Ошибка выполнения запроса')
                    });
                    if (response.data && response.data['404'] == true) {
                        me.$set(me, 'is_error', true);
                    }
                    Util.errorHandler(response);
                });
            }
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
                    top: 60,
                    left: tableOffset.left,
                    position: 'fixed',
                    zIndex: 2500
                });
                buttonBar.css({
                    top: 60,
                    zIndex: 2510,
                    // left: (tableOffset.left + (($(table).outerWidth() / 2) - (buttonBarWidth / 2))) + 'px'
                });

                $(fixTable).children('thead').append(cloneTr);
                $(table).after().append(fixTable);
                $(window).resize(function () {
                    fixTable.css({
                        width: $(table).outerWidth(),
                    })
                });
                $(document).scroll(function () {
                    if (me.tableData.data.view !== 'tree') {
                        let y = ($(window).scrollTop() + 60);
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
                            me.headerCls.fadeIn = false;
                            me.headerCls.fadeDown = true;
                            buttonBar
                                .removeClass('btn-group')
                                .css({
                                    position: 'static'
                                });
                            fixTable.hide();
                            $('button > span', buttonBar).show();
                        }
                    }

                });
            }
        }

        buttonCmd(data: { icon: string, field: string, value: any }): void {
            let me = this;
            me.$set(me, 'actionButtons', Util.buttonCmd(me.actionButtons, data));
        }

        paginate(page: any) {
            let me = this, parent: any = me.$parent;
            if (parent.page_route) {
                me.$router.push({
                    name: parent.page_route,
                    params: {page: page, alias: me.$route.params.alias}
                })
            }
            me.tableData.data.page = page;
            if (!parent.skip_load_page) {
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

        deleteItems($event: Event): void {
            let ids = [], me = this,
                selected = me.$store.getters.getSelectedItems;
            if (selected.length) {
                selected.forEach(function (element) {
                    ids.push(element.id);
                });
                me.itemUpdate({
                    ids: ids,
                    field: 'trash',
                    value: 1
                });
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
            CrudService.post(Util.httpRoot + me.url + '/self-update', item).then((response: any) => {
                if (response.data.success) {
                    me.update();
                } else {
                    Util.errorHandler(response)
                }
            }, (response) => {
                Util.errorHandler(response)
            });
        }
    }
</script>

<style scoped>

</style>