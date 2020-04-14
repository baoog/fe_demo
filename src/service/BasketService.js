import axios from 'axios';
import * as Const from '../core/constants';
import { isUndefined } from 'util';

export function CreateBasket(label,keyFilter,valueFilter,type,warehouseID){
    return axios({
        url: Const.url_oms + Const.basket_any,
        method: "POST",
        data:{
            label: label,
            warehouseId: warehouseID,
            filter:{
                key: keyFilter,
                value: valueFilter
            },
            size: 0,
            type: type
        },
        headers:{
            Authorization: `Bearer ${Const.token}`
        }
    })
}

export function GetListBaskets(idWarehouse){
    return axios({
        url: Const.url_oms + Const.basket_any,
        method:"GET",
        params:{
            q:{
                warehouseId: idWarehouse
            },
            limit:100
        },
        headers:{
            Authorization: `Bearer ${Const.token}`
        }
    })
}


export function AddToBasket(order,basketId){
    return axios({
        url: Const.url_oms + Const.basket_importing,
        method: "PUT",
        params:{
            q:{
                basketId: basketId
            }
        },
        data:{
            orderId: order.id,
            rAddress: order.rAddress
        },
        headers:{
            Authorization: `Bearer ${Const.token}`
        }
    })
}

export function RemoveOrder(orderId,basketId){
    return axios({
        url: Const.url_oms + Const.basket_remove,
        method: "DELETE",
        params:{
            q:{
                basketId: basketId
            }
        },
        data:{
            id: orderId,
        },
        headers:{
            Authorization: `Bearer ${Const.token}`
        }
    })
}