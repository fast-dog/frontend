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
                        <div class="clearfix"></div>
                        <!-- menu profile quick info -->
                        <div class="profile clearfix" v-if="$store.getters.getUser">
                            <div class="profile_pic">
                                <img :src="$store.getters.getUser.photo" alt="..." class="img-circle profile_img">
                            </div>
                            <div class="profile_info">
                                <h2>{{$store.getters.getUser.name}}</h2>
                            </div>
                        </div>
                        <!-- /menu profile quick info -->

                        <br/>

                        <!-- sidebar menu -->
                        <SideMenu/>
                        <!-- /sidebar menu -->
                    </div>
                </div>

                <!-- top navigation -->
                <div class="top_nav">
                    <div class="nav_menu" style="padding-left: 30px">
                        <div class="page-title animated fadeIn" v-if="$store.getters.getBreadcrumbs.page_title.length > 0">
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
                                    <router-link :to="{path:link.url}" v-html="link.name" v-if="link.url !== false"></router-link>
                                    <strong v-if="link.url === false" v-html="link.name"></strong>
                                </li>
                            </ol>
                        </div>
                        <div class="clearfix"></div>
                        <div class="row" v-if="isHome()">
                            <div class="col-md-12">
                                <h2>is home</h2>
                            </div>
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
                    <div class="pull-right">
                        Gentelella - Bootstrap Admin Template by <a href="https://colorlib.com">Colorlib</a>
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
    </div>

</template>
<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import SideMenu from '@/components/SideMenu.vue';
    import SplashScreen from '@/components/SplashScreen.vue';
    import {Util} from '@/Util';
    //import {Component} from 'vue-property-decorator';


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
            'SideMenu': SideMenu,
            'SplashScreen': SplashScreen
        }
    })
    export default class App extends Vue {

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

        isHome(): boolean {
            return this.$route.name == 'home';
        }

        mounted(): void {
            let me = this;

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

            // $('[data-toggle="tooltip"]').tooltip({
            //     container: 'body'
            // });

        }
    }
</script>
<style lang="sass">
    @import "./scss/main"

</style>
