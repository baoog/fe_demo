import { isUndefined, isNullOrUndefined } from 'util';
export var token = localStorage.getItem("user_token");
export var warehouse = isNullOrUndefined(localStorage.getItem("warehouse")) ? null :JSON.parse(localStorage.getItem("warehouse"))
export const url_oms = "http://localhost/oms/v1";
export const end_point_login = "/user/login";
export const check_point = "/user/checkpoint";
export const user_info = '/user/self';
export const shipper_any = '/shipper/any';
export const orders_any = '/order/any';
export const orders_by_status = '/order/any_by_status';
export const orders_by_type = '/order/any_by_type';
export const orders_by_id = '/order/self_by_id';
export const orders_by_basket_id = '/order/any_by_basket_id';
export const orders_by_basket_id_not_on_trip = '/order/any_by_basket_id_not_on_trip';
export const orders_total = '/order/total';
export const orders_size_by_status = '/order/size_by_status';
export const city_all = '/cities/all';
export const districts_any = '/districts/any';
export const wards_any = '/wards/any';
export const streets_any = '/streets/any';
export const warehouse_any = '/warehouse/any';
export const warehouse_all = '/warehouse/all';
export const warehouse_self = '/warehouse/self';
export const warehouse_importing = '/warehouse/importing';
export const warehouse_total = '/warehouse/total';
export const warehouse_area = '/warehouse/area';
export const basket_any = '/basket/any';
export const basket_importing = '/basket/importing';
export const basket_remove = '/basket/remove_order';
export const trip_self = '/trip/self'
export const trip_total = '/trip/total'
export const trip_any = '/trip/any'
export const types = {
    LOGIN: "LOGIN",
    LOGIN_ERR: "LOGIN_ERR",
    LOGOUT: "LOGOUT"
}

export const Route_ManagementOrder = [
    {
      path: 'order',
      breadcrumbName: 'Đơn hàng',
    },
    {
      path: 'management',
      breadcrumbName: 'Quản lý đơn hàng',
    },
  ];

export const Route_ListOrders = [
    {
      path: 'order',
      breadcrumbName: 'Đơn hàng',
    },
    {
      path: 'list',
      breadcrumbName: 'Dánh sách đơn hàng',
    },
  ];

  export const Route_ListNewOrders = [
    {
      path: 'order',
      breadcrumbName: 'Đơn hàng',
    },
    {
      path: 'list/new',
      breadcrumbName: 'Danh sách đơn hàng mới',
    },
  ];

  export const Route_Dashboard = [
    {
      path: 'index',
      breadcrumbName: 'Trang chủ',
    }
  ];

  export const Route_CreateWarehouse = [
    {
      path:'warehouse',
      breadcrumbName: 'Kho',
    },
    {
      path: 'warehouse/create',
      breadcrumbName: 'Tạo kho mới',
    }
  ]

  export const Route_ListWarehouses = [
    {
      path:'warehouse',
      breadcrumbName: 'Kho',
    },
    {
      path: 'warehouse/list',
      breadcrumbName: 'Danh sách kho',
    }
  ]

  export const Route_ManagementWarehouses = [
    {
      path:'warehouse',
      breadcrumbName: 'Kho',
    },
    {
      path: 'warehouse/management',
      breadcrumbName: 'Quản lý kho',
    }
  ]

  export const Route_CreateNewTrip = [
    {
      path:'trip',
      breadcrumbName: 'Chuyến đi',
    },
    {
      path: 'trip/create',
      breadcrumbName: 'Khởi tạo chuyến đi',
    }
  ]

  export const Route_ListTrip = [
    {
      path:'trip',
      breadcrumbName: 'Chuyến đi',
    },
    {
      path: 'trip/list',
      breadcrumbName: 'Danh sách chuyến đi',
    }
  ]

  export function showSuccess(title, mess,growl){
        if (growl != null)
            return growl.show({severity: 'success', summary: title, detail: mess} );
        else
            alert(mess)

 }
 
 export function showError(title , mess,growl){
    (growl != null) ? growl.show({severity: 'error', summary: title, detail: mess} ): Alert(mess)
 }
 
 export function showWarning(title , mess,growl){
    (growl != null) ? growl.show({severity: 'warn', summary: title, detail: mess} ): alert(mess);
 }

 export function Alert(mess){
    //  alert(mess);
    //  window.location.href = "./"
 }

 export function shortenID (id){
     if(isNullOrUndefined(id) || id.length == 0) return id
    return  id[0]+id[1]+id[2]+id[3]+"..."+id[id.length-3]+id[id.length-2]+id[id.length-1]
    
 }

 export function getWarehouse(){
     
     return isNullOrUndefined(localStorage.getItem("warehouse")) ? null :JSON.parse(localStorage.getItem("warehouse"))
 }
