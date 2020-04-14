import {connect} from 'react-redux';
import * as actions from '../store/action/AuthAction';
import {LoginPage} from '../components/LoginPage';

const mapDispatchToProps = (dispatch) => {
    return {
       loginDispatch: user =>{
           dispatch(actions.actionLogin(user))
       }
    }   
}

   const mapStateToProps = (state) => {
       console.log(state)
    return {
        user_token: state.login.token,
        user_name:  state.login.username,
        login_error: state.login.err,
        loading: false
    }
}
   export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);