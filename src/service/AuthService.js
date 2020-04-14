import axios from 'axios';
import * as Const from '../core/constants';
import { isUndefined } from 'util';

export function LoginService(data){
    return axios({
        method: 'POST',
        url: Const.url_oms + Const.end_point_login,
        data: data,
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        }
    })

}

export function ValidateToken(token){
    return axios({
        method: 'GET',
        mode : 'no-cors',
        headers:{
            'Content-Type':"application/json",
            'Authorization': `Bearer ${token}`
        },
        url: Const.url_oms + Const.check_point
    }).catch(err=>{
        if(!isUndefined(err.response)){
            
            if(err.response.data.message === "Token không hợp lệ."){
                localStorage.removeItem("user_token")
                localStorage.removeItem("avatar")
                localStorage.removeItem("username")
            }
        }
            
        }
    )
}