import Vue from 'vue';
import * as VueRouter from 'vue-router';
import * as Toastr from 'toastr';
import * as BootstrapDialog from 'bootstrap3-dialog';

import {Prop} from 'vue-property-decorator';
import {CrudService} from '@/services/CrudService';
import {FdTranslator} from '@/FdTranslator';

declare let ADMIN_ACCESS: string;
declare let $: any;
declare let parameters: any;

declare let lang: any;
declare let selectedFile: any;
declare let CKEDITOR: any;

export class Util extends Vue {

    @Prop()
    ckEditorStyleConfig: any;

    static get httpRoot(): string {
        return window.location.protocol + '//' + window.location.hostname + '/' + ADMIN_ACCESS + '/'
    }

    static getLocalVar(name: string, def: any): any {
        let val = localStorage.getItem(name);

        return (name !== undefined && val) ? val : def;
    }

    static setLocalVar(name: string, val: any): any {
        localStorage.setItem(name, val);
    }

    static errorHandler(error: any): void {
        let text = [];
        if (error.response) {
            switch (error.response.status) {
                case 401:

                    break;
                case 422:
                    for (let name in error.response.data.errors) {
                        for (let i in error.response.data.errors[name]) {
                            text.push(error.response.data.errors[name][i]);
                        }
                    }
                    break;
            }
            if (text.length) {
                this.showWarning(text.join('<br />'));
            } else {
                this.showError(FdTranslator._('При выполнение запроса произошла ошибка, попробуйте повторить позже.'));
            }
        } else {
            this.showError(FdTranslator._('При выполнение запроса произошла ошибка, попробуйте повторить позже.'));
        }

    }

    static showError(msg: string): void {
        Toastr.options = {
            'positionClass': 'toast-bottom-left'
        };
        Toastr.error(msg)
    }

    static showWarning(msg: string): void {
        Toastr.options = {
            'positionClass': 'toast-bottom-left'
        };
        Toastr.warning(msg);
    }

    static showSuccess(msg: string): void {
        Toastr.options = {
            'positionClass': 'toast-bottom-left'
        };
        Toastr.success(msg);
    }

    static ckEditorInstanceConfig(): any {
        return {
            // stylesSet: Util.getckEditorStyleConfig(),
            extraPlugins: 'justify,embed,autoembed,div,codemirror,colorbutton',
            div_wrapTable: true,
            basePath: '/',
            height: 600
        };
    }

    static deleteDialog(data: {
        title?: string,
        text: string,
        callback: any,
        text_ok?: string
    }): void {
        BootstrapDialog.show({
            title: (data.title != '') ? data.title : FdTranslator._('Подтверждение команды'),
            message: (data.text != '') ? data.text : FdTranslator._('Вы действительно хотите удалить запись?'),
            buttons: [{
                id: 'btn-ok',
                label: (data.text_ok) ? data.text_ok : FdTranslator._('Да, удалить'),
                cssClass: 'btn-sm btn-danger',
                autospin: false,
                action: function (dialogRef) {
                    data.callback();
                    dialogRef.close();
                }
            }, {
                id: 'btn-cancel',
                label: FdTranslator._('Нет'),
                cssClass: 'btn-sm btn-default',
                autospin: false,
                action: function (dialogRef) {
                    dialogRef.close();
                }
            }]
        });
    }

