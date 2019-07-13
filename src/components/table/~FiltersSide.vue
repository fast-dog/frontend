<template>
    <div v-if="$store.getters.getFilters.length > 0">
        <h2 class="text-center">Поиск</h2>
        <template v-for="(filters,index) in $store.getters.getFilters">
            <div v-for="(filter, idx) in filters">
                <template v-if="filter.type !== 'operator'">
                    <!--  -->
                    <form action="" id="filters">
                        <div class="form-group">
                            <div>
                                <label class="control-label">
                                    {{filter.placeholder}}
                                </label>
                                <input type="text" v-if="filter.type === 'text'"
                                       :name="filter.name"
                                       :id="filter.name"
                                       v-on:change="updateValueActionText($event)"
                                       class="form-control" :value="filter.value">
                                <input type="text" v-if="filter.type === 'date'"
                                       :name="filter.name"
                                       :id="filter.name"
                                       v-on:change="updateValueActionText($event)"
                                       class="form-control" :value="filter.value">
                                <select :name="filter.name" class="form-control" v-if="filter.type === 'select'"
                                        :id="filter.name"
                                        v-on:change="updateValueAction($event)">
                                    <option value="">---------</option>
                                    <option v-for="value in filter.data"
                                            v-html="value.name"
                                            :value="value.id"></option>
                                </select>
                            </div>
                        </div>

                    </form>
                </template>
            </div>
        </template>
        <div class="form-group" style="text-align: center;">
            <button class="btn btn-danger btn-sm" v-on:click.prevent="clearFilters">
                <i class="fa fa-trash"></i> {{'Очистить'|_}}
            </button>
            <button data-style="zoom-in" v-on:click.prevent="applyFilters"
                    class="btn btn-primary  btn-sm">
                <i class="fa fa-check"></i> {{'Применить'|_}}
            </button>
        </div>
    </div>
</template>

<script lang="ts">

    import Vue from 'vue';
    import {FdTranslator} from '@/FdTranslator';
    import Component from 'vue-class-component';
    import {Prop, Provide, Watch} from 'vue-property-decorator';
    import SelectFormField from '@/components/form/fields/SelectFormField.vue';

    declare let $: any;

    @Component({
        name: 'FiltersSide',
        components: {
            'select-form-field': SelectFormField,
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

    export default class FiltersSide extends Vue {

        clearFilters(): void {
            this.$store.dispatch('clearFilters');
            $('form#filters')[0].reset();
        }

        applyFilters($event: Event): void {
            this.$store.dispatch('applyFilters');
        }

        updateValueAction($event) {
            let me = this;
            me.$store.dispatch('setFilterValue', {
                name: $event.target.id,
                value: {
                    id: $event.target.value
                }
            });
        }

        updateValueActionText($event) {
            let me = this;
            me.$store.dispatch('setFilterValue', {
                name: $event.target.id,
                value: $event.target.value
            });
        }
    }
</script>

<style scoped>

</style>