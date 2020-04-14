import axios from 'axios';
import * as Const from '../core/constants';

export function GetInfoUser(token){
    return axios({
        url: Const.url_oms + Const.user_info,
        method: "GET",
        mode : 'no-cors',
        headers:{
            'Content-Type':"application/json",
            'Authorization': `Bearer ${token}`
        }
    })
}

export function GetShipperAvailable(){
    return axios({
        url: Const.url_oms + Const.shipper_any,
        method: "GET",
        mode : 'no-cors',
        params:{
            q: {
                available: true
            }
        },
        headers:{
            'Content-Type':"application/json",
            'Authorization': `Bearer ${Const.token}`
        }
    })
}