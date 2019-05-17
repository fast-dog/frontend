<template>
    <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="x_panel">
            <div class="x_title" v-if="option.title !== '' || option.tools === true">
                <h2 v-if="option.title !== ''">{{option.title}}</h2>
                <ul class="nav navbar-right panel_toolbox" v-if="option.tools">
                    <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href="#">Settings 1</a>
                            </li>
                            <li><a href="#">Settings 2</a>
                            </li>
                        </ul>
                    </li>
                    <li><a class="close-link"><i class="fa fa-close"></i></a>
                    </li>
                </ul>
                <div class="clearfix"></div>
            </div>
            <div class="x_content">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                        <tr>
                            <th>#</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>1</th>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
    import {Component, Provide, Prop, Vue} from 'vue-property-decorator'
    import {CrudService} from '@/services/CrudService';

    declare let ADMIN_ACCESS: string;

    @Component({
        name: 'table',
        components: {}
    })

    export default class Table extends Vue {

        @Prop({
            default: {
                title: '',
                tools: false
            }
        })
        option: {
            title: string,
            tools: boolean
        };


        mounted(): void {
            let me = this;

            console.log(me.option);

            CrudService.get(ADMIN_ACCESS + '/users', {})
                .then((response: any) => {
                })
                .catch((response) => {
                })
        }
    }
</script>

<style scoped>

</style>