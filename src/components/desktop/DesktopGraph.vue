<template>
    <div :id="'chart-'+alias"></div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Prop, Provide, Watch} from 'vue-property-decorator'
    import * as Highcharts from 'highcharts';

    declare let $: any;


    @Component({
        name: 'DesktopGraph',
        components: {}
    })

    export default class DesktopGraph extends Vue {

        @Prop({default: []})
        graph_items: any;

        @Prop({default: ''})
        alias: string;

        @Prop({default: 'Просмотров'})
        name: string;

        mounted(): void {
            let me = this;

            me.$nextTick(function () {
                Highcharts.chart('chart-' + me.alias, {
                    credits: false,
                    chart: {
                        height: 200,
                        zoomType: 'x',
                        type: 'line'
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
                        headerFormat: '<b>' + me.name + '</b><br>',
                        pointFormat: '{point.x:%e. %b %H:%M:%S}'
                    },
                    plotOptions: {
                        line: {
                            color: '#1ab394',
                            marker: {
                                enabled: (me.graph_items.length < 2)// false
                            }
                        }
                    },
                    series: [{
                        name: null,
                        showInLegend: false,
                        data: me.graph_items
                    }]
                });
            })
        }
    }
</script>

<style scoped>

</style>