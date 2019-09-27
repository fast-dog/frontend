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
                <div class="x_content _menu_">
                    <p v-if="data.length === 0" class="alert alert-info text-center">
                        {{'Не выбрано меню'|_}}
                    </p>
                    <div class="process" v-if="process">
                        <i class="fa fa-paw" style="font-size: 25px"></i>
                    </div>
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
        process: boolean = false;

        @Provide()
        model: any = {root: {id: 0, name: ''}};


        @Watch('model.root')
        onChangeRoot(n, o, t) {
            let me = this;
            if (n === null) {
                me.$set(me, 'data', []);
            } else if (n.id) {
                me.$set(me, 'process', true);
                CrudService.post(Util.httpRoot + 'menu/list/' + n.id, {}).then((response: any) => {
                    if (response.data.success) {
                        me.$set(me, 'data', response.data.items);
                        Util.showSuccess('Команда выполнена успешно');
                    }
                    me.$set(me, 'process', false);
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
            this.data = targetTree.getPureData();
            if (node.parent.id === undefined) {
                console.log('-->', 'parent_id is undefined');
                this.reorder(node.id, this.data);
            } else {
                console.log('--> |', 'parent_id #' + node.parent.id);
                this.reorder(node.id, node.parent.children, node.parent);
            }
        }

        reorder(id, data, parent?): void {
            let me = this;
            for (let idx in data) {
                let _node = data[idx],
                    i: any = parseInt(idx);
                if (id === _node.id) {
                    let setIdx = (i > 0) ? i - 1 : i + 1,
                        direction = (i > 0) ? 'down' : 'up';

                    if (data.length == 1) {
                        direction = 'insert';
                        data[setIdx] = parent;
                    }

                    if (data[setIdx]) {
                        console.log('-->', data[setIdx].name);
                        console.log('-->', 'move node #' + id + ' in target #' +
                            data[setIdx].id + ' dir is:' + direction);
                        // move node in target
                        me.$set(me, 'process', true);
                        CrudService.post(Util.httpRoot + 'menu/reorder', {
                            id: id,
                            model: 'category',
                            position: '',
                            parent: data[setIdx].id,
                            move: direction
                        }).then((response: any) => {
                            if (response.data.success) {
                                Util.showSuccess('Команда выполнена успешно');
                            } else {
                                Util.showError(response.data.message);
                            }
                            me.$set(me, 'process', false);

                        }, (response) => {
                            Util.errorHandler(response);
                            me.$set(me, 'process', false);
                        });
                    } else {
                        console.log('--> i: ' + i, ', idx: ' + setIdx + ' not exist?' + ' dir is:' + direction);
                        console.dir(data)
                    }
                }
            }
        }
    }

</script>

<style scoped lang="scss">
    ._menu_ {
        position: relative;

        .process {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background-color: #e7eaec;
            opacity: 0.3;

            i {
                position: absolute;
                left: 49%;
                top: 45%;
            }
        }
    }

    .menu-item {

    }

    .menu-item:hover > ._action_block_ {
        padding-top: 5px;
        display: block !important;
    }
</style>
