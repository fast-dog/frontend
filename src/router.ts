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
                }
            ]
        }
    ]
})
