<template>
  <div :class="{'has-error': errors.has(name), 'has-error': errors.has(scope+'.'+name), 'form-group':(form_group)}">
    <div :class="css_class" v-if="set_model">
      <label class="control-label">{{label|_}}
        <strong class="text-danger text-bold" v-if="required">*</strong>
      </label>
      <div style="position: relative">
        <input type="text"
               :id="set_id" :placeholder="placeholder"
               :readonly="readonly !== ''"
               v-model="set_model.value" class="form-control">
        <search-table :callback="{fn:callback}"
                      :title="title"
                      :filter="filter"
                      :data_url="data_url"></search-table>
      </div>
      <span class="help-block m-b-none" v-if="help_string !== ''">
            <i class="fa fa-exclamation"></i>
            {{help_string|_}}
        </span>
    </div>
  </div>

</template>

<script lang="ts">

    import {Component, Prop, Provide, Watch} from 'vue-property-decorator'
    import {FormField} from '@/components/form/fields/FormField';
    import {FdTranslator} from '@/FdTranslator';
    import SearchTable from "../components/SearchTable.vue";
    import moment from 'moment';
    import {CrudService} from "@/services/CrudService";
    import {Util} from "@/Util";

    require('bootstrap-3-typeahead/bootstrap3-typeahead');

    declare let $: any;

    @Component({
        name: 'SearchFormField',
        components: {
            'search-table': SearchTable
        },
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        }
    })

    export default class SearchFormField extends FormField {

        @Prop({default: null})
        data_url: string;

        @Prop({default: ''})
        title: string;

        @Provide()
        set_filter: any = null;

        @Provide()
        set_model: any = [];

        @Provide()
        filter: any = null;

        @Prop({default: false})
        use_filter: boolean;

        @Watch('set_model')
        onChangeSetModel(n, o) {
        }

        @Watch('filter')
        onChangeFilter(n, o) {
            let me = this;
            if (n != o && o != undefined) {
                me.$set(me, 'set_model', {
                    id: 0,
                    value: ''
                });
            }
        }

        mounted(): void {
            let me = this;

            if (me.field != '' && me.model && me.model[me.field] != undefined) {
                if (me.model[me.field] == '') {
                    me.model[me.field] = {id: 0, value: ''};
                }
                me.$set(me, 'set_model', me.model[me.field]);
            } else {
                 me.$set(me, 'set_model', me.model);
            }

            me.$set(me, 'set_id', me.id + '_' + moment().milliseconds().toString());
            me.$set(me, 'filter', me.set_filter);

            me.$nextTick(function () {
                me.initAutoComplete()
            });

            me.$store.dispatch('setFormItem', {
                id: me.id,
                instance: function () {
                    return me;
                }
            })
        }

        initAutoComplete(): void {
            let me = this;

            $('#' + me.set_id).typeahead({
                minLength: 3,
                source: function (query, process) {
                    CrudService.post(Util.httpRoot + me.data_url, {
                        filter: me.filter,
                        query: query
                    }).then((response: any) => {
                        process(response.data.items);
                    }, (response) => {
                        Util.errorHandler(response);
                    });
                },
                updater: function (element) {
                    me.$set(me.model, me.field, {
                        id: element.id,
                        value: element.name
                    });
                    return element.name;
                },
                autoSelect: true
            });
        }

        callback(item: any): void {
            let me = this;
            me.$set(me.model, me.field, {
                id: item.id,
                value: item.name
            });
            me.$set(me, 'set_model', {
                id: item.id,
                value: item.name
            });

            me.$store.commit('updateField', {
                model: me.model,
                field: me.field,
                value: {
                    id: item.id,
                    value: item.name
                }
            });
        }

        showSearch(): void {
            $('#search_modal').modal('show')
        }
    }
</script>

<style scoped>

</style>
