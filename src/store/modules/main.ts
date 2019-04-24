import {CrudService} from '@/services/CrudService';
import {MenuService} from '@/services/MenuService';
import {Util} from '@/Util';


declare let CKEDITOR: any;

const state = {
    user: null,
    main_menu: [],
    context: '',
    ckeditor_config: [],
    ckeditor_templates: [],
    min_height_wrapper: 500,
    route_notify: false,
    notification: {
        total: 0,
        items: [],
        messages_total: 0,
        messages_items: []
    },
    breadcrumbs: {
        items: [],
        page_title: '',
        is_error: false
    },
    splash_screen: false
};

// getters
const getters = {
    getUser: state => state.user,
    getMainMenu: state => state.main_menu,
    getNotification: state => state.notification,
    getNotificationItems: state => state.notification.items,
    getNotificationItemsTotal: state => state.notification.total,
    getMainContext: state => state.context,
    getBreadcrumbs: state => state.breadcrumbs,
    getSplashScreen: state => state.splash_screen,
    getCkeditorConfig: state => state.ckeditor_config,
    getCkeditorTemplates: state => state.ckeditor_templates,
    getMinHeightWrapper: state => state.min_height_wrapper,
    getRouteNotify: state => state.route_notify,
};

// actions
const actions = {
    setUser({commit, state}) {
        CrudService.get('/user', {}).then((response: any) => {
            if (response.data.success) {
                commit('setUser', {user: response.data.items[0]});
            }
        }, (response) => {
            console.log(response)
        })
    },
    setMainMenu({commit, state}) {
        MenuService.menu().then((response: any) => {
            commit('setMainMenu', {items: response.data.items});
            commit('setUser', {user: response.data.user});
            commit('setCkeditorConfig', response.data.ckeditor_config);
            commit('setCkeditorTemplates', response.data.ckeditor_templates);
            if (response.data.notifications) {
                commit('setNotification', {
                    total: response.data.notifications.total,
                    items: response.data.notifications.items,
                    messages_total: response.data.notifications.messages_total,
                    messages_items: response.data.notifications.messages_items,
                });
            }
        }, (response) => {
            Util.errorHandler(response)
        });
    },
    setMainContext({commit, state}, payload) {
        commit('setMainContext', payload);
    },
    setBreadcrumbs({commit, state}, payload) {
        commit('setBreadcrumbs', payload);
        commit('setSplashScreen', (payload.splash_screen) ? payload.splash_screen : payload.items.length == 0);
    },
    setMinHeightWrapper({commit, state}, payload) {
        commit('setMinHeightWrapper', payload);
    },
    setRouteNotify({commit, state}, payload) {
        commit('setRouteNotify', payload);
    },
    setNotifications({commit, state}, response) {
        console.log(response)
        commit('setNotification', {
            total: response.total,
            items: response.items,
            messages_total: response.messages_total,
            messages_items: response.messages_items,
        });
    }
};

// mutations
const mutations = {
    setCkeditorConfig(state, payload) {
        let config = [
            {
                name: '240p',
                type: 'widget',
                widget: 'embedSemantic',
                attributes: {'class': 'embed-240p'},
                group: 'size'
            },
            {
                name: '360p',
                type: 'widget',
                widget: 'embedSemantic',
                attributes: {'class': 'embed-360p'},
                group: 'size'
            },
            {
                name: '480p',
                type: 'widget',
                widget: 'embedSemantic',
                attributes: {'class': 'embed-480p'},
                group: 'size'
            },
            {
                name: '720p',
                type: 'widget',
                widget: 'embedSemantic',
                attributes: {'class': 'embed-720p'},
                group: 'size'
            },
            {
                name: '1080p',
                type: 'widget',
                widget: 'embedSemantic',
                attributes: {'class': 'embed-1080p'},
                group: 'size'
            },

            // Adding space after the style name is an intended workaround. For now, there
            // is no option to create two styles with the same name for different widget types. See #16664.
            {
                name: '240p ',
                type: 'widget',
                widget: 'embed',
                attributes: {'class': 'embed-240p'},
                group: 'size'
            },
            {
                name: '360p ',
                type: 'widget',
                widget: 'embed',
                attributes: {'class': 'embed-360p'},
                group: 'size'
            },
            {
                name: '480p ',
                type: 'widget',
                widget: 'embed',
                attributes: {'class': 'embed-480p'},
                group: 'size'
            },
            {
                name: '720p ',
                type: 'widget',
                widget: 'embed',
                attributes: {'class': 'embed-720p'},
                group: 'size'
            },
            {
                name: '1080p ',
                type: 'widget',
                widget: 'embed',
                attributes: {'class': 'embed-1080p'},
                group: 'size'
            }
        ];
        payload.config.forEach(function (item, idx) {
            if (item.type) {
                let configItem: any = {
                    name: item.name,
                    element: item.tag,
                    attributes: {},
                    styles: {}
                };
                if (item.type == 'attributes') {
                    configItem.attributes[item.attributes.name] = item.attributes.value;
                } else if (item.type == 'styles') {
                    configItem.styles[item.attributes.name] = item.attributes.value;
                }
                config.push(configItem);
            }
        });

        state.ckeditor_config = config;
    },
    setCkeditorTemplates(state, payload) {
        state.ckeditor_templates = payload.config;
    },
    setUser(state, payload) {
        state.user = payload.user;
    },
    setMainMenu(state, payload) {
        state.main_menu = payload.items;
    },
    setMainContext(state, payload) {
        state.context = payload;
    },
    setBreadcrumbs(state, payload) {
        if (payload.items.length == 0) {
            payload = {
                items: [],
                page_title: 'Идет обработка запроса...'
            }
        }
        state.breadcrumbs = payload;
    },
    setSplashScreen(state, payload) {
        state.splash_screen = payload;
    },
    setNotification(state, payload) {
        state.notification = {
            total: payload.total,
            items: payload.items,
            messages_total: payload.messages_total,
            messages_items: payload.messages_items,
        };
    },
    setMinHeightWrapper(state, payload) {
        state.min_height_wrapper = Math.min(300, (payload - 10));
    },
    setRouteNotify(state, payload) {
        state.route_notify = payload;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}