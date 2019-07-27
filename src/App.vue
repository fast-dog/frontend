<template>
    <div id="app">
        <div class="container body">
            <div class="main_container">
                <div class="col-md-3 left_col">
                    <div class="left_col scroll-view">
                        <div class="navbar nav_title">
                            <a href="/" class="site_title">
                                <img :src="getLogo()" alt="..." class="img-thumbnail logo">
                            </a>
                        </div>
                        <!--                        <a href="#" id="menu_toggle"><i class="fa fa-bars"></i></a>-->
                        <div class="clearfix"></div>
                        <br/>
                        <!-- sidebar menu -->
                        <SideMenu/>
                        <!-- /sidebar menu -->
                    </div>
                </div>

                <!-- top navigation -->
                <div class="top_nav">
                    <div class="nav_menu" style="padding-left: 30px">
                        <div class="page-title animated fadeIn"
                             v-if="$store.getters.getBreadcrumbs.page_title.length > 0">
                            <div class="title_left">
                                <h3>{{$store.getters.getBreadcrumbs.page_title}}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /top navigation -->

                <!-- page content -->
                <div class="right_col" role="main">
                    <div>
                        <div class="clearfix"></div>
                        <div aria-label="breadcrumb" class="animated fadeIn"
                             v-if="$store.getters.getBreadcrumbs.items.length > 0">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item" v-for="link in $store.getters.getBreadcrumbs.items">
                                    <router-link :to="{path:link.url}" v-html="link.name"
                                                 v-if="link.url !== false"></router-link>
                                    <strong v-if="link.url === false" v-html="link.name"></strong>
                                </li>
                            </ol>
                        </div>
                        <div class="clearfix"></div>
                        <div class="row" v-if="isHome()">

                            <template v-for="item in items">
                                <div class="col-lg-4 col-md-6 _widget_ animated" :data-widget-id="item.id"
                                     :class="getAnimatedClass()">
                                    <div class="x_panel float-e-margins">
                                        <div class="x_title " style="cursor: move">
                                            <h5>{{item.name}}</h5>
                                            <div class="ibox-tools">
                                                <a class="close-link" v-on:click="deleteDesktopWidget(item)">
                                                    <i class="fa fa-times"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="x_content wiget " style="height: 230px">
                                            <desktop-graph v-if="item.type == 'Graph'"
                                                           :alias=item.alias
                                                           :name="'Количество'"
                                                           :graph_items="item.items"></desktop-graph>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div class="row" v-if="!isHome()">
                            <div class="col-md-12 col-sm-12">
                                <SplashScreen></SplashScreen>
                                <router-view></router-view>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /page content -->

                <!-- footer content -->
                <footer>
                    <div class="pull-left">
                        FastDog - <a href="https://github.com/fast-dog" target="_blank">
                        <i class="fa fa-github"></i>
                    </a>
                    </div>
                    <div class="pull-right">
                        Gentelella - Bootstrap Admin Template by <a href="https://colorlib.com"
                                                                    target="_blank">Colorlib</a>
                    </div>
                    <div class="clearfix"></div>
                </footer>
                <!-- /footer content -->
            </div>
        </div>
        <div class="modal fade">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title">Modal title</h4>
                    </div>
                    <div class="modal-body">
                        <p>One fine body…</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->
        <div class="modal fade bs-example-modal-lg" v-if="$store.getters.getMainMenu.length > 0" id="elFinderModal"
             tabindex="-1" role="dialog" data-backdrop="false">
            <div class="modal-dialog modal-lg">
                <div>
                    <button type="button" class="close" style="opacity: 1 !important;"
                            data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true" style="color: #ED5565; font-weight: 900">
                            <i class="fa fa-close"></i>
                        </span>
                    </button>
                </div>
                <div style="background-color: transparent !important; border: none !important;">
                    <iframe frameborder="0" :src="getElfindeerRoute()"
                            border="0"
                            height="620" width="920"
                            noresize="noresize"></iframe>
                </div>
            </div>
        </div>
    </div>

