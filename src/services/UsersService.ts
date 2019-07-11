import axios, {AxiosResponse, AxiosPromise} from 'axios';
import {Util} from '@/Util';

export class UsersService {

    static getUser(id: any): AxiosPromise {
        return axios.get(Util.httpRoot + 'users/' + id)
    }

    static getUserRating(id: any): AxiosPromise {
        return axios.get(Util.httpRoot + 'users/rating/' + id)
    }

    static getInfo(): AxiosPromise {
        return axios.get(Util.httpRoot + 'users/admin-info')
    }

    static getMailing(id: any): AxiosPromise {
        return axios.get(Util.httpRoot + 'users/mailing/' + id)
    }

    static getMailingTemplate(id: any): AxiosPromise {
        return axios.get(Util.httpRoot + 'users/mailing/template/' + id)
    }

    static getMailingProcessList(): AxiosPromise {
        return axios.get(Util.httpRoot + 'users/mailing/process')
    }
}