<template>
  <div>
    <text-form-field
      v-if="checkFieldTypeWithExpression(field,'text-form-field')"
      :id="field.id"
      :name="field.name"
      :field="field.name"
      :label="field.label"
      :mask="field.mask"
      :model="model"
      :scope="(field.scope)?field.scope:null"
      :required="(field.required !== undefined) ? field.required : false"
      :validate="field.validate"
      :form_group="field.form_group"
      :readonly="(field.readonly !== undefined) ? field.readonly : false"
      :css_class="(field.css_class) ? field.css_class : 'col-sm-6'"
      :help_string="(field.help !== undefined) ? field.help : ''"
      :placeholder="(field.placeholder  !== undefined )?field.placeholder:''"></text-form-field>
    <select-form-field
      v-if="checkFieldTypeWithExpression(field,'select-form-field') || checkFieldTypeWithExpression(field,'access-list')"
      :label="field.label"
      :model="model"
      :id="field.id"
      :required="(field.required !== undefined) ? field.required : false"
      :multiple="(field.multiple !== undefined) ? field.multiple : false"
      :validate="field.validate"
      :readonly="(field.readonly !== undefined) ? field.readonly : false"
      :css_class="(field.css_class) ? field.css_class : 'col-sm-6'"
      :form_group="(field.form_group !== undefined) ? field.form_group : true"
      :option_group="(field.option_group !== undefined) ? field.option_group : false"
      :data="field.items"
      :placeholder="(field.placeholder  !== undefined )?field.placeholder:''"
      :field="field.name">
    </select-form-field>
    <date-form-field
      v-if="checkFieldTypeWithExpression(field,'date-form-field')"
      :id="field.id"
      :name="field.name"
      :field="field.name"
      :label="field.label"
      :model="model"
      :css_class="(field.css_class) ? field.css_class : 'col-sm-6'"
      :form_group="field.form_group"
      :required="(field.required !== undefined) ? field.required : false"
      :validate="field.validate"
      :readonly="(field.readonly !== undefined) ? field.readonly : false"
      :placeholder="(field.placeholder  !== undefined )?field.placeholder:''">
    </date-form-field>
    <password-form-field
      v-if="checkFieldTypeWithExpression(field,'password-form-field')"
      :id="field.id"
      :name="field.name"
      :field="field.name"
      :label="field.label"
      :model="model"
      :css_class="(field.css_class) ? field.css_class : 'col-sm-6'"
      :form_group="field.form_group"
      :required="(field.required !== undefined) ? field.required : false"
      :validate="field.validate"
      :readonly="(field.readonly !== undefined) ? field.readonly : false"
      :placeholder="(field.placeholder  !== undefined )?field.placeholder:''">
    </password-form-field>
    <address-form-field
      v-if="checkFieldTypeWithExpression(field,'address-form-field')"
      :id="field.id"
      :name="field.name"
      :field="field.name"
      :label="field.label"
      :token="field.token"
      :model="model"
      :css_class="(field.css_class) ? field.css_class : 'col-sm-6'"
      :form_group="field.form_group"
      :required="(field.required !== undefined) ? field.required : false"
      :validate="field.validate"
      :readonly="(field.readonly !== undefined) ? field.readonly : false"
      :placeholder="(field.placeholder  !== undefined )?field.placeholder:''">
    </address-form-field>
    <text-editor-form-field
      v-if="checkFieldTypeWithExpression(field,'text-editor-form-field')"
      :id="field.id"
      :name="field.name"
      :field="field.name"
      :label="field.label"
      :model="model"
      :required="(field.required !== undefined) ? field.required : false"
      :validate="field.validate"
      :readonly="(field.readonly !== undefined) ? field.readonly : false"
      :placeholder="(field.placeholder  !== undefined )?field.placeholder:''">
    </text-editor-form-field>
    <code-editor-form-field
      v-if="checkFieldTypeWithExpression(field,'code-editor-form-field')"
      :id="field.id"
      :name="field.name"
      :field="field.name"
      :label="(field.label)?field.label:'HTML оформление'"
      :model="model"
      :default_mode="field.default_mode"
      :event="field.event"
      :required="(field.required !== undefined) ? field.required : false"
      :validate="field.validate"
      :form_group="field.form_group"
      :readonly="(field.readonly !== undefined) ? field.readonly : false"
      :css_class="(field.css_class) ? field.css_class : 'col-sm-6'"
      :help_string="(field.help !== undefined) ? field.help : ''"
      :placeholder="(field.placeholder)?field.placeholder:''"></code-editor-form-field>
    <sample-properties-table v-if="checkFieldTypeWithExpression(field,'sample-properties-table')"
                             :item="model" :model_id="field.model_id"
                             :model_class="field.model"></sample-properties-table>
    <media :item="model" v-if="checkFieldTypeWithExpression(field,'media')"></media>
    <text-form-alias
      v-if="checkFieldTypeWithExpression(field,'text-form-alias')"
      :item="model"
      :required="(field.required !== undefined) ? field.required : false"
      :validate="field.validate"
      :label="field.label"
      :placeholder="(field.placeholder  !== undefined )?field.placeholder:''"
      :form_group="field.form_group"
      :css_class="(field.css_class) ? field.css_class : 'col-sm-6'">
    </text-form-alias>
    <seo :item="model" v-if="checkFieldTypeWithExpression(field,'seo')"></seo>
    <TabFormField :field="field" :model="model" v-if="checkFieldTypeWithExpression(field,'tabs')"></TabFormField>
    <search-form-field
      v-if="checkFieldTypeWithExpression(field,'search-form-field')"
      :id="field.id"
      :label="field.label"
      :model="model"
      :scope="(field.scope)?field.scope:null"
      :required="(field.required !== undefined) ? field.required : false"
      :validate="field.validate"
      :readonly="(field.readonly !== undefined) ? field.readonly : false"
      :data_url="field.data_url"
      :css_class="(field.css_class) ? field.css_class : 'col-sm-6'"
      :form_group="(field.form_group !== undefined) ? field.form_group : true"
      :placeholder="(field.placeholder  !== undefined )?field.placeholder:''"
      :title="(field.title  !== undefined ) ? field.title:''"
      :set_filter="(field.filter  !== undefined ) ? field.filter:[]"
      :field="field.name"></search-form-field>
  </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import {FdTranslator} from '@/FdTranslator';
    import {Util} from '@/Util';
    import TextFormField from '@/components/form/fields/TextFormField.vue';
    import SelectFormField from '@/components/form/fields/SelectFormField.vue';
    import DateFormField from '@/components/form/fields/DateFormField.vue';
    import PasswordFormField from '@/components/form/fields/PasswordFormField.vue';
    import AddressFormField from '@/components/form/fields/AddressFormField.vue';
    import TextEditorFormField from '@/components/form/fields/TextEditorFormField.vue';
    import CodeEditorFormField from '@/components/form/fields/CodeEditorFormField.vue';
    import SamplePropertyTable from '@/components/form/components/SamplePropertyTable.vue';
    import MediaItems from '@/components/form/components/MediaItems.vue';
    import TextAliasFormField from '@/components/form/fields/TextAliasFormField.vue';
    import Seo from '@/components/form/components/Seo.vue';
    import MediaFormField from '@/components/form/fields/MediaFormField.vue';
    import TabFormField from '@/components/form/fields/TabFormField.vue';
    import SearchFormField from "@/components/form/fields/SearchFormField.vue";

    declare let $: any;

    @Component({
        name: 'FormFields',
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        },
        components: {
            'address-form-field': AddressFormField,
            'text-form-field': TextFormField,
            'text-form-alias': TextAliasFormField,
            'select-form-field': SelectFormField,
            'code-editor-form-field': CodeEditorFormField,
            'search-form-field': SearchFormField,
            'media-form-field': MediaFormField,
            'text-editor-form-field': TextEditorFormField,
            'date-form-field': DateFormField,
            'media': MediaItems,
            'seo': Seo,
            'sample-properties-table': SamplePropertyTable,
            // 'catalog-item-properties': CatalogItemProperties,
            // 'catalog-category-properties': CatalogCategoryProperties,
            // 'catalog-item-store-parameters': CatalogItemStoreParameters,
            'password-form-field': PasswordFormField,
            // 'translate-items': TranslateItems,
            // 'clock-field': ClockFormField,
            // 'calendar-times': CalendarTimesComponent,
            'TabFormField': TabFormField,

        }
    })

    export default class FormFields extends Vue {

        @Prop({default: 'FormFields'})
        name: string = 'FormFields';

        @Prop({default: null})
        field: any;

        @Provide()
        item: any = null;

        @Prop({default: null})
        model: any;

        @Watch('model')
        onChangeModel(model) {
            if (model !== null) {
                this.$set(this, 'item', model);
            }
        }

        expression(code: string): any {
            let me = this,
                result = eval('(result = ' + code + ')');

            if (result !== undefined && me.item !== null) {
                return result(me.item);
            }
            return false;
        }

        checkFieldTypeWithExpression(field: any, type: string): boolean {
            let result = false;
            if (field) {
                if (field.type == type && !field.expression) {
                    result = true;
                } else if (field.expression && (this.expression(field.expression) && field.type == type)) {
                    result = true;
                }
            }

            return result;
        }

        mounted(): void {
            Util.initScrollTab();
            if (this.item == null) {
                this.item = this.model;
            }
        }

    }
</script>

<style scoped>

</style>
