import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { HashRouter } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import {Provider} from 'react-redux'
import {reducer} from './store/reducer/root'
import * as redux from 'redux'
import thunk from 'redux-thunk';
// import {store} from './store/store'

export const store = redux.createStore(reducer, redux.applyMiddleware(thunk))
ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <ScrollToTop>
                <App></App>
            </ScrollToTop>
        </HashRouter>
    </Provider>,
    document.getElementById('root')
    )

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();