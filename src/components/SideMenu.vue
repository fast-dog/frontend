<template>
  <!-- sidebar menu -->
  <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
    <div class="menu_section">
      <ul class="nav side-menu">
        <li v-for="item in $store.getters.getMainMenu"
            :class="{'active': isActive(item,$route.fullPath)}">
          <a v-if="item.name">
            <i :class="'fa ' + item.icon"></i> {{item.name}}
            <span class="fa fa-chevron-down" v-if="item.children && item.children.length > 0"></span>
          </a>
          <ul class="nav child_menu" v-if="item.children && item.children.length > 0"
              :style="{'display': (isActive(item,$route.fullPath) && getBodyCls()!=='nav-sm')?'block':''}">
            <li v-for="child in item.children"
                :class="{'active': ($route.fullPath === child.route)}">
              <router-link :to="child.route">
                <i :class="'fa ' + child.icon" v-if="child.icon"></i> {{child.name}}
              </router-link>
              <router-link v-if="child.new"
                           :to="child.new" :class="'new_object'">
                <i class="fa fa-plus-circle"></i>
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>

  </div>
  <!-- /sidebar menu -->
</template>
<script lang="ts">
    import {Component, Provide, Vue, Watch} from 'vue-property-decorator'
    import {Util} from '@/Util';

    declare let $: any;

    @Component({
        name: 'side_menu',
        components: {}
    })

    export default class SideMenu extends Vue {


        @Provide()
        items: any [] = [];

        @Watch('$store.getters.getMainMenu')
        onSetMainMenu(items, oldItems) {
            let me = this;

            me.$nextTick(function () {
                me.init_sidebar();
            })
        }

        @Watch('$route.path')
        onChangeRouterPath(n, o) {
            let me = this;
            if ($('body').is('.nav-sm')) {
                $('li.active').each(function () {
                    $(this).removeClass('active')
                    $('ul:first', this).slideUp(function () {
                        me.setContentHeight();
                    });
                })
            }

        }

        mounted(): void {
            let me = this;
            me.$store.dispatch('setMainMenu');
            // /Sidebar
            document.body.classList.add(Util.getLocalVar('body-class', 'nav-md'));

        }

        // Sidebar
        init_sidebar() {
            let me = this,
                CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
                $BODY = $('body'),
                $MENU_TOGGLE = $('#menu_toggle'),
                $SIDEBAR_MENU = $('#sidebar-menu'),
                $SIDEBAR_FOOTER = $('.sidebar-footer'),
                $LEFT_COL = $('.left_col'),
                $RIGHT_COL = $('.right_col'),
                $NAV_MENU = $('.nav_menu'),
                $FOOTER = $('footer');
            // TODO: This is some kind of easy fix, maybe we can improve this


            $SIDEBAR_MENU.find('a').on('click', function (ev) {
                console.log('clicked - sidebar_menu');
                var $li = $(this).parent();

                if ($li.is('.active')) {
                    $li.removeClass('active active-sm');
                    $('ul:first', $li).slideUp(function () {
                        me.setContentHeight();
                    });
                } else {
                    // prevent closing menu if we are on child menu
                    if (!$li.parent().is('.child_menu')) {
                        $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                        $SIDEBAR_MENU.find('li ul').slideUp();
                    } else {
                        if ($BODY.is('.nav-sm')) {
                            $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                            $SIDEBAR_MENU.find('li ul').slideUp();
                        }
                    }
                    $li.addClass('active');

                    $('ul:first', $li).slideDown(function () {
                        me.setContentHeight();
                    });
                }
            });

            // toggle small or large menu
            $MENU_TOGGLE.on('click', function (e) {
                e.preventDefault();
                let setClass: string = '';
                if ($BODY.hasClass('nav-md')) {
                    $SIDEBAR_MENU.find('li.active ul').hide();
                    $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
                    setClass = 'nav-sm'
                } else {
                    $SIDEBAR_MENU.find('li.active-sm ul').show();
                    $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
                    setClass = 'nav-md';
                }

                $BODY.toggleClass('nav-md nav-sm');
                Util.setLocalVar('body-class', setClass);
                me.setContentHeight();
            });

            // check active menu
            $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

            $SIDEBAR_MENU.find('a').filter(function () {
                return this.href == CURRENT_URL;
            }).parent('li').addClass('current-page').parents('ul').slideDown(function () {
                me.setContentHeight();
            }).parent().addClass('active');

            // recompute content when resizing
            $(window).smartresize(function () {
                me.setContentHeight();
            });

            me.setContentHeight();

            // fixed sidebar
            if ($.fn.mCustomScrollbar) {
                $('.menu_fixed').mCustomScrollbar({
                    autoHideScrollbar: true,
                    theme: 'minimal',
                    mouseWheel: {preventDefault: true}
                });
            }
        }

        setContentHeight() {
            let $BODY = $('body'),
                $SIDEBAR_FOOTER = $('.sidebar-footer'),
                $LEFT_COL = $('.left_col'),
                $RIGHT_COL = $('.right_col'),
                $NAV_MENU = $('.nav_menu'),
                $FOOTER = $('footer');

            // reset height
            $RIGHT_COL.css('min-height', $(window).height());

            var bodyHeight = $BODY.outerHeight(),
                footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
                leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
                contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

            // normalize content
            contentHeight -= $NAV_MENU.height() + footerHeight;

            $RIGHT_COL.css('min-height', contentHeight);
        }

        isActive(item, route): boolean {

            // if (Util.getLocalVar('body-class', 'nav-md') == 'nav-sm') {
            //     return false;
            // }

            for (let i in item.children) {
                if (item.children[i].route === route) {
                    return true;
                }
            }

            let segment = route.split('/')[1];
            for (let i in item.children) {
                if (item.children[i].route.split('/')[1] === segment) {
                    return true;
                }
            }

            return false;
        }

        getBodyCls(): string {
            return Util.getLocalVar('body-class', 'nav-md');
        }
    }

</script>
