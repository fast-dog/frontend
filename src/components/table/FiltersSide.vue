<template>
    <div class="filters-component">
        <div v-if="$store.getters.getFilters.length > 0">
            <h2 class="text-center"> </h2>
            <div>
                <div class="x_content">
                    <form class="form-horizontal">
                        <template v-for="fields in $store.getters.getFilters">
                            <template v-for="(field,index) in fields">
                                <template v-if="field.display">
                                    <div class="input-group-btn" style="display: none" v-if="field.type =='operator'">
                                        <button data-toggle="dropdown" class="btn btn-default dropdown-toggle">
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
                                        <div class="form-group">
                                            <label>{{field.placeholder}}</label>
                                            <input type="text" :id="field.id" :placeholder="field.placeholder"
                                                   v-validate="field.validate"
                                                   v-bind:value="field.value"
                                                   v-on:keyup="change(field.name,$event)"
                                                   class="form-control">
                                        </div>
                                    </template>
                                    <template v-if="field.type == 'select'">
                                        <div class="form-group">
                                            <label>{{field.placeholder}}</label>
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
                                        </div>
                                    </template>
                                    <template v-if="field.type == 'date'">
                                        <div class="form-group">
                                            <label>{{field.placeholder}}</label>
                                            <input type="text" :id="field.id"
                                                   :placeholder="field.placeholder"
                                                   v-bind:value="field.value"
                                                   :name="field.name"
                                                   autocomplete="off"
                                                   class="form-control date-range">
                                        </div>
                                    </template>
                                </template>
                            </template>
                        </template>
                        <div class="form-group" style="text-align: center">
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
                    </form>
                </div>
            </div>
        </div>
        <div class="col-lg-12 filters" style="display: none;">
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
    import SelectFormField from '@/components/form/fields/SelectFormField.vue';
    import moment from 'moment';

    require('daterangepicker');

    declare let $: any;

    @Component({
        name: 'FiltersSide',
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

    export default class FiltersSide extends Vue {

        @Provide()
        timeout: any = null;

        applyFilters($event: Event): void {
            $event.preventDefault();
            this.$store.dispatch('applyFilters');
        }

        updateValueAction(value, id) {
            let me = this;
            console.log(id, value);
            me.$store.dispatch('setFilterValue', {
                name: id,
                value: value
            })
        }

        mounted(): void {
            let me = this;
            me.$nextTick(function () {
                $('.dropdown-toggle').dropdown();
                $('.date-range').each(function (idx, input) {
                    $(input).daterangepicker({
                        autoApply: true,
                        // parentEl: '.filters-component',
                        locale: {
                            format: 'DD.MM.YYYY',
                            applyLabel: 'Выбрать',
                            cancelLabel: 'Очистить',
                            fromLabel: 'с',
                            toLabel: 'по',
                            daysOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                            monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                            firstDay: 1
                        },
                        alwaysShowCalendars: true,
                        showCustomRangeLabel: false,
                        opens: 'center',
                        ranges: {
                            'Сегодня': [moment(), moment()],
                            'Вчера': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                            'За 7 дней': [moment().subtract(6, 'days'), moment()],
                            'За 30 дней': [moment().subtract(29, 'days'), moment()],
                            'Текущйи месяц': [moment().startOf('month'), moment().endOf('month')],
                            'Прошлый месяц': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                        }
                    }).on('apply.daterangepicker', function (ev, picker) {
                        ev.preventDefault();
                        me.$store.dispatch('setFilterValue', {
                            name: input.name,
                            value: [
                                picker.startDate.format('YYYY-MM-DD'),
                                picker.endDate.format('YYYY-MM-DD')
                            ]
                        })
                    });
                });
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


        updateOperatorValue($event: Event, field: any, value: string): void {
            $event.preventDefault();
            this.$store.dispatch('updateOperator', {
                id: field.id,
                value: value
            })
        }

        beforeDestroy(): void {
            $('.daterangepicker').remove();
        }
    }
</script>

<style scoped>

</style>
