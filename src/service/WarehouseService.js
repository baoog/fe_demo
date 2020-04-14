import axios from 'axios';
import * as Const from '../core/constants';
import { isUndefined } from 'util';

export function CreateNewWarehouse(name,address){
    return axios({
        url: Const.url_oms + Const.warehouse_any,
        method: "POST",
        headers:{
            'Content-Type':"application/json",
            'Authorization': `Bearer ${Const.token}`
        },
        data:{
            name: name,
            address: address
        }
    })
}

export function GetAllWarehouse(limit,offset){
    return axios({
        url: Const.url_oms + Const.warehouse_all,
        method: "GET",
        headers:{
            'Content-Type':"application/json",
            'Authorization': `Bearer ${Const.token}`
        },
        params:{
            limit: limit,
            offset: offset
        }
    })
}


export function ImportToWarehouse(orders){
    console.log(orders)
    return axios({
        url: Const.url_oms + Const.warehouse_importing,
        method: "POST",
        headers:{
            'Content-Type':"application/json",
            'Authorization': `Bearer ${Const.token}`
        },
        data:{
            orders: orders,
            size: orders.length
        }
    })
}


export function GetWarehouseById(id){
    return axios({
        url: Const.url_oms + Const.warehouse_self,
        method: "GET",
        headers:{
            'Content-Type':"application/json",
            'Authorization': `Bearer ${Const.token}`
        },
        params:{
            q:{
                id: id
            }
        }
    })
}

export function GetTotalWarehouse(){
    return axios({
      url: Const.url_oms + Const.warehouse_total,
      method: "GET"  ,
      headers:{
        Authorization: `Bearer ${Const.token}`
    }
    })
}

export function UpdateArea(areas){
    var wh = JSON.parse(localStorage.getItem("warehouse"))
    return axios({
      url: Const.url_oms + Const.warehouse_area,
      method: "PUT"  ,
      params:{
          q:{
              warehouseId: wh.id
          }
      },
      data:{
        areas: areas
      },
      headers:{
        Authorization: `Bearer ${Const.token}`
    }
    })
}