    static initFixedTableHeader() {
        let table = $('table'),
            tr = $('tr.fixed', table),
            origOffsetY = $(tr).next().offset().top,
            cloneTr = tr,
            fixTable = $('<table class="table table-bordered table-striped _table_"><thead></thead></table>'),
            buttonBar = $('.control-btn'),
            activate = false,
            tableOffset = $(table).offset();

        $(fixTable).css({
            width: $(table).outerWidth(),
            display: 'none',
            top: 60,
            left: tableOffset.left,
            position: 'fixed',
            zIndex: 2500
        });
        buttonBar.css({
            top: 60,
            zIndex: 2510,
            // left: (tableOffset.left + (($(table).outerWidth() / 2) - (buttonBarWidth / 2))) + 'px'
        });

        $(fixTable).children('thead').append(cloneTr);
        $(table).after().append(fixTable);
        cloneTr.show();
        $(window).resize(function () {
            fixTable.css({
                width: $(table).outerWidth(),
            })
        });
        $(document).scroll(function () {
            let y = ($(window).scrollTop() + 60);
            if (y > origOffsetY) {
                fixTable.show();
                buttonBar
                    .addClass('btn-group')
                    .css({
                        position: 'fixed',
                        left: (tableOffset.left + (($(table).outerWidth() / 2) - ((buttonBar).outerWidth() / 2))) + 'px'
                    })
            } else {
                buttonBar
                    .removeClass('btn-group')
                    .css({
                        position: 'static'
                    });
                fixTable.hide();
            }
        });
    }

    static initScrollTab() {
        let menu = $('.fixed-scroll'),
            width = $(menu).outerWidth(false),
            origOffsetY = (menu.length > 0) ? menu.offset().top : 0,
            tabsLeft = $('.tabs-left > ul'),
            tabsLeftWidth = 0;

        function scroll() {
            if (origOffsetY > 0) {
                if ($(window).scrollTop() > origOffsetY) {
                    width = $(menu).outerWidth(false);
                    $(menu).each(function (idx, menu) {
                        let marginTop = parseInt($(menu).data('top'));
                        if (isNaN(marginTop)) {
                            marginTop = 0;
                        }
                        $(menu).css({
                            position: 'fixed',
                            top: marginTop,
                            zIndex: 2000,
                            background: 'white',
                            width: width + 'px'
                        });
                    });

                    if (tabsLeft.length) {
                        if (tabsLeftWidth == 0) {
                            tabsLeftWidth = $(tabsLeft).outerWidth()
                        }
                        $(tabsLeft).css({
                            position: 'fixed',
                            top: 120,
                            width: tabsLeftWidth,
                            zIndex: 2000
                        })
                    }
                } else {
                    $(menu).each(function (idx, menu) {
                        $(menu).css({
                            position: 'static'
                        });
                    });

                    if (tabsLeft.length) {
                        $(tabsLeft).css({
                            position: 'inherit'
                        })
                    }
                }
            }
        }

        document.onscroll = scroll;
    }

    static initTooltip(): void {
        $('.tooltip').remove();
        $('.tooltip-container').tooltip({
            selector: '[data-toggle=tooltip]',
            container: 'body'
        });
    }

    static initDigitValidators(): void {
        $('body')
            .on('keyup', 'input[data-validate="double"]', function () {
                this.value = this.value.replace(/[^\d\.\,]+/g, '');
            })
            .on('keyup', 'input[data-validate="integer"]', function () {
                this.value = this.value.replace(/[^\d]+/g, '');
            })
    }

    static buttonCmd(actionButtons: [any], data: { icon: string, field: string, value: any }): [any] {
        let me = this;
        $(actionButtons).each(function (idx, element) {
            if (element.icon == data.icon) {
                if (typeof element[data.field] == 'boolean') {
                    element[data.field] = data.value;
                }
            }
        });
        return actionButtons;
    }

    public static help(name: string, me: any): void {
        CrudService.get(Util.httpRoot + 'config/help-page?name=' + name, {
            name: name
        }).then((response: any) => {
            if (response.data.success) {
                Util.showSuccess(FdTranslator._('Команда выполнена успешно'));
                let modal = $('#helpModal');
                $('.modal-content > .modal-body', modal).html(response.data.items[0].text);
                $('.modal-content > .modal-header > .modal-title', modal).html(response.data.items[0].name);
                $(modal).modal('show')
            }
        }, (response) => {
            Util.errorHandler(response);
        });
    }

