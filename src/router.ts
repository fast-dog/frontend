import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Users from '@/components/users/Users.vue';
import UsersItems from '@/components/users/UsersItems.vue';
import UsersItem from '@/components/users/UsersItem.vue';

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
                    path: 'item/:id',
                    name: 'user_profile',
                    component: UsersItem
                }
            ]
        }
    ]
})
