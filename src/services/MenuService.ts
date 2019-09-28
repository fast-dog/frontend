import axios, {AxiosResponse, AxiosPromise} from 'axios';
import {Util} from '@/Util';


declare let $: any;


export class MenuService {

    static menu(): AxiosPromise {
        return axios.get(Util.httpRoot + 'menu');
    }

    static getItems(): AxiosPromise {
        return axios.get(Util.httpRoot + 'menu/roots');
    }

    static getMenuItems(params: any = {include_templates: 'Y'}): AxiosPromise {
        return axios.get(Util.httpRoot + 'menu/roots', params);
    }

    static itemRoot(id: any): AxiosPromise {
        return axios.get(Util.httpRoot + 'menu-root/' + id);
    }

    static itemNavigation(id: any): AxiosPromise {
        return axios.get(Util.httpRoot + 'menu/' + id);
    }

    static getPage(id: any): AxiosPromise {
        return axios.get(Util.httpRoot + 'page/' + id);
    }

    static itemTree(id: any): AxiosPromise {
        return axios.get(Util.httpRoot + 'menu-tree/' + id);
    }

    static getInfo(): AxiosPromise {
        return axios.get(Util.httpRoot + 'menu/admin-info');
    }

    static getDiagnostic(period: string = 'total'): AxiosPromise {
        return axios.get(Util.httpRoot + 'menu/diagnostic?period=' + period);
    }

    static getCheck(step: number = 1): AxiosPromise {
        return axios.get(Util.httpRoot + 'menu/check-route?step=' + step);
    }
}
