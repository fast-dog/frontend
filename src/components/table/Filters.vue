<template>
    <div class="filters-component" v-click-outside="outside">
        <div class="col-lg-7">
            <div class="input-group filters" v-if="$store.getters.getFilters.length > 0">
                <input type="text" v-bind:placeholder="'Поиск по названию'|_"
                       v-on:keyup="change($store.getters.getFilters[0][0].name,$event)"
                       v-on:focus="showFilters"
                       v-on:click="showFilters"
                       class="form-control">
                <span class="input-group-btn">
            <button type="button" class="btn btn-default">
                <i class="fa fa-gear"></i>
            </button>
        </span>
                <div class="ibox float-e-margins filter-box col-lg-12" v-if="show">
                    <div class="ibox-title">
                        <div class="ibox-tools">
                            <a class="collapse-link" v-on:click="show=false">
                                <i class="fa fa-chevron-up"></i>
                            </a>
                        </div>
                    </div>
                    <div class="ibox-content" style="padding-top: 0; padding-bottom: 10px">
                        <div class="row" style="padding-left: 10px; padding-right: 10px;">
                            <form class="form-horizontal">
                                <template v-for="fields in $store.getters.getFilters">
                                    <div class="input-group m-b col-lg-12">
                                        <template v-for="(field,index) in fields">
                                            <template v-if="field.display">
                                                <div class="input-group-btn" v-if="field.type =='operator'">
                                                    <button data-toggle="dropdown"
                                                            class="btn btn-default dropdown-toggle">
                                                        {{field.value}}
                                                        <span class="caret"></span></button>
                                                    <ul class="dropdown-menu">
                                                        <li v-for="variant in field.variant">
                                                            <a href="javascript:void(0)"
                                                               v-on:click="updateOperatorValue($event, field,variant.id)">{{variant.name}}</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <template v-if="field.type == 'text'">
                                                    <input type="text" :id="field.id" :placeholder="field.placeholder"
                                                           v-validate="field.validate"
                                                           v-bind:value="field.value"
                                                           v-on:keyup="change(field.name,$event)"
                                                           class="form-control">
                                                </template>
                                                <template v-if="field.type == 'select'">
                                                    <multiselect track-by="id"
                                                                 label="name"
                                                                 :id="field.name"
                                                                 :placeholder="field.placeholder"
                                                                 v-bind:value="field.value"
                                                                 :name="field.name"
                                                                 open-direction="bottom"
                                                                 @input="updateValueAction"
                                                                 :options="field.data">
                                                    </multiselect>
                                                </template>
                                                <template v-if="field.type == 'date'">
                                                    <input type="text" :id="field.id"
                                                           :placeholder="field.placeholder"
                                                           v-bind:value="field.value"
                                                           :name="field.name"
                                                           class="form-control date-range">
                                                </template>
                                            </template>
                                        </template>
                                    </div>
                                </template>
                                <div class="form-group col-lg-12" style="margin-bottom: 5px">
                                    <div class="pull-right">
                                        <button class="btn btn-danger btn-sm"
                                                v-on:click="clearFilters($event)">
                                            <i class="fa fa-trash"></i>
                                            {{'Очистить'|_}}
                                        </button>
                                        <button class="btn btn-primary  btn-sm"
                                                v-on:click="applyFilters($event)" data-style="zoom-in">
                                            <i class="fa fa-check"></i> {{'Применить'|_}}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-12 filters">
            <div class="filters-active">
                <template v-for="(field,index) in $store.getters.getApplyFilters">
            <span class="alert alert-info" v-if="field && field.value && field.type !='operator'">
                <strong>{{field.placeholder}}</strong>
                <a href="javascript:void(0)" class="alert alert-success">
                    {{field.operator.value}}
                </a>
                {{field.value}}
                <a href="javascript:void(0)" v-on:click="clear(field.name,$event)" class="fa fa-times-circle"></a>
            </span>
                    <span class="alert alert-warning" v-if="field && field.value && field.type =='operator'">
                <strong>{{field.value}}</strong>
            </span>
                </template>
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
    import * as moment from 'moment';

    declare let ADMIN_ACCESS: string;
    declare let $: any;

    @Component({
        name: 'Filters',
        components: {}
    })

    export default class Filters extends Vue {
        @Provide()
        item: any = null;

        @Provide()
        counter: any = 0;

        @Provide()
        timeout: any = null;

        @Provide()
        show: boolean = false;

        @Prop({default: null})
        model: any;

        applyFilters($event: Event): void {
            $event.preventDefault();
            this.$store.dispatch('applyFilters');
            this.show = false;
        }

        updateValueAction(value, id) {
            let me = this;
            me.$store.dispatch('setFilterValue', {
                name: id,
                value: value
            })
        }

        mounted(): void {
            let me = this;
            me.$nextTick(function () {
                if ($('.filters').length) {
                    let y = $('.filters').offset().top;
                    $(document).scroll(function () {
                        if (y < $(window).scrollTop()) {
                            me.show = false;
                        }
                    });
                }
            })
        }

        change(name: string, $event ?: Event): void {
            let me = this;
            if (me.timeout) {
                clearTimeout(me.timeout);
            }
            me.timeout = setTimeout(function () {
                me.$store.dispatch('setFilterValue', {
                    name: name,
                    value: $($event.target).val()
                })
            }, 400);

        }

        clear(name: string, $event: Event, reload ?: boolean): void {
            let updateFn = this.$store.getters.getTableUpdate;
            this.$store.dispatch('setFilterValue', {
                name: name,
                value: null
            });
            $event.preventDefault();
            this.$nextTick(function () {
                updateFn();
                $('.selectize').each(function (idx, input) {
                    if (input.selectize && input.name == name) {
                        input.selectize.setValue('')
                    }
                })
            });

        }

        clearFilters($event: Event): void {
            $event.preventDefault();
            this.$store.dispatch('clearFilters');
            this.show = false;
        }

        outside(e) {
            if (this.show) {
                this.show = false;
            }
        }

        getOperatorValue(field: any): string {
            let result: string = '';
            field.variant.filter(function (element) {
                if (field && element.id == field.value) {
                    result = element.name;
                }
            });

            return result;
        }

        showFilters(): void {
            this.show = (this.$store.getters.getFilters.length >= 1);
        }

        updateOperatorValue($event: Event, field: any, value: string): void {
            $event.preventDefault();
            this.$store.dispatch('updateOperator', {
                id: field.id,
                value: value
            })
        }
    }
</script>

<style scoped>

</style>