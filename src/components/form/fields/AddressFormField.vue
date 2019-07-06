<template>
    <div :class="{'has-error': errors.has(name), 'form-group':(form_group)}">
        <div :class="css_class">
            <label class="control-label">{{label|_}}
                <strong class="text-danger text-bold" v-if="required">*</strong>
            </label>
            <VueSuggestions
                    v-if="suggestionOptions"
                    :model.sync="set_model"
                    :coordinates.sync="coordinates"
                    :placeholder="'Начните вводить'"
                    :class="'form-control'"
                    :onSelect="onSelect"
                    v-on:change="onSelect"
                    :options="suggestionOptions">
            </VueSuggestions>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Watch} from 'vue-property-decorator'
    import {FormField} from '@/components/form/fields/FormField';
    import VueSuggestions from 'vue-suggestions/vue-suggestions.vue';
    import {FdTranslator} from '@/FdTranslator';

    declare let $: any;

    @Component({
        name: 'address-form-field',
        components: {
            'VueSuggestions': VueSuggestions
        },
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        }
    })

    export default class AddressFormField extends FormField {

        @Prop({default: ''})
        token: string;

        @Provide()
        suggestionOptions: any = null;

        @Provide()
        coordinates: any = null;

        @Watch('set_model')
        onChangeSetModel(value) {
            let me = this;
            me.$store.dispatch('updatedFieldModel', {
                model: me.model,
                field: me.field,
                value: value
            })
        }

        @Watch('coordinates')
        onChangeCoordinates(value) {
            let me = this;
        }

        onSelect(suggestion) {

        }

        mounted(): void {
            let me = this;

            if (me.field != '' && me.model) {
                me.$set(me, 'set_model', me.model[me.field]);
            } else {
                me.$set(me, 'set_model', me.model);
            }

            me.$set(me, 'suggestionOptions', {
                token: me.token,
                type: 'ADDRESS',
                scrollOnFocus: false,
                triggerSelectOnBlur: false,
                triggerSelectOnEnter: false,
                addon: 'none',
                onSelect(suggestion) {
                }
            })


        }
    }
</script>

<style scoped>

</style>