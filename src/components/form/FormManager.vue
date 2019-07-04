<template>
    
</template>

<script lang="ts">

    import Vue from 'vue';
    import {Component, Prop, Provide, Watch} from 'vue-property-decorator';
    import {Util} from '@/Util';
    import {FdTranslator} from '@/FdTranslator';

    declare let $: any;

    @Component({
        name: 'form-manager',
        template: require('./views/form-manager.html'),
        filters: {
            _: function (value) {
                return FdTranslator._(value);
            }
        },
        components: {
            // 'loader': Loader,
            // 'form-fields': FormFields,
            // 'crud-table': TableBase
        }
    })

    export class FormManager extends Vue {

        @Provide()
        form: {
            name: string,
            help: false,
            content: {
                buttons: [any],
                tabs: [{
                    general: {
                        id: '',
                        name: '',
                        fields: [any],
                        side: [any]
                    }
                }]
            }
        } = null;

        @Provide()
        item: any = null;

        @Provide()
        openTab: any = null;

        @Prop({default: null})
        model: any;

        @Watch('model')
        onChangeModel(model) {
            if (model !== null) {
                this.$set(this, 'item', model);
            }
        }

        mounted(): void {

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
            if (field.type == type && !field.expression) {
                result = true;
            } else if (field.expression && (this.expression(field.expression) && field.type == type)) {
                result = true;
            }
            return result;
        }

        public getModel(field: any, item: any): any {
            if (field.model) {
                return item[field.model];
            }
            return item;
        }

        helpStatic(name: string): void {
            Util.help(name, this)
        }

        getActiveTab(id: string, def: boolean): boolean {
            this.openTab = Util.getLocalVar('open-tab', null);
            // console.log(this.openTab, this.openTab != 'null');
            if (this.openTab != null && this.openTab != 'null') {
                return (id == this.openTab);
            } else {

                return def;
            }

        }

        checkTabExpression(tab: any): boolean {
            if (tab.expression !== undefined) {
                return this.expression(tab.expression);
            }
            return true;
        }


    }
</script>

<style scoped>

</style>