import Component from 'vue-class-component';
import {TextAliasFormField} from '../fields/TextAliasFormField';
import {CatalogItemProperties} from './CatalogItemProperties';
import {MediaItems} from './MediaItems';
import Vue from 'vue';
import {Prop, Provide} from 'vue-property-decorator';
import {TextFormField} from '../fields/TextFormField';
import {FdTranslator} from '@/FdTranslator';
import {Util} from '@/Util';

declare let $: any;

@Component({
    name: 'catalog-item-store-parameters',
    template: require('./views/catalog-item-store-parameters.html'),
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    },
    components: {
        'alias': TextAliasFormField,
        'properties-form-value': CatalogItemProperties,
        'media': MediaItems,
        'text-form-field': TextFormField,
        'text-form-alias': TextAliasFormField,
    }
})

export class CatalogItemStoreParameters extends Vue {

    @Prop({default: null})
    item: any;

    @Provide()
    openItem: any = null;

    @Provide()
    offer: any = null;

    @Provide()
    setProperties: [any] = null;

    mounted(): void {
        let me = this;
        me.$set(me, 'openItem', me.item);
        me.$set(me, 'offer', me.openItem);
        me.$nextTick(function () {
            $('#addOfferModal').on('show.bs.modal', function () {
            }).on('hide.bs.modal', function () {
            });
            $('a[data-action="select-store"]').on('shown.bs.tab', function (e) {
                Util.setLocalVar('open-store-tab', $(e.target).data('id'));
            })
        })
    }

    beforeDestroy(): void {
        $('#addOfferModal').unbind('show.bs.modal').unbind('hide.bs.modal');
    }

    addDocument(store: any) {
        let me = this;
        me.$set(me, 'item.store', store);
        Util.addDocument('add-item-availability', me.item);
    }

    getActiveStore(index: any): boolean {

        let me = this,
            def = (this.item.stores.length > 0) ? this.item.stores[0].id : 1;

        return index == Util.getLocalVar('open-store-tab', def);
    }

    paginate(page: number, store: any) {
        Util.sendData({
            url: 'catalog/api/documents',
            data: {
                page: page,
                filters: {
                    store_id: store.id,
                    item_id: this.item.id
                }
            },
            callback: function (response) {
                if (response.body.success) {
                    store.documents.items = response.body.items;
                    store.documents.current_page = response.body.current_page;
                }
            }
        }, this)
    }

    addOffer(): void {
        let me = this;
        $('#addOfferModal').modal('show');
    }

    help(help_name: string): void {
        Util.help(help_name, this)
    }

    saveOffer($event: Event): void {
        let me = this;


        Util.sendData({
            url: 'catalog/item-offer',
            data: {
                id: 0,
                item: me.offer,
                name: me.offer.name,
                category_id: me.offer.category_id,
                parent_id: me.item.id,
                price: me.offer.price,
                set_properties: me.$store.getters.getItemPropertiesOffer
            },
            event: $event,
            callback: function (response) {
                if (response.data.success) {
                    me.$store.dispatch('updatedFieldModel', {
                        model: me.item,
                        field: 'offers',
                        value: response.data.items
                    });
                    // me.$set(me, 'item.offers', response.body.items);
                    $('#addOfferModal').modal('hide');
                }
            }
        }, me)
    }
}