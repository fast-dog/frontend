import axios, {AxiosResponse, AxiosPromise} from 'axios';
import {Util} from '@/Util';

export class UsersService {

    static getUser(id: any): AxiosPromise {
        return axios.get(Util.httpRoot + 'user/' + id)
    }

    static getUserRating(id: any): AxiosPromise {
        return axios.get(Util.httpRoot + 'user/rating/' + id)
    }

    static getInfo(): AxiosPromise {
        return axios.get(Util.httpRoot + 'user/admin-info')
    }

    static getMailing(id: any): AxiosPromise {
        return axios.get(Util.httpRoot + 'user/mailing/' + id)
    }

    static getMailingTemplate(id: any): AxiosPromise {
        return axios.get(Util.httpRoot + 'user/mailing/template/' + id)
    }

    static getMailingProcessList(): AxiosPromise {
        return axios.get(Util.httpRoot + 'user/mailing/process')
    }
}