<template>
  <div class="wrapper-content">
    <div class="row">
      <div class="col-lg-12">
        <div class="x_panel">
          <div class="x_title">
            <h5>{{'Обработка переходов'|_}}</h5>
            <div class="pull-right">
              <div class="btn-group">
                <button type="button" class="btn btn-xs btn-white" style="margin:  0!important;"
                        :class="{'active': report_period === 'today'}"
                        v-on:click="report_period = 'today'">{{'Сегодня'|_}}
                </button>
                <button type="button" class="btn btn-xs btn-white" style="margin:  0!important;"
                        :class="{'active': report_period === 'current_month'}"
                        v-on:click="report_period = 'current_month'">{{'Текущий месяц'|_}}
                </button>
                <button type="button" class="btn btn-xs btn-white" style="margin:  0!important;"
                        :class="{'active': report_period === 'total'}"
                        v-on:click="report_period = 'total'">{{'Всего'|_}}
                </button>
              </div>
            </div>
          </div>
          <div class="x_content">
            <div class="row" v-if="report">
              <div class="col-lg-9">
                <div class="flot-chart" style="min-height: 200px">
                  <div class="flot-chart-content" id="graph-menu-stat"></div>
                </div>

              </div>
              <div class="col-lg-3">
                <ul class="stat-list">
                  <li>
                    <h2 class="no-margins">{{report.success}}</h2>
                    <small>{{'Успешно'|_}}</small>
                    <div class="stat-percent font-bold"
                         :title="report.success_percent+'%'">{{report.success_percent}}%
                      <i class="fa fa-check"></i>
                    </div>
                    <div class="progress progress-mini">
                      <div v-bind:style="{width: report.success_percent + '%'}"
                           class="progress-bar"></div>
                    </div>
                  </li>
                  <li>
                    <h2 class="no-margins ">{{report.redirect}}</h2>
                    <small>{{'Перенаправлений'|_}}</small>
                    <div class="stat-percent font-bold"
                         :title="report.redirect_percent + '%'">
                      {{report.redirect_percent}}% <i class="fa fa-retweet"></i>
                    </div>
                    <div class="progress progress-mini">
                      <div v-bind:style="{width: report.redirect_percent + '%'}"
                           class="progress-bar progress-bar-warning"></div>
                    </div>
                  </li>
                  <li>
                    <h2 class="no-margins ">{{report.errors}}</h2>
                    <small>{{'Ошибок'|_}}</small>
                    <div class="stat-percent font-bold">{{report.errors_percent}}%
                      <i class="fa fa-bolt"></i>
                    </div>
                    <div class="progress progress-mini">
                      <div v-bind:style="{width: report.errors_percent + '%'}"
                           class="progress-bar progress-bar-danger"></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DataTable v-bind:option="{
                                  title:'Проверка доступности пунктов меню по протоколу HTTP',
                                  url: data_url,
                                  help:false,
                                  cssClass:'col-lg-12'
                                  }"
                 v-bind:search_active="false"
                 v-bind:checked="false"></DataTable>

    </div>
  </div>

</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import {FdTranslator} from "@/FdTranslator";
    import {MenuService} from "@/services/MenuService";
    import {Util} from "@/Util";
    import * as Highcharts from 'highcharts';
    import DataTable from "@/components/table/Table.vue";
    import fa from "gentelella/vendors/moment/src/locale/fa";

    declare let $: any;

    @Component({
        name: 'MenuIndex',
        components: {
            'DataTable': DataTable
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

    export default class MenuDiagnostic extends Vue {

        @Provide()
        extend_buttons: any = [
            {
                text: FdTranslator._('Начать проверку'),
                icon: 'fa-exchange',
                cls: 'btn-sm btn-default animated fadeIn',
                visible: true,
                action: function ($event) {
                    let me = this.me;

                    function checkRoute(step: number = 1): void {
                        me.$set(me, 'process', true);
                        MenuService.getCheck(step).then((response: any) => {
                            me.process_percent = response.data.progress;
                            if (response.data.pages > response.data.current) {
                                me.checkRoute(response.data.current + 1);
                            } else {
                                me.$emit('setDataUrl', 'menu/check-route');
                                me.$set(me, 'process', false);
                                me.process_percent = 0;
                            }
                        }, (response) => {
                            Util.errorHandler(response);
                        });
                    }

                    checkRoute(1);
                }
            }
        ];

        @Provide()
        report: any = null;

        @Provide()
        graph: any = null;

        @Provide()
        report_period: string = 'total';

        @Provide()
        processed: boolean = false;

        @Provide()
        process_percent: number = 0;

        @Prop({default: 'menu/check-route'})
        data_url: string;

        @Watch('report_period')
        onReportChange(newValue, oldValue) {
            let me = this;
            MenuService.getDiagnostic(me.report_period).then((response: any) => {
                me.updateForm(response);
            }, (response) => {
                Util.errorHandler(response)
            });
        }


        mounted(): void {
            let me = this;
            me.loadDiagnostic();
            me.$store.dispatch('setExternalFilters', false)
        }


        updateForm(response: any): void {
            let me = this;
            if (response.data.success) {
                me.$set(me, 'report', response.data.items[0]);
                me.$set(me, 'graph', response.data.Graph);

                me.$nextTick(function () {
                    $('.chosen-select').trigger('chosen:updated');
                    $('.dropdown-toggle').dropdown();

                    Highcharts.chart('graph-menu-stat', {
                        credits: false,
                        chart: {
                            height: 200,
                            zoomType: 'x',
                            type: 'spline'
                        },
                        title: false,
                        xAxis: {
                            type: 'datetime',
                            startOnTick: true,
                            endOnTick: true,
                            dateTimeLabelFormats: {
                                month: '%e. %b',
                                year: '%b'
                            },
                            title: false
                        },
                        yAxis: {
                            labels: {
                                enabled: true,
                                formatter: function () {
                                    return this.value;
                                }
                            },
                            title: {
                                text: null,
                            },
                            min: 0
                        },
                        tooltip: {
                            // headerFormat: '<b>---</b>',
                            pointFormat: '{series.name}: {point.y}'
                        },
                        plotOptions: {
                            spline: {
                                marker: {
                                    enabled: false
                                }
                            }
                        },
                        series: [{
                            name: FdTranslator._('Успешно'),
                            showInLegend: false,
                            color: '#1ab394',
                            data: me.graph.success
                        }, {
                            name: FdTranslator._('Ошибок'),
                            showInLegend: false,
                            color: '#ED5565',
                            data: me.graph.errors
                        }]
                    });
                })
            } else {
                Util.showWarning(response.data.message);
            }
        }

        loadDiagnostic(): void {
            let me = this;
            MenuService.getDiagnostic(me.report_period).then((response: any) => {
                me.updateForm(response);
            }, (response) => {
                Util.errorHandler(response)
            });
        }

    }
</script>

<style scoped>

</style>
