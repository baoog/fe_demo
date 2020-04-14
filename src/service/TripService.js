import axios from'axios'
import * as Const from '../core/constants'

export function CreateANewTrip(orders, shipper, tripType, basketId, warehouseId){
    return axios({
        url: Const.url_oms + Const.trip_self,
        method: "POST",
        data:
            {
                type: tripType,
                orders: orders,
                shipper: shipper,
                warehouse: warehouseId,
                basket: basketId
            }
        ,
        headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${Const.token}`
        }
    })
}

export function GetTotalTrip(){
    return axios({
      url: Const.url_oms + Const.trip_total,
      method: "GET"  ,
      headers:{
        Authorization: `Bearer ${Const.token}`
    }
    })
}

export function GetAnyTrip(){
    var warehouse = JSON.parse(localStorage.getItem("warehouse"))
    return axios({
        url: Const.url_oms + Const.trip_any,
        method:"GET",
        params:{
            q:{
                warehouseId: warehouse.id
            }
        },
        headers:{
            Authorization: `Bearer ${Const.token}`
        }
    })
}