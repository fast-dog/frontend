/**
 * User: dg
 * Date: 23.10.2017
 * Time: 11:02
 * Project: new_cms.upgrade
 */
import axios, {AxiosResponse, AxiosPromise} from 'axios';

export class CrudService {

    static postPage(url, data): AxiosPromise {
        return axios.post(url, data);
    }

    static postUpdate(url, data): AxiosPromise {
        return axios.post(url, data);
    }

    static post(url, data): AxiosPromise {
        return axios.post(url, data);
    }

    static get(url, data): AxiosPromise {
        return axios.get(url, {data: data});
    }
}