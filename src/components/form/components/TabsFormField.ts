import Vue from 'vue';
import {Component, Prop, Provide} from 'vue-property-decorator';
import {TextFormField} from '../fields/TextFormField';
import {MediaItems} from './MediaItems';
import {TextEditorFormField} from '../fields/TextEditorFormField';
import  moment from 'moment';
import {SelectFormField} from '../fields/SelectFormField';
import {FdTranslator} from '@/FdTranslator';


declare let $: any;

@Component({
    name: 'tabs-form-field',
    template: require('./views/tabs-editor.html'),
    components: {
        // 'presentation': Presentation,
        'text-form-field': TextFormField,
        'media': MediaItems,
        'text-editor-form-field': TextEditorFormField,
        'select-form-field': SelectFormField,
    },
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})

export class TabsFormField extends Vue {

    @Provide()
    tourSteps: any = null;

    @Prop({default: null})
    item: any;

    @Prop({default: true})
    presentation: boolean;

    @Provide()
    set_item: any = null;

    @Provide()
    tabs: any = null;

    @Provide()
    active_tab: any = null;

    @Provide()
    gallery_mode: any = [];

    @Provide()
    default_mode: any = [];

    mounted(): void {
        let me = this, id = moment().millisecond().toString();
        me.default_mode = {id: 0, name: 'Тип 1 (справа в два столбца)'};
        me.$set(me, 'set_item', (me.item) ? me.item : {data: {media: {}}});
        me.$set(me, 'gallery_mode', [
            me.default_mode,
            {id: 1, name: 'Тип 2 (справа в один столбец)'},
            {id: 2, name: 'Тип 3 (сверху)'},
            {id: 3, name: 'Тип 4 (снизу)'},
        ]);


        if (me.item.data.tabs) {
            me.$set(me, 'active_tab', me.item.data.tabs[0].id);

            me.item.data.tabs.map(function (element) {
                if (element.gallery_mode == undefined) {
                    element.gallery_mode = me.default_mode;
                }
            });

            me.$set(me, 'tabs', me.item.data.tabs);
        } else {
            me.$set(me, 'active_tab', id);
            me.$set(me, 'tabs', [{
                id: id, content: '', gallery_mode: me.default_mode, name: FdTranslator._('Без названия'),
                media: [{id: 0, type: 'file', value: '', data: {hash: ''}}], show: true
            }]);
        }

        me.item.data.tabs = this.tabs;

        me.$nextTick(function () {
        });
    }

    isActiveTab(tab): boolean {

        return tab.id == this.active_tab;
    }

    addTab($event: Event): void {
        let me = this, id = moment().millisecond().toString();
        me.$set(me, 'active_tab', id);
        me.tabs.push({
            id: id, content: '', gallery_mode: me.default_mode, name: FdTranslator._('Без названия'),
            media: [{id: 0, type: 'file', value: '', data: {hash: ''}}], show: true
        });
        me.item.data.tabs = me.tabs;
        $event.preventDefault();
    }

    removeTab($event: Event, tab): void {
        let me = this, tmp = [];
        $event.preventDefault();
        me.tabs.map(function (element) {
            if (element.id == tab.id) {
                element.show = false;
            } else {
                if (element.show == true) {
                    tmp.push(element);
                }
            }
        });
        $('.tooltip ').remove();

        if (tmp.length == 0) {
            me.addTab($event)
        } else {
            me.tabs = tmp;
            me.item.data.tabs = me.tabs;
        }
    }
}