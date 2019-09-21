<template>
    <div v-if="$store.getters.getSplashScreen === false">
        <preview></preview>
        <div class="col-md-4 col-sm-4 col-xs-12">
            <div class="x_panel tile">
                <div class="x_title">
                    <h2>Ресурсы</h2>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <!-- start accordion -->
                    <div class="accordion" id="accordion" role="tablist" aria-multiselectable="true">
                        <div class="panel"
                             v-for="(item, name, idx) in resource">
                            <a class="panel-heading" role="tab" id="headingOne"
                               data-toggle="collapse" data-parent="#accordion"
                               :href="'#'+item.id"
                               aria-expanded="true" aria-controls="collapseOne">
                                <h4 class="panel-title">
                                    {{item.name}}
                                </h4>
                            </a>
                            <div :id="item.id"
                                 :class="{'in':(idx === 0)}"
                                 class="panel-collapse collapse"
                                 role="tabpanel" aria-labelledby="headingOne">
                                <div class="panel-body">
                                    <div class="checkbox" v-for="type in item.items">
                                        <label>
                                            <input type="checkbox" value="">
                                            {{type.name}}
                                        </label>
                                    </div>
                                    <button class="btn btn-responsive btn-sm animated fadeIn btn-primary btn-sm pull-right">
                                        {{'Добавить в меню'|_}}
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- end of accordion -->
                </div>
            </div>
        </div>
        <div class="col-md-8 col-sm-8 col-xs-12" v-if="roots.length > 0">
            <div class="x_panel tile">
                <div class="x_title">
                    <h2>Меню:</h2>
                    <select-form-field
                            :label="false"
                            :model="model"
                            :id="'root'"
                            :required="false"
                            :multiple="false"
                            :readonly="false"
                            :css_class="'col-sm-6'"
                            :form_group="true"
                            :option_group="false"
                            :data="roots"
                            :placeholder="''"
                            :field="'root'">
                    </select-form-field>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <DraggableTree :data="data" draggable crossTree ref="tree1"
                                   @change="tree1Change">
                        <div slot-scope="{data, store}" class="menu-item">
                            <i v-if="data.children && data.children.length"
                               class="fa"
                               @click="store.toggleOpen(data)"
                               :class="{'fa-plus-square':!data.open,'fa-minus-square':data.open}">
                            </i>&nbsp;
                            <span>{{data.text}}</span>
                            &nbsp;
                            <span class="label label-default">
                            <router-link :to="{name:'menu_item',params:{id:data.id}}">
                                <i class="fa fa-edit"></i>
                                {{'Редактировать'|_}}
                            </router-link>
                            </span>
                        </div>
                    </DraggableTree>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator'
    import DataTable from "@/components/table/Table.vue";
    import {DraggableTree} from 'vue-draggable-nested-tree'
    import {CrudService} from "@/services/CrudService";
    import {Util} from "@/Util";
    import DataPreview from "@/components/table/DataPreview.vue";
    import {FdTranslator} from "@/FdTranslator";
    import SelectFormField from "@/components/form/fields/SelectFormField.vue";

    declare let $: any;

    @Component({
        name: 'MenuIndex',
        components: {
            'preview': DataPreview,
            'DataTable': DataTable,
            'DraggableTree': DraggableTree,
            'select-form-field': SelectFormField,
        },
        filters: {
            'json': function (value) {
                return JSON.stringify(value, null, 2)
            },
            _: function (value) {
                return FdTranslator._(value);
            }
        }
    })

    export default class MenuIndex extends Vue {

        @Prop({default: 'menu_index'})
        help_name: string;

        @Prop({default: 'menu_create'})
        create_route: string;

        @Provide()
        resource: [{
            id: string,
            name: string,
            items?: []
        }] = null;

        @Provide()
        data: any = [];

        @Provide()
        roots: any = [];

        @Provide()
        model: any = {root: {id: 0, name: ''}};


        @Watch('model.root')
        onChangeRoot(n, o, t) {
            if (n.id !== o.id) {
                let me = this;
                CrudService.post(Util.httpRoot + 'menu/list/' + n.id, {}).then((response: any) => {
                    if (response.data.success) {
                        me.$set(me, 'data', response.data.items);
                        Util.showSuccess('Команда выполнена успешно');
                    }
                }).catch((response) => {

                });
            }
        }


        mounted(): void {
            let me = this;

            CrudService.post(Util.httpRoot + 'menu/load', {}).then((response: any) => {
                if (response.data.success) {
                    if (response.data.breadcrumbs !== undefined) {
                        me.$store.dispatch('setBreadcrumbs', {
                            items: response.data.breadcrumbs,
                            page_title: response.data.page_title
                        });
                    }
                    me.$set(me, 'resource', response.data.resource);
                    me.$set(me, 'roots', response.data.roots);
                    // me.$set(me, 'data', response.data.items);
                    Util.showSuccess('Команда выполнена успешно');
                }
            }).catch((response) => {

            });
        }

        tree1Change(node, targetTree) {
            console.log(node.id, node.parent.id);
            this.data = targetTree.getPureData()
        }
    }

</script>

<style scoped lang="scss">
    .menu-item {

    }

    .menu-item:hover > ._action_block_ {
        padding-top: 5px;
        display: block !important;
    }
</style>
