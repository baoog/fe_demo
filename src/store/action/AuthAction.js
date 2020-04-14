import * as Const from '../../core/constants'
import * as api from '../../service/AuthService'

export const login = user => ({
    type : Const.types.LOGIN,
    user
})

export const login_err = err => ({
    type: Const.types.LOGIN_ERR,
    err
})

export const logout = ()=>({
    type: Const.types.LOGOUT
})

export const actionLogin = user => {
    return dispatch =>{
        return api.LoginService(user).then(res =>{
            if (res.data.status === "OK"){
                dispatch(login(res.data.data[0]))
                localStorage.setItem("user_token",res.data.data[0].token)
            } else {
                dispatch(login_err(res.data.message))
            }
        }).catch(err=>{
            dispatch(login_err(err.name))
            });
    }
}