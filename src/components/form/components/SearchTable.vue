<template>
    <div>
        <button type="button" v-on:click="showSearch"
                style="position: absolute; top: 6px; right: 20px;"
                class="btn btn-xs btn-primary">
            <i class="fa fa-bars"></i>
        </button>

        <div class="modal fade" id="search_modal" tabindex="-1" role="dialog" aria-hidden="true"
             style="font-size: 13px;">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                        </button>
                        <h4 class="modal-title">{{title|_}}</h4>
                    </div>
                    <div class="modal-body" style="min-height: 250px; padding: 0">
                        <div class="splash-screen animated fadeInDown" v-if="splashScreen"
                             :style="{minHeight: 250+ 'px',paddingTop:50+'px'}">
                            <i class="fa fa-paw" style="font-size: 80px"></i>
                        </div>
                        <table class="table table-hover table-bordered" v-if="splashScreen == false">
                            <thead>
                            <tr>
                                <th colspan="2">
                                    <input type="text" v-model="search" class="form-control">
                                </th>
                            </tr>
                            <tr>
                                <th style="width: 80px; text-align: center">#</th>
                                <th>{{'Название'|_}}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-if="items.length == 0">
                                <td colspan="2">
                                    <p class="alert alert-info">
                                        <strong>{{'Нет данных для отображения'|_}}</strong>
                                    </p>
                                </td>
                            </tr>
                            <tr v-if="items.length > 0" v-for="item in items">
                                <td class="text-center">
                                    {{item.id}}
                                </td>
                                <td>
                                <span class="muted" v-if="item.depth > 0" v-for="n in item.depth">
                                            &#9482;&nbsp;</span>
                                    <a href="javascript:void(0)" v-on:click="callback_function(item,$event)">
                                        {{item.name}}
                                    </a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-white" data-dismiss="modal">{{'Закрыть'|_}}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator';
    import {FdTranslator} from '@/FdTranslator';
    import {CrudService} from "@/services/CrudService";
    import {Util} from "@/Util";


    declare let $: any;

    @Component({
        name: 'Seo',
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        },
        components: {}
    })

    export default class SearchTable extends Vue {


        @Prop({default: 'search-table'})
        title: string;

        @Prop({default: ''})
        data_url: string;

        @Prop({default: null})
        callback: any;

        @Prop({default: null})
        filter: any;

        @Provide()
        items: any = [];

        @Provide()
        timeout: any = null;

        @Provide()
        search: string = '';

        @Provide()
        splashScreen: boolean = true;

        @Prop({default: 'search_content_table'})
        name_view_tables: string;

        @Provide()
        table_filter: {
            root?: number
        } = null;

        @Watch('search')
        onChangeSearch(newValue, oldValue) {
            console.log(newValue);
            let me = this;
            if (me.timeout) {
                clearTimeout(me.timeout);
            }
            me.timeout = setTimeout(function () {
                me.splashScreen = true;
                me.filter.query = newValue;
                me.load();
            }, 500)
        }


        mounted(): void {
            let me = this;
        }

        showSearch(): void {
            let me = this;
            $('#search_modal').on('shown.bs.modal', function () {
                $(this).unbind('shown.bs.modal');
                me.load();
            }).on('hide.bs.modal', function () {
                me.splashScreen = true;
            }).modal('show')
        }

        load(): void {
            let me = this;
            CrudService.post(Util.httpRoot + me.data_url, {
                filter: me.filter
            }).then((response: any) => {
                me.splashScreen = false;
                if (response.data.success) {
                    me.items = response.data.items;
                }
            }).catch((response) => {
                Util.errorHandler(response);
            });
        }

        callback_function(item: any, $event: Event): void {
            let me = this;
            if (this.callback.fn) {
                this.callback.fn(item);
            }
            $('#search_modal').on('', function () {
                me.splashScreen = false;
            }).modal('hide');
        }
    }
</script>

<style scoped>

</style>
