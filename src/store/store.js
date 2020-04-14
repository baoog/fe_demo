import {reducer} from './reducer/root'
import * as redux from 'redux'
import thunk from 'redux-thunk';
export const store = redux.createStore(reducer, redux.applyMiddleware(thunk))