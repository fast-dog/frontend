import Vue from 'vue';
import {Component, Prop, Provide} from 'vue-property-decorator';
import {FdTranslator} from '@/FdTranslator';
import {Util} from '@/Util';



declare let $: any;

@Component({
    name: 'translate-items',
    template: require('./views/translate-items.html'),
    components: {},
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})

export class TranslateItems extends Vue {

    @Prop({default: null})
    item: any;

    @Provide()
    set_model: any = null;

    mounted(): void {
        let me = this;
        me.$set(me, 'set_model', (me.item) ? me.item : {data: {media: {}}});
    }


    saveTranslate($event: Event): void {
        let me = this;
        console.log(me.set_model);
        Util.sendData({
            url: 'menu/api/translate',
            data: {
                translate: me.set_model.translate,
                template: me.set_model.template
            },
            event: $event,
            callback: function (response) {
                console.log(response);
            }
        }, me)
    }


    reloadTranslate($event: Event): void {
        let me = this;
        Util.sendData({
            url: 'public/menu-reload-translate',
            data: {
                // template: me.$get('item.data.template')
            },
            event: $event,
            callback: function (response) {
                if (response.body.success) {
                    //  me.$set('translate', response.body.items);
                }
            }
        }, me)
    }
}