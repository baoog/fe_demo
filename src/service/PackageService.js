import axios from'axios'
import * as Const from '../core/constants'
import { isUndefined, isNullOrUndefined } from 'util';

export function CreateNewPackage(orders){
    var warehouse = isNullOrUndefined(localStorage.getItem("warehouse")) ? {id:""} : JSON.parse(localStorage.getItem("warehouse"));
    return axios({
        url: Const.url_oms + Const.package_any,
        method: "POST",
        data:{
            orders: orders,
            warehouseId: warehouse.id
        },
        headers:{
          Authorization: `Bearer ${Const.token}`
      }
    })
}

export function GetListPackage(){
    var warehouse = isNullOrUndefined(localStorage.getItem("warehouse")) ? {id:""} : JSON.parse(localStorage.getItem("warehouse"));
    return axios({
        url: Const.url_oms + Const.package_any_by_warehouse,
        method:"GET",
        params:{
            q:{
                warehouseId: warehouse.id
            },
            limit:100
        },
        headers:{
            Authorization: `Bearer ${Const.token}`
        }
    })
}