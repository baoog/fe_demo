import axios from'axios'
import * as Const from '../core/constants'
import { isUndefined, isNullOrUndefined } from 'util';

export function CreateNewTransition(warehouseId, packages, destination, shipper){
    return axios({
        url: Const.url_oms + Const.transit_any,
        method: "POST",
        data:{
            destination:destination,
            shipperId: shipper.id,
            packageId:packages.id,
            warehouseId: warehouseId
        },
        headers:{
          Authorization: `Bearer ${Const.token}`
      }
    })
}