import axios from 'axios';
import * as Const from '../core/constants';
import { isUndefined } from 'util';

export function GetCities(){
    return axios({
        url: Const.url_oms + Const.city_all,
        method: "GET",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        }
    })
}

export function GetDistrictByCityCode(cityCode,limit){
    return axios({
        url: Const.url_oms + Const.districts_any,
        method: "GET",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        params:{
            q:{
                cityId: cityCode,
            },                
            limit: limit
        }
    })
}

export function GetWards(distCode,limit){
    return axios({
        url: Const.url_oms + Const.wards_any,
        method: "GET",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        params:{
            q:{
                districtId: distCode
            },                
            limit: limit
        }
    })
}


export function GetStreetByName(distCode,name,limit){
    return axios({
        url: Const.url_oms + Const.streets_any,
        method: "GET",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        params:{
            q:{
                name: name,
                districtId: distCode
            },                
            limit: limit
        }
    })
}