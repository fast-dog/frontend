import {Component, Prop, Provide, Watch} from 'vue-property-decorator';
import * as moment from 'moment';
import Vue from 'vue';
import {FdTranslator} from '@/FdTranslator';
import {CrudService} from '@/services/CrudService';
import {Util} from '@/Util';

declare let $: any;
declare let parameters: any;


@Component({
    name: 'data-source-form-field',
    template: require('./views/data-source-form-field.html'),
    components: {},
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})
export class DataSourceSelectField extends Vue {

    @Prop({default: null})
    property: any;

    @Provide()
    isLoading: boolean = false;

    @Prop({default: false})
    is_calculate: boolean;

    mounted(): void {
        let me = this;
        console.log(me.property.default_value)
    }


    public asyncFind(query): void {
        let me = this;
        if (query.length >= 2) {
            this.isLoading = true;
            CrudService.get(Util.httpRoot + 'data-source/value-list?id=' +
                parseInt(me.property.value.id) + '&property_id=' +
                me.property.id +
                '&filter[id]=' + me.property.data.default_value.id +
                '&query=' + query, {}).then((response: any) => {
                if (response.data.success) {
                    if (response.data.items.length > 0) {
                        let tmp = [];

                        response.data.items.forEach(function (element) {
                            tmp.push({
                                id: element.id,
                                name: element.name,
                                property_id: me.property.id
                            })
                        });
                        me.$store.commit('updateField', {
                            model: me.property,
                            value: tmp,
                            field: 'default_value'
                        });
                        // me.property.default_value = tmp;
                    }
                }
                this.isLoading = false;
            }, (response) => {
                this.isLoading = false;
                Util.errorHandler(response);
            });
        } else {
            this.isLoading = false;
        }
    }

    updatedSelectModel(payload): void {
        if (payload) {
            let me = this;
            if (me.property.multiple && payload.length > 0) {
                me.$store.dispatch('setItemPropertyValue', {
                    item: {
                        id: payload[0].property_id,
                        is_calculate: me.is_calculate,
                        remove: false
                    },
                    value: payload
                });
            } else {
            this.$store.dispatch('setItemPropertyValue', {
                item: {
                    id: payload.property_id,
                    is_calculate: me.is_calculate
                },
                value: payload.id
            });
        }

        }
    }

    removedSelectModel(payload): void {
        if (payload) {
            let me = this;

            this.$store.dispatch('setItemPropertyValue', {
                item: {
                    id: payload.property_id,
                    is_calculate: me.is_calculate,
                    remove: true
                },
                value: null
            });
        }
    }
}