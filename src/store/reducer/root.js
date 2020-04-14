import {combineReducers} from 'redux'
import loginReducer from './Auth'

export const reducer = combineReducers({
    login: loginReducer
})