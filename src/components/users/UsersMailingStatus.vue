<template>
    <div v-if="!$store.getters.getSplashScreen">
        <div class="wrapper-content fadeInDown animated tooltip-container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox ">
                        <div class="ibox-title">
                            <div class="control-btn">
                                <button data-style="zoom-in" title="" data-placement="bottom"
                                        data-toggle="tooltip" class="btn btn-responsive btn-sm btn-default"
                                        v-on:click="back">
                                    <i class="fa fa-chevron-left"></i> {{'Назад'|_}}
                                </button>
                                <button data-style="zoom-in" title="" data-placement="bottom"
                                        data-toggle="tooltip" class="btn btn-responsive btn-sm btn-default"
                                        v-on:click="update">
                                    <i class="fa fa-repeat"></i> {{'Обновить'|_}}
                                </button>
                            </div>
                        </div>
                        <div class="ibox-content" :style="{paddingTop:0, minHeight: $store.getters.getTableHeight + 'px'}">

                            <div class="alert alert-info text-center" v-if="report.length == 0">
                                <p>Нет активных рассылок</p>
                            </div>
                            <template v-for="item in report">
                                <div class="well" :class="{'mailing-ready': item.state == 0,'mailing-active': item.state == 1,
                                'mailing-finish': item.state == 2,'mailing-error': item.state == 3}">
                                    <h2>Рассылка: "{{item.mailing.name}}" (#{{item.id}})</h2>
                                    <ul>
                                        <li>Отправлено сообщений: <a href="#">{{item.send_mail}}</a></li>
                                        <!--<li>Ошибок отрпавки: 0</li>-->
                                        <li>Осталось отпарвить: {{item.total_mail - item.send_mail}}</li>
                                        <li>Выполнено: <strong>{{item.percent}}%</strong></li>
                                    </ul>

                                    <!--
                                    <div class="progress">
                                        <div class="progress-bar progress-bar-primary progress-bar-striped progress-bar-animated"
                                             style="width: 75%"></div>
                                    </div>
                                   <button type="button" class="btn btn-danger">
                                        <i class="fa fa-bolt"></i>
                                        Прервать выполнение
                                    </button>-->
                                </div>
                            </template>
                            <!-- <div class="well mailing-errors">
                                 <h2>Рассылка: "Название расылки с ошибками"</h2>
                                 <ul>
                                     <li>Отправлено сообщений: 0</li>
                                     <li>Ошибок отрпавки: 1254</li>
                                     <li>Осталось отпарвить: 0</li>
                                 </ul>
                                 <button type="button" class="btn btn-primary">
                                     <i class="fa fa-bug"></i>
                                     Отчет о ошибках
                                 </button>
                             </div>
                             <div class="well">
                                 <h2>Рассылка: "Название расылки в архиве"</h2>
                                 <ul>
                                     <li>Отправлено сообщений: 1234</li>
                                     <li>Ошибок отрпавки: 0</li>
                                     <li>Осталось отпарвить: 0</li>
                                 </ul>
                                 <button type="button" class="btn btn-success">
                                     <i class="fa fa-repeat"></i>
                                     Повторить рассылку
                                 </button>
                             </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import DataTable from '@/components/table/Table.vue';
    import {FdTranslator} from '@/FdTranslator';
    import {UsersService} from '@/services/UsersService';
    import {Util} from '@/Util';

    declare let $: any;

    @Component({
        name: 'UsersMailingStatus',
        components: {}
    })

    export default class UsersMailingStatus extends Vue {

        @Provide()
        report: any = [];

        mounted(): void {
            let me = this;
            me.load();
        }

        load(): void {
            let me = this;
            UsersService.getMailingProcessList().then((response: any) => {
                if (response.data.success) {
                    me.report = response.data.items;
                    me.$store.dispatch('setBreadcrumbs', {
                        items: response.data.breadcrumbs,
                        page_title: response.data.page_title
                    });
                }
            }, (response) => {
                Util.errorHandler(response)
            });
        }

        back(): void {
            this.$router.push({name: 'mailing'});
        }

        update(): void {
            this.load();
        }
    }
</script>

<style>
    .mailing-active {
        background-color: rgba(26, 179, 148, 0.21);
    }

    .mailing-finish {
        background-color: rgba(22, 155, 179, 0.21);
    }

    .mailing-error {
        background-color: rgba(237, 85, 101, 0.21);
    }

    .mailing-ready {
        background-color: rgba(237, 234, 76, 0.21);
    }
</style>