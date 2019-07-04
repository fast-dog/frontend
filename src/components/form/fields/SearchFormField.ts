import {Component, Prop, Provide, Watch} from 'vue-property-decorator';
import  moment from 'moment';
import {TextFormField} from './TextFormField';
import {FdTranslator} from '@/FdTranslator';
import {CrudService} from '@/services/CrudService';
import {Util} from '@/Util';


declare let $: any;
declare let parameters: any;


@Component({
    name: 'search-form-field',
    template: require('./views/search-form-field.html'),
    components: {
        // 'search-table': SearchTableBase
    },
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})

export class SearchFormField extends TextFormField {

    @Prop({default: null})
    data_url: string;

    @Prop({default: ''})
    title: string;

    @Prop({default: {}})
    set_filter: any;

    @Provide()
    filter: any = null;

    @Prop({default: false})
    use_filter: boolean;

    @Watch('set_model')
    onChangeSetModel(nv, ov) {
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