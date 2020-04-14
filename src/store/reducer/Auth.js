import * as Const from '../../core/constants'

const initialState = {
    token: '',
    username: '',
    err: ''
}

export default function loginReducer(state = initialState, action) {
    switch (action.type) {
      case Const.types.LOGIN: {
        return {
          ...state,
          token: action.user.token,
          username: action.user.username,
          err: null
        };
      }
      
      case Const.types.LOGIN_ERR: {
        return { ...state, err: action.err.err };
      }
      case Const.types.LOGOUT: {
        return {
          token: null,
          username: null,
          err: null,
        };
      }
      default:
        return state;
    }
  }