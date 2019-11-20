import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Users from '@/components/users/Users.vue';
import UsersItems from '@/components/users/UsersItems.vue';
import UsersItem from '@/components/users/UsersItem.vue';
import UsersSubscribeItems from '@/components/users/UsersSubscribeItems.vue';
import UsersMailing from '@/components/users/UsersMailing.vue';
import UsersMailingItem from '@/components/users/UsersMailingItem.vue';
import UsersMailingTemplateItems from '@/components/users/UsersMailingTemplateItems.vue';
import UsersMailingTemplateItem from '@/components/users/UsersMailingTemplateItem.vue';
import UsersMailingStatus from '@/components/users/UsersMailingStatus.vue';
import UsersConfiguration from '@/components/users/UsersConfiguration.vue';
import Config from '@/components/config/Config.vue';
import DomainItems from '@/components/config/DomainItems.vue';
import DomainItem from '@/components/config/DomainItem.vue';
import ComponentsItems from '@/components/config/ComponentsItems.vue';
import ComponentsItem from '@/components/config/ComponentsItem.vue';
import EmailsItems from '@/components/config/EmailsItems.vue';
import EmailsItem from '@/components/config/EmailsItem.vue';
import LocalizationItems from '@/components/config/LocalizationItems.vue';
import LocalizationItem from '@/components/config/LocalizationItem.vue';
import HelpItems from './components/config/HelpItems.vue';
import HelpItem from './components/config/HelpItem.vue';
import Menu from '@/components/menu/Menu.vue';
import MenuIndex from '@/components/menu/MenuIndex.vue';
import MenuItem from './components/menu/MenuItem.vue';
import MenuItems from '@/components/menu/MenuItems.vue';
import PageItem from '@/components/menu/PageItem.vue';
import FormItem from './components/config/FormItem.vue';
import Media from '@/components/media/Media.vue';
import MediaIndex from '@/components/media/MediaIndex.vue';
import PageItems from '@/components/menu/PageItems.vue';
import MenuDiagnostic from "@/components/menu/MenuDiagnostic.vue";
import Sitemap from './components/menu/Sitemap.vue';

declare let window: any;

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


let token: any = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

Vue.use(Router);

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/users/',
      component: Users,
      children: [
        {
          path: 'items',
          name: 'users',
          component: UsersItems
        },
        {
          path: 'items/page/:page',
          name: 'users_list_page',
          component: UsersItems
        },
        {
          path: 'item/:id',
          name: 'user_profile',
          component: UsersItem
        },
        {
          path: 'subscribe',
          name: 'user_subscribe',
          component: UsersSubscribeItems
        },
        {
          path: 'subscribe/page/:page',
          name: 'users_subscribe_list_page',
          component: UsersSubscribeItems
        },
        {
          path: 'mailing',
          name: 'mailing',
          component: UsersMailing
        },
        {
          path: 'mailing/page/:page',
          name: 'mailing_page',
          component: UsersMailing
        },
        {
          path: 'mailing/:id',
          name: 'mailing_item',
          component: UsersMailingItem
        },
        {
          path: 'mailing-templates',
          name: 'mailing_templates_items',
          component: UsersMailingTemplateItems
        },
        {
          path: 'mailing-templates/:id',
          name: 'mailing_templates_item',
          component: UsersMailingTemplateItem
        },
        {
          path: 'mailing-status',
          name: 'mailing_status',
          component: UsersMailingStatus
        },
        {
          path: 'configuration',
          name: 'user_configuration',
          component: UsersConfiguration
        },
      ]
    },
    {
      path: '/configuration/',
      component: Config,
      children: [
        {
          path: 'domain',
          name: 'domain_items',
          component: DomainItems
        },
        {
          path: 'domain/page/:page',
          name: 'domain_items_page',
          component: DomainItems
        },
        {
          path: 'domain/:id',
          name: 'domain_item',
          component: DomainItem
        },
        {
          path: 'components',
          name: 'component_items',
          component: ComponentsItems
        },
        {
          path: 'components/page/:page',
          name: 'component_items_page',
          component: ComponentsItems
        },
        {
          path: 'components/:id',
          name: 'component_item',
          component: ComponentsItem
        },
        {
          path: 'emails',
          name: 'emails_items',
          component: EmailsItems
        },
        {
          path: 'emails/page/:page',
          name: 'emails_items_page',
          component: EmailsItems
        },
        {
          path: 'emails/:id',
          name: 'emails_item',
          component: EmailsItem
        },
        {
          path: 'localization',
          name: 'localization_items',
          component: LocalizationItems
        },
        {
          path: 'localization/page/:page',
          name: 'localization_items_page',
          component: LocalizationItems
        },
        {
          path: 'localization/:id',
          name: 'localization_item',
          component: LocalizationItem
        },
        {
          path: 'help',
          name: 'help_items',
          component: HelpItems
        },
        {
          path: 'help/page/:page',
          name: 'help_items_page',
          component: HelpItems
        },
        {
          path: 'help/:id',
          name: 'help_item',
          component: HelpItem
        },
        {
          path: 'form/:id',
          name: 'form_item',
          component: FormItem
        },
      ]
    },
    {
      path: '/menu/',
      component: Menu,
      children: [
        // {
        //     path: 'configuration',
        //     name: 'menu_info',
        //     component: MenuInfo
        // },
        {
          path: 'index',
          name: 'menu',
          component: MenuIndex
        },
        {
          path: 'items/:root_id',
          name: 'menu_items',
          component: MenuItems
        },
        {
          path: 'new/:parent_id',
          name: 'menu_create_children',
          component: MenuItem
        },
        {
          path: 'new',
          name: 'menu_create',
          component: MenuItem
        },
        {
          path: 'item/:id',
          name: 'menu_item',
          component: MenuItem
        },
        {
          path: 'list/:id',
          name: 'menu_items',
          component: MenuItems
        },
        {
          path: 'list/:id',
          name: 'menu_items_child',
          component: MenuItems
        },
        {
          path: 'diagnostic',
          name: 'menu_diagnostic',
          component: MenuDiagnostic
        },


        {
          path: 'sitemap',
          name: 'sitemap',
          component: Sitemap
        },
        {
          path: 'page/:id',
          name: 'page_item',
          component: PageItem
        },
        {
          path: 'pages',
          name: 'page_items',
          component: PageItems
        },
        {
          path: 'pages/page/:page',
          name: 'page_items_page',
          component: PageItems
        },
      ]
    },
    {
      path: '/media/',
      component: Media,
      children: [
        {
          path: 'index',
          name: 'media_configuration',
          component: MediaIndex
        },
        // {
        //   path: 'configuration',
        //   name: 'media_configuration',
        //   component: MediaIndex
        // },
      ]
    }
  ]
})
