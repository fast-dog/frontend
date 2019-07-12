<template>
    <div class="wrapper-content animated fadeInUp" v-if="!$store.getters.getSplashScreen">
        <div class="ibox float-e-margins">
            <div class="ibox-content">
                <div class="row" v-if="config">
                    <div class="col-lg-12">
                        <div class="tabs-container">
                            <ul class="nav nav-tabs">
                                <li class="active">
                                    <a data-toggle="tab" href="#tab-info" aria-expanded="true">{{'Информация'|_}}</a>
                                </li>
                                <li><a data-toggle="tab" href="#tab-config" aria-expanded="true">{{'Настройки'|_}}</a>
                                </li>
                                <li><a data-toggle="tab" href="#tab-access" aria-expanded="true">{{'Доступ'|_}}</a></li>
                                <li>
                                    <a data-toggle="tab" href="#tab-change-log" aria-expanded="true">
                                        {{'История изменений'|_}}
                                    </a>
                                </li>
                            </ul>
                            <div class="tab-content">
                                <div id="tab-info" class="tab-pane active">
                                    <div class="panel-body">
                                        <div class="col-lg-3">
                                            <div class="ibox-title">
                                                <h5>
                                                    {{'Статистика базы данных: Пользователи'|_}}
                                                </h5>
                                            </div>
                                            <table class="table table-stripped">
                                                <tbody>
                                                <tr>
                                                    <td class="no-borders">
                                                        {{'Активные'|_}}:
                                                        <strong class="pull-right badge badge-primary"
                                                                :title="reportItems.active_percent + '%'">
                                                            {{reportItems.active}}
                                                        </strong>
                                                        <div class="progress progress-mini">
                                                            <div v-bind:style="{width: reportItems.active_percent + '%'}"
                                                                 class="progress-bar progress-bar-default"></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>{{'Не подтверждены'|_}}:
                                                        <strong class="pull-right badge"
                                                                :title="reportItems.not_confirmed_percent + '%'">
                                                            {{reportItems.not_confirmed}}
                                                        </strong>
                                                        <div class="progress progress-mini">
                                                            <div v-bind:style="{width: reportItems.not_confirmed_percent + '%'}"
                                                                 class="progress-bar progress-bar-warning"></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>{{'Заблокированые'|_}}:
                                                        <strong class="pull-right badge badge-warning"
                                                                :title="reportItems.in_trash_percent + '%'">
                                                            {{reportItems.in_trash}}
                                                        </strong>
                                                        <div class="progress progress-mini">
                                                            <div v-bind:style="{width: reportItems.in_trash_percent + '%'}"
                                                                 class="progress-bar progress-bar-warning"></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>{{'Удалено'|_}}:
                                                        <strong class="pull-right badge badge-danger"
                                                                :title="reportItems.deleted_percent + '%'">
                                                            {{reportItems.deleted}}
                                                        </strong>
                                                        <div class="progress progress-mini">
                                                            <div v-bind:style="{width: reportItems.deleted_percent + '%'}"
                                                                 class="progress-bar progress-bar-danger"></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="col-lg-4">
                                            <div class="ibox-title"><h5>{{'Статистика посещений'|_}}</h5></div>
                                            <graph :graph_items=graph_data
                                                   :alias="'user_visit_stat'"></graph>
                                        </div>
                                        <div class="col-lg-5">
                                            <div class="ibox-title"><h5>{{'Статистика регистраций'|_}}</h5></div>
                                            <graph :graph_items=register_data
                                                   :alias="'user_register_stat'"></graph>
                                        </div>
                                    </div>
                                </div>
                                <div id="tab-config" class="tab-pane">
                                    <div class="panel-body">
                                        <table class="table table-striped tooltip-container">
                                            <tbody v-for="(configItem,name) in configuration">
                                            <template v-if="name != 'ckeditor'">
                                                <tr>
                                                    <td colspan="5">
                                                        <a v-on:click="showSection(configItem)">{{configItem.name}}
                                                            ({{configItem.config.length}})
                                                            <i class="fa"
                                                               :class="{'fa-plus-square-o': (configItem.open == 0),
                                                           'fa-minus-square-o': (configItem.open == 1)}"></i>
                                                        </a>
                                                    </td>
                                                </tr>
                                                <tr v-if="configItem.open == 1">
                                                    <td colspan="5">
                                                        <div class="ibox-title fixed-scroll"
                                                             style="padding-top: 0; padding-bottom: 0; min-height: 20px;">
                                                            <button v-for="button in actionButtons"
                                                                    class="ladda-button btn"
                                                                    v-bind:class="button.cls"
                                                                    data-style="zoom-in"
                                                                    v-on:click="button.action(name, $event)">
                                                                <i class="fa" v-bind:class="button.icon"></i>
                                                                {{button.text}}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr v-for="(item,index) in configItem.config"
                                                    v-if="configItem.open == 1">
                                                    <td>
                                                        {{item.name}}
                                                        <i class="fa fa-question-circle"
                                                           data-toggle="tooltip"
                                                           :title="item.description"
                                                           v-if="item.description"></i>
                                                    </td>
                                                    <td colspan="4">
                                                        <select v-model="item.value"
                                                                name="value"
                                                                class="form-control chosen-select"
                                                                :data-item="item|json"
                                                                :data-index="index"
                                                                :data-type="name">
                                                            <option value="Y">{{'Включено'|_}}</option>
                                                            <option value="N">{{'Отключено'|_}}</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            </template>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div id="tab-change-log" class="tab-pane">
                                    <div class="panel-body">
                                        <table class="table table-striped tooltip-container">
                                            <thead>
                                            <tr>
                                                <th class="text-center" style="width: 100px">{{'Версия'|_}}</th>
                                                <th>{{'Изменения'|_}}</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(description,version) in config.change_log">
                                                <td class="text-center">{{version}}</td>
                                                <td>{{description}}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div id="tab-access" class="tab-pane">
                                    <div class="panel-body">
                                        <acl-list :list_acl=acl></acl-list>
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
    import {Component, Prop, Provide, Watch} from 'vue-property-decorator'
    import {Util} from '@/Util';
    import {UsersService} from '@/services/UsersService';
    import {FdTranslator} from '@/FdTranslator';
    import FormBuilder from '@/components/form/FormBuilder.vue';
    import {CrudService} from '@/services/CrudService';

    declare let $: any;


    @Component({
        name: 'UsersConfiguration',
        components: {}
    })

    export default class UsersConfiguration extends Vue {

        @Provide()
        loaded: boolean = true;

        @Provide()
        config: any = null;

        @Provide()
        reportItems: any = null;

        @Prop()
        reportCategory: any;

        @Provide()
        graph_data: any = null;

        @Provide()
        register_data: any = null;

        @Provide()
        configuration: any = null;

        mounted(): void {
            let me = this;

            me.$set(me, 'actionButtons', [
                {
                    text: FdTranslator._('Сохранить'),
                    icon: 'fa-pencil-square-o',
                    cls: 'btn-primary btn-xs',
                    visible: false,
                    action: function (sectionKey, $event) {
                        me.saveParameters(sectionKey, $event);
                    }
                }
            ]);

            UsersService.getConfiguration().then((response: any) => {
                if (response.data.success) {

                    me.$store.dispatch('setBreadcrumbs', {
                        items: response.data.breadcrumbs,
                        page_title: response.data.page_title
                    });

                    me.$set(me, 'config', response.data.items[0]);
                    me.$set(me, 'reportItems', response.data.items[1]);
                    // me.$set(me, 'acl', <Array<any>>response.data.items[2]);
                    me.$set(me, 'configuration', <Array<any>>response.data.items[3]);
                    me.$set(me, 'graph_data', <Array<any>>response.data.items[4]);
                    me.$set(me, 'register_data', <Array<any>>response.data.items[5]);


                    me.$nextTick(function () {
                        Util.initScrollTab();
                        Util.initTooltip();
                    })
                }
            }, (response) => {
                Util.errorHandler(response)
            });
        }


        clearCache(tag: string, $event: Event): void {
            Util.sendData({
                url: 'user/clear-cache',
                data: {
                    tag: tag
                },
                event: $event,
                callback: function (response) {
                    if (response.body.success && response.body.message !== '') {
                        Util.showSuccess(response.body.message);
                    }
                }
            }, this);
        }

        saveParameters(sectionName: string, $event?: Event): void {
            let me = this;
            Util.sendData({
                event: null,
                data: {
                    type: sectionName,
                    value: me.configuration[sectionName].config
                },
                url: 'users/save-module-configurations',
                callback: function (response) {

                }
            }, me);
        }

        showSection(item: any): void {
            let me = this;
            for (let idx in me.configuration) {
                me.configuration[idx].open = 0;
            }
            item.open = (item.open == 0) ? 1 : 0;

            this.$nextTick(function () {
                Util.initScrollTab();
                Util.initTooltip();
            })
        }
    }
</script>

<style scoped>

</style>