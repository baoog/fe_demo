import axios from'axios'
import * as Const from '../core/constants'
import { isUndefined, isNullOrUndefined } from 'util';


export function GetOrdersById(id, callBms){
    return axios({
        url:  Const.url_oms + Const.orders_by_id,
        method: "GET",
        params:{
            callBms: callBms,
            q:{
                id: id
            }
        },
        headers:{
            Authorization: `Bearer ${Const.token}`
        }
    })
}

export function GetOrdersByStatus(status, callBms){
    var warehouse = status == "NEW" ? [{id:""}] : JSON.parse(localStorage.getItem("warehouse"));
    return axios({
        url: Const.url_oms + Const.orders_by_status,
        method: "GET",
        params:{
            limit: '100',
            callBms: callBms,
            q:{
                status:status,
                warehouseId: warehouse.id
            }
        },
        headers:{
            Authorization: `Bearer ${Const.token}`
        }
    })
}

export function GetOrdersByType(type, callBms){
    var warehouse = isNullOrUndefined(localStorage.getItem("warehouse")) ? [{id:""}] : JSON.parse(localStorage.getItem("warehouse"));
    return axios({
        url: Const.url_oms + Const.orders_by_type,
        method: "GET",
        params:{
            limit: '100',
            callBms: callBms,
            q:{
                type:type,
                warehouseId: warehouse.id
            }
        },
        headers:{
            Authorization: `Bearer ${Const.token}`
        }
    })
}

export function GetOrdersByBasketId(id){
    return axios({
        url: Const.url_oms + Const.orders_by_basket_id,
        method: "GET",
        params:{
            limit: '100',
            basketId: id
        },
        headers:{
            Authorization: `Bearer ${Const.token}`
        }
    })
}

export function GetOrdersByBasketIdNotOnTrip(id){
    return axios({
        url: Const.url_oms + Const.orders_by_basket_id_not_on_trip,
        method: "GET",
        params:{
            limit: '100',
            basketId: id
        },
        headers:{
            Authorization: `Bearer ${Const.token}`
        }
    })
}

export function GetTotalOrders(){
    return axios({
      url: Const.url_oms + Const.orders_total,
      method: "GET"  ,
      headers:{
        Authorization: `Bearer ${Const.token}`
    }
    })
}

export function GetTotalOrdersByStatus(status){
    var warehouse = JSON.parse(localStorage.getItem("warehouse"));
    return axios({
      url: Const.url_oms + Const.orders_size_by_status,
      method: "GET"  ,
      params:{
        q:{
            status: status,
            warehouseId: warehouse.id
        }
      },
      headers:{
        Authorization: `Bearer ${Const.token}`
    }
    })
}

export function CancelOrder(order,desc){
    return axios({
        url: Const.url_oms + Const.orders_any,
        method: "PUT",
        params:{
          q:{
              id: order.id
          }
        },
        data:{
            status: "CANCEL",
            description: desc
        },
        headers:{
          Authorization: `Bearer ${Const.token}`
      }
      })
}

export function GetOrdersWillTransit(callBms){
    var warehouse = isNullOrUndefined(localStorage.getItem("warehouse")) ? {id:""} : JSON.parse(localStorage.getItem("warehouse"));
    return axios({
      url: Const.url_oms + Const.orders_will_transit,
      method: "GET"  ,
      params:{
        q:{
            warehouseId: warehouse.id,
        },
        callBms: callBms,
        limit: 100
      },
      headers:{
        Authorization: `Bearer ${Const.token}`
    }
    })
}