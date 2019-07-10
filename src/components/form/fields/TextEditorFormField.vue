<template>
    <div :class="(form_group)?'form-group':''">
        <div :class="css_class">
            <label class="control-label">{{label|_}}
                <strong class="text-danger text-bold" v-if="required">*</strong>
            </label>
            <textarea :id="set_id" v-model="set_model"></textarea>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import {FdTranslator} from '@/FdTranslator';
    import {Util} from '@/Util';
    import {FormField} from '@/components/form/fields/FormField';
    import moment from 'moment' ;


    declare let CKEDITOR: any;

    @Component({
        name: 'TextEditorFormField',
        components: {},
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        }
    })

    export default class TextEditorFormField extends FormField {

        mounted(): void {
            let me = this;
            me.$set(me, 'set_model', (me.field != '') ? me.model[me.field] : me.model);

            me.$set(me, 'set_id', me.id + '_' + moment().milliseconds().toString());

            me.$nextTick(function () {

                if (!CKEDITOR.instances[me.set_id]) {
                    let e = CKEDITOR.replace(me.set_id, {
                       // stylesSet:  me.$store.getters.getCkeditorConfig,
                        extraPlugins: 'youtube,justify,autoembed,div,codemirror,templates,bootstrapTabs',
                        div_wrapTable: true,
                        height: me.height,
                       // templates_files: [Util.httpRoot + 'public/content/ck-templates.js']
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
</script>

<style scoped>

</style>