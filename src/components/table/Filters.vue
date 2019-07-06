<template>
    <div class="filters-component">
        <div class="col-sm-12 col-lg-4 col-md-4" style="padding-left: 0 !important;">
            <div class="input-group filters" v-if="$store.getters.getFilters.length > 0">
                <input type="text" v-bind:placeholder="'Поиск'|_"
                       v-bind:value="$store.getters.getFilters[0][0].value"
                       v-on:keyup.enter="applyFilters($event); apply = true;"
                       v-on:keyup="change($store.getters.getFilters[0][0].name,$event)"
                       class="form-control">
                <span class="input-group-btn">
                    <button type="button" class="btn btn-default"
                            :class="{'btn-success':$store.getters.getApplyFilters.length > 0 && apply === true,
                            'btn-default':$store.getters.getApplyFilters.length===0 && apply === false}"
                            v-on:click="applyFilters($event)" data-style="zoom-in">
                        <i class="fa fa-check"></i>
                    </button>
                </span>
            </div>
        </div>
        <div class="col-lg-12 col-sm-12 filters">
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
    import Component from 'vue-class-component';
    import {Prop, Provide, Watch} from 'vue-property-decorator';

    declare let $: any;

    @Component({
        name: 'Filters',
        components: {},
        filters: {
            'json': function (value) {
                return JSON.stringify(value, null, 2)
            },
            _: function (value) {
                return FdTranslator._(value);
            }
        }
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

        @Provide()
        apply: boolean = false;

        @Prop({default: null})
        model: any;

        applyFilters($event: Event): void {
            $event.preventDefault();
            this.$store.dispatch('applyFilters');
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

            })
        }

        change(name: string, $event ?: Event): void {
            let me = this;
            if (me.timeout) {
                clearTimeout(me.timeout);
            }
            me.timeout = setTimeout(function () {
                let value = $($event.target).val();
                if (value !== '') {
                    me.$store.dispatch('setFilterValue', {
                        name: name,
                        value: value
                    })
                }
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
            });
        }

        clearFilters($event: Event): void {
            $event.preventDefault();
            this.$store.dispatch('clearFilters');
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

<style scoped lang="scss">
    .filters-component {
        .filters {
            position: relative;
            padding-left: 0 !important;

            .filter-box {
                position: absolute;
                top: 100%;
                z-index: 2500;
                left: 0;
            }
        }

        .filters-active {
            // white-space: nowrap;
            padding-top: 5px;
            line-height: 20px;
        }

        .alert {
            font-size: 11px;
            padding: 3px;
            margin: 0 !important;
            border-radius: 0 !important;
        }

        .alert-info {
            position: relative;
            white-space: nowrap;

            .fa-times-circle {
                position: absolute;
                top: -5px;
                color: #ED5565;
                display: none;
            }
        }

        .operator {
            cursor: pointer;
        }
    }
</style>