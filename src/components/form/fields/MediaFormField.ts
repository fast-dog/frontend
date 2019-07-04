import {Component, Watch} from 'vue-property-decorator';
import {FormField} from './FormField';
import {FdTranslator} from '@/FdTranslator';
import {Util} from '@/Util';



declare let $: any;
declare let parameters: any;


@Component({
    name: 'media-form-field',
    template: require('./views/media-form-field.html'),
    components: {},
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})
export class MediaFormField extends FormField {

    @Watch('set_model')
    onChangeSetModel(nv, ov) {
        let me = this;
        if (me.field != '') {
            me.$set(me.model, me.field, nv);
        }
    }

    mounted(): void {
        let me = this;
        if (me.field != '') {
            me.$set(me, 'set_model', me.model[me.field]);
        } else {
            me.$set(me, 'set_model', me.model);
        }
    }

    openFinder(name: string, params: string): void {
        let me = this;
        Util.openElFinder({
            name: name,
            params: params,
            callback: function (selectedFile) {
                if (selectedFile) {
                    me.$set(me, 'set_model', selectedFile.url.toString().replace(window.location.protocol + '//' + window.location.hostname, ''));
                }
            }
        })
    }
}