    static sendData(data: {
        event?: Event,
        url: string,
        data: any,
        callback: any
    }, me: any): any {
        let Ladda = require('../node_modules/ladda/js/ladda'),
            target: any = (data.event) ? data.event.target : null,
            l = null;

        if (target) {
            if (target.nodeName != 'BUTTON') {
                target = $(target).parent()[0];
            }
            l = (target) ? Ladda.create(target) : null;
            l.start();
        }
        let removeLadda = function () {
            if (l) {
                setTimeout(function () {
                    let html = $('span.ladda-label', target).html();
                    console.log(target);
                    $('span.ladda-label,.ladda-spinner,.ladda-progress', target).remove();
                    $(target).html(html); console.log(html)
                    l.remove()
                })
            }
        };

        CrudService.post(Util.httpRoot + data.url, data.data).then((response: any) => {
            if (response.data.success) {
                Util.showSuccess(FdTranslator._('Команда выполнена успешно'));
            }
            if (response.data.notifications) {
                me.$store.dispatch('setNotifications', response.data.notifications);
            }
            removeLadda();
            return data.callback(response);
        })
            .catch(error => {
                removeLadda();
                Util.errorHandler(error);
            });
    }

    static openElFinder(data: { name: string, params: any, callback: any, startPathHash?: any }): void {
        let modal = $('#elFinderModal');

        if (data.startPathHash) {
            parameters.elfinder.request({
                data: {cmd: 'open', target: data.startPathHash, tree: false}
            });
        }
        if (data.params == undefined) {
            data.params = ''
        }
        $(modal).modal('show');
        $(modal).on('show.bs.modal', function () {
            setTimeout(function () {
                parameters.elfinder.customData.parent_type = parameters.parent_type;
                parameters.elfinder.customData.parent_id = parameters.parent_id;
            }, 200)
        });

        $(modal).on('hide.bs.modal', function () {
            data.callback(selectedFile);
            $(modal).unbind('hide.bs.modal');
        })
    }

    static initDatePicker(): void {
        $('.date').datepicker({
            todayBtn: 'linked',
            keyboardNavigation: false,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true,
            format: 'yyyy-mm-dd'
        });
    }

    static initMaskPhone(mask: string) {
        $('input[data-action="mask_phone"]').mask(mask);
    }

    static initElfinder(item: any): void {
        if (item.files_module == 'Y') {
            parameters.parent_type = item.el_finder.parent_type;
            parameters.parent_id = item.el_finder.parent_id;
            CKEDITOR.config.filebrowserBrowseUrl = '/elfinder/ckeditor?parent_type=' +
                item.el_finder.parent_type + '&parent_id=' + item.el_finder.parent_id;
        } else {
            CKEDITOR.config.filebrowserBrowseUrl = '/elfinder/ckeditor?parent_type=none&parent_id=0'
        }
    }

    public static buttonBack(routeCallback?: any): any {

        return {
            text: FdTranslator._('Назад'),
            icon: 'fa-chevron-left',
            cls: 'btn-sm btn-default animated fadeIn',
            visible: true,
            action: function ($event) {
                if (routeCallback) {
                    routeCallback();
                } else {
                    window.history.back()
                }
            }
        }
    }

    public static buttonSave(params: {
        me: Vue,
        item: any,
        url: string,
        callback: any,
        route_name: string
    }): any {
        return {
            text: FdTranslator._('Сохранить'),
            icon: 'fa-pencil-square-o',
            cls: 'btn-primary btn-sm',
            id: 'save-content-btn',
            action: function ($event) {
                params.me.$validator.validateAll().then((result) => {
                    if (result) {
                        Util.sendData({
                            url: params.url,
                            data: params.item,
                            event: $event,
                            callback: function (response) {
                                if (response.data.success) {
                                    if (params.item.id == 0) {
                                        params.item.id = response.data.items[0].id;
                                        if (params.route_name !== '') {
                                            params.me.$router.push({
                                                name: params.route_name,
                                                params: {id: params.item.id}
                                            });
                                        }
                                    }
                                    if (params.callback) {
                                        params.me.$set(params.me, 'item', {});
                                        params.me.$store.dispatch('clearForm');
                                        params.callback(response)
                                    }
                                }
                                params.me.$store.dispatch('setRouteNotify', false);
                            }
                        }, params.me)
                    }
                });
            }
        }
    }

