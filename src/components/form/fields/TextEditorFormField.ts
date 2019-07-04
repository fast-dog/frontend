import {Component, Watch} from 'vue-property-decorator';
import moment from 'moment';
import {FormField} from './FormField';
import {FdTranslator} from '@/FdTranslator';
import {Util} from '@/Util';


declare let $: any;
declare let parameters: any;
declare let CKEDITOR: any;

@Component({
    name: 'text-editor-form-field',
    template: require('./views/text-editor-form-field.html'),
    components: {},
    filters: {
        _: function (value) {
            return FdTranslator._(value);
        }
    }
})
export class TextEditorFormField extends FormField {

    @Watch('set_model')
    onChangeSetModel(nv, ov) {

    }

    mounted(): void {
        let me = this;
        if (me.field != '') {
            me.$set(me, 'set_model', me.model[me.field]);
        } else {
            me.$set(me, 'set_model', me.model);
        }

        me.$set(me, 'set_id', me.id + '_' + moment().milliseconds().toString());

        me.$nextTick(function () {
            console.log(!CKEDITOR.instances[me.set_id])
            if (!CKEDITOR.instances[me.set_id]) {
                let e = CKEDITOR.replace(me.set_id, {
                    stylesSet: me.$store.getters.getCkeditorConfig,
                    extraPlugins: 'youtube,justify,autoembed,div,codemirror,templates,bootstrapTabs',
                    div_wrapTable: true,
                    height: me.height,
                    templates_files: [Util.httpRoot + 'public/content/ck-templates.js']
                });

                CKEDITOR.instances[me.set_id].on('change', function () {
                    me.$set(me.model, me.field, CKEDITOR.instances[me.set_id].getData());
                });
            }
        })
    }

    beforeDestroy(): void {
        let me = this;
        CKEDITOR.instances[me.set_id].destroy(true);
    }
}