</template>
<script lang="ts">
    import {Component, Provide, Vue, Watch} from 'vue-property-decorator';
    import SideMenu from '@/components/SideMenu.vue';
    import SplashScreen from '@/components/SplashScreen.vue';
    import {Util} from '@/Util';
    import {CrudService} from "@/services/CrudService";
    import DesktopGraph from "@/components/desktop/DesktopGraph.vue";

    require('jquery-ui/ui/widgets/sortable.js');

    declare let $: any;

    /**
     * Resize function without multiple trigger
     *
     * Usage:
     * $(window).smartresize(function(){
     *     // code here
     * });
     */
    (function ($, sr) {
        // debouncing function from John Hann
        // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
        var debounce = function (func, threshold?, execAsap?) {
            var timeout;

            return function debounced() {
                var obj = this, args = arguments;

                function delayed() {
                    if (!execAsap)
                        func.apply(obj, args);
                    timeout = null;
                }

                if (timeout)
                    clearTimeout(timeout);
                else if (execAsap)
                    func.apply(obj, args);

                timeout = setTimeout(delayed, threshold || 100);
            };
        };

        // smartresize
        $.fn[sr] = function (fn) {
            return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
        };

    })($, 'smartresize');

    /**
     * Gentelella scripts
     */

    @Component({
        components: {
            'desktop-graph': DesktopGraph,
            'SideMenu': SideMenu,
            'SplashScreen': SplashScreen
        }
    })

    export default class App extends Vue {

        @Provide()
        items: any = null;


        @Watch('$route.path')
        onChangeRouterPath(path, oldPath) {
            let me = this;
            me.documentUp();
            if (path === '/') {
                me.$store.dispatch('setBreadcrumbs', {
                    items: [{
                        name: 'Главная',
                        url: false
                    }],
                    page_title: 'FastDog CMS'
                })
            }
        }

        documentUp(): void {
            Util.documentUp();
        }

        static baseUrl() {
            return window.location.protocol + '//' + window.location.hostname;
        }

        getLogo(): string {
            return window.location.protocol + '//' + window.location.hostname + '/vendor/fast_dog/frontend/img/logo.png';
        }

        getElfindeerRoute(): string {
            return window.location.protocol + '//' + window.location.hostname + '/elfinder/popup/image';
        }

        isHome(): boolean {
            return this.$route.name == 'home';
        }

        mounted(): void {
            let me = this;

            CrudService.get(Util.httpRoot + 'desktop', {}).then((response: any) => {
                this.$store.dispatch('setBreadcrumbs', {
                    items: [{
                        name: '', url: false
                    }],
                    page_title: 'Рабочий стол',
                    splash_screen: true
                });
                if (response.data.success) {
                    me.items = response.data.items;
                    me.$nextTick(function () {
                        $('.sortableList').sortable({
                            cursor: 'move',
                            items: 'div._widget_',
                            handle: '.ibox-title',
                            helper: function (e, ui) {
                                return ui;
                            },
                            start: function (e, ui) {
                            },
                            stop: function (e, ui) {
                                $(ui.item).css({opacity: 0});
                                $(ui.item).animate({
                                    opacity: 1,
                                }, 800, function () {
                                    $(ui.item).css('opacity', '');
                                });
                                let set = {};
                                $('.sortableList > div._widget_').each(function (idx, element) {
                                    set[$(element).data('id')] = idx;
                                });
                                Util.sendData({
                                    url: 'desktop-sort',
                                    data: {
                                        set: set,
                                    },
                                    callback: function (response) {
                                    }
                                }, me)
                            }
                        });
                    })
                }
                me.$store.commit('setNotification', {
                    total: response.data.total,
                    items: response.data.items,
                    messages_total: response.data.messages_total,
                    messages_items: response.data.messages_items,
                });
                // Util.initNotification(me.$parent, response);

            }, (response) => {
                Util.errorHandler(response);
            });

            me.$store.dispatch('setBreadcrumbs', {
                items: [{
                    name: 'Главная',
                    url: false
                }],
                page_title: 'FastDog CMS'
            });

            document.body.classList.add('nav-md');

            $('.collapse-link').on('click', function () {
                var $BOX_PANEL = $(this).closest('.x_panel'),
                    $ICON = $(this).find('i'),
                    $BOX_CONTENT = $BOX_PANEL.find('.x_content');

                // fix for some div with hardcoded fix class
                if ($BOX_PANEL.attr('style')) {
                    $BOX_CONTENT.slideToggle(200, function () {
                        $BOX_PANEL.removeAttr('style');
                    });
                } else {
                    $BOX_CONTENT.slideToggle(200);
                    $BOX_PANEL.css('height', 'auto');
                }

                $ICON.toggleClass('fa-chevron-up fa-chevron-down');
            });

            $('.close-link').click(function () {
                var $BOX_PANEL = $(this).closest('.x_panel');
                $BOX_PANEL.remove();
            });
        }

        deleteDesktopWidget(item: any): void {
            Util.sendData({
                url: 'desktop-delete',
                data: {
                    id: item.id,
                },
                callback: function (response) {
                    $('*[data-widget-id="' + item.id + '"]').fadeOut('slow', function () {
                        $(this).remove();
                    });
                }
            }, this)

        }

        getAnimatedClass(): string {
            return Util.getAnimation();
        }
    }
</script>
<style lang="sass">
    @import "./scss/main"

</style>