    public static buttonSaveAndClose(params: {
        me: Vue,
        item: any,
        url: string,
        route_name: string,
        callback?: any
    }): any {
        return {
            text: FdTranslator._('Сохранить и закрыть'),
            icon: 'fa-check',
            cls: 'btn-default btn-sm',
            id: 'save-and-close-btn',
            action: function ($event) {
                params.me.$validator.validateAll().then((result) => {
                    if (result) {
                        Util.sendData({
                            url: params.url,
                            data: params.item,
                            event: $event,
                            callback: function (response) {
                                if (params.callback) {
                                    params.callback(response)
                                } else {
                                    params.me.$store.dispatch('setRouteNotify', false);
                                    params.me.$router.push({name: params.route_name});
                                }
                            }
                        }, params.me)
                    }
                });
            }
        }
    }

    public static buttonUpdate(params: {
        callback: any
    }): any {
        return {
            text: FdTranslator._('Обновить'),
            icon: 'fa-repeat',
            cls: 'btn-sm btn-default',
            visible: true,
            id: 'update-content-btn',
            action: function ($event) {
                params.callback();
            }
        }
    }

    public static buttonDelete(url, item): any {
        return {
            text: FdTranslator._('В корзину'),
            icon: 'fa-trash',
            visible: item.id > 0,
            cls: 'btn-danger btn-sm',
            action: function ($event) {
                Util.deleteDialog({
                    title: '', text: '',
                    callback: function () {
                        CrudService.post(Util.httpRoot + url, {
                            id: item.id,
                            field: 'deleted',
                            value: 1
                        }).then((response: any) => {
                            if (response.data.success) {
                                window.history.back()
                            } else {
                                Util.errorHandler(response)
                            }
                        }, (response) => {
                            Util.errorHandler(response)
                        });
                    }
                })
            }
        };
    }

    public static buttons(data: any /*[{
        icon?: string,
        text: string,
        cls?: string,
        visible?: boolean,
        action?: any,
        id?: string
    }]*/): any {
        let result = [];

        if (window.history.length > 1) {
            result.push(Util.buttonBack());
        }


        data.forEach(function (button) {
            result.push({
                text: button.text,
                icon: (button.icon) ? button.icon : '',
                cls: (button.cls) ? ' btn-sm animated fadeIn ' + button.cls : 'btn-sm btn-default animated fadeIn',
                visible: (button.visible !== undefined) ? button.visible : true,
                action: button.action,
                id: (button.id) ? button.id : Math.random()
            })
        });

        return result;
    }

    public static getRandomInt(min, max): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static getAnimation(): string {
        let a = ['fadeIn', 'fadeInDown', 'fadeInUp', 'fadeInLeft', 'fadeInRight'];
        return a[Util.getRandomInt(0, 4)];
    }

    static addDocument(cmd: string, item: any): void {
        switch (cmd) {
            case 'add-item-availability':
                $('#add-item-availability').data('item', item).modal('show');
                break;
        }
    }

    static beforeDestroy(me: Vue): void {
        $('.tooltip').remove();
        me.$store.dispatch('setBreadcrumbs', {
            items: [],
            page_title: ''
        });
        if (CKEDITOR.instances['introtext']) {
            CKEDITOR.instances['introtext'].destroy();
        }
        if (CKEDITOR.instances['fulltext']) {
            CKEDITOR.instances['fulltext'].destroy();
        }
    }

    static buildMediaObject(selectedFile: any): any {
        return {
            type: 'file',
            tmb: selectedFile.tmb,
            phash: selectedFile.phash,
            hash: selectedFile.hash,
            value: selectedFile.url.toString().replace(window.location.protocol + '//' + window.location.hostname, ''),
            sort: 100,
            data: selectedFile
        }
    }

    static documentUp(): void {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
    }
}
