import React, {Component} from 'react';
import classNames from 'classnames';
import {AppTopbar} from './AppTopbar';
import {AppFooter} from './AppFooter';
import {AppMenu} from './AppMenu';
import {AppProfile} from './AppProfile';
import {Route, Redirect} from 'react-router-dom';
import LoginPage from './container/AuthContainer';
import {ListOrder} from './components/Orders/ListOrdersPage'
import {ListNewOrder} from './components/Orders/ListNewOrder'
import {OrderManagementPage} from './components/Orders/OrderManagementPage'
import {CreateWarehouse} from './components/Warehouses/CreateWarehousePage'
import {ListWarehousesPage} from './components/Warehouses/ListWarehouses'
import {ManagementWarehousePage} from './components/Warehouses/ManagementWarehouse'
import {ValidateToken} from './service/AuthService'
import {Growl} from 'primereact/growl';
import { isUndefined } from 'util';
import * as Const from './core/constants'

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import './layout/layout.scss';
import './App.scss';
import './layout/menu.css'

import { HomePage } from './components/HomePage';
import { CreateNewTrip } from './components/Trips/CreateNewTrip';
import { ListTripPage } from './components/Trips/ListTrip';
import { CreateNewTransit } from './components/Transitions/CreateNewTransit';

var  growl = <Growl/>;
class App extends Component {

    constructor() {
        super();
        this.state = {
            checkpoint: 0,
            layoutMode: 'static',
            layoutColorMode: 'dark',
            staticMenuInactive: false,
            overlayMenuActive: false,
            mobileMenuActive: false,
            avatar:'',
            username:'',
        };
        this.onWrapperClick = this.onWrapperClick.bind(this);
        this.onToggleMenu = this.onToggleMenu.bind(this);
        this.onSidebarClick = this.onSidebarClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.createMenu();
        this.workerCheckpoint = this.workerCheckpoint.bind(this)
    }
    
    async componentWillMount(){
        if (Const.token === null){
            window.location.href = "#/login"
        }else{
          await  this.setState({avatar:localStorage.getItem("avatar"),username:localStorage.getItem("username")})
            if(this.state.checkpoint == 0){
               await this.workerCheckpoint()
            }
        }
    }

    workerCheckpoint(){
        this.setState({checkpoint:1})
        setTimeout(()=>{
            ValidateToken(Const.token).catch(err=>{
                if (!isUndefined(err.response)){
                    if (err.response.status !== "OK"){
                        Const.showError("Lỗi",err.response.message, this.growl)
                        if (err.response.message == "Token không hợp lệ."){
                            window.location.href = "/#/login"
                        }
                    }
                } else {
                    Const.showError("Lỗi",err.message, this.growl)
                }
            })
            this.workerCheckpoint()
        },60300*this.state.checkpoint)
        
    }

    onWrapperClick(event) {
        if (!this.menuClick) {
            this.setState({
                overlayMenuActive: false,
                mobileMenuActive: false
            });
        }

        this.menuClick = false;
    }

    onToggleMenu(event) {
        this.menuClick = true;

        if (this.isDesktop()) {
            if (this.state.layoutMode === 'overlay') {
                this.setState({
                    overlayMenuActive: !this.state.overlayMenuActive
                });
            }
            else if (this.state.layoutMode === 'static') {
                this.setState({
                    staticMenuInactive: !this.state.staticMenuInactive
                });
            }
        }
        else {
            const mobileMenuActive = this.state.mobileMenuActive;
            this.setState({
                mobileMenuActive: !mobileMenuActive
            });
        }
       
        event.preventDefault();
    }

    onSidebarClick(event) {
        this.menuClick = true;
    }

    onMenuItemClick(event) {
        if(!event.item.items) {
            this.setState({
                overlayMenuActive: false,
                mobileMenuActive: false
            });
        }
    }

    createMenu() {
        this.menu = [
            {label: 'Dashboard', icon: 'pi pi-fw pi-chart-bar', command: () => {window.location = '#/'}},
            {
                label: 'Đơn hàng', icon: 'pi pi-fw pi-file',
                items: [
                    {label: 'Danh sách đơn hàng', icon: 'pi pi-fw pi-list',  to :'/order/list' },
                    {label: 'Quản lý đơn hàng', icon: 'pi pi-fw pi-cog',  to:'/order/management' },
                    {label: 'Đơn hàng mới', icon: 'pi pi-spin pi-spinner',  to:'/order/list/new', badge:'9' }
                ]
            },
            {
                label: 'Kho', icon: 'pi pi-fw pi-home',
                items: [
                    {label: 'Danh sách kho', icon: 'pi pi-fw pi-list' , to:'/warehouse/list'},
                    {label: 'Quản lý kho', icon: 'pi pi-fw pi-cog', to: '/warehouse/management'},
                    {label: 'Tạo kho mới', icon: 'pi pi-fw pi-plus',  to:'/warehouse/create' },
                    {label: 'Export order', icon: 'pi pi-fw pi-upload'}
                ]
            },
            {
                label: 'Chuyến đi', icon: 'pi pi-fw pi-globe', badge: '0',
                items: [
					{label: 'Tạo chuyến đi ', icon: 'pi pi-fw pi-plus', to: '/trip/create'},
					{label: 'Quản lý chuyến đi', icon: 'pi pi-fw pi-cog', to: '/forms'},
					{label: 'Danh sách', icon: 'pi pi-fw pi-list', to: '/trip/list'},
                ]
            },
            {
                label: 'Luân chuyển', icon: 'pi pi-fw pi-directions',
                items: [
                    {label: 'Tạo phiên luân chuyển', icon: 'pi pi-fw pi-plus', to: '/transit/create'},
                    {label: 'Quản lý phiên luân chuyển', icon: 'pi pi-fw pi-cog', to: '/transit/management'},
                    {label: 'Danh sách luân chuyển', icon: 'pi pi-fw pi-list', to: '/transit/list'},
                ]
            },
            {
                label:'Baskets', icon:'pi pi-fw pi-bars',
                items: [
                    {label:"Tạo basket", icon:'pi pi-fw pi-plus'},
                    {label:"Danh sách baskets", icon:'pi pi-fw pi-list'},
                    {label:"Thêm đơn vào basket", icon:'pi pi-fw pi-plus-circle'}
                ]
            }
        ];
    }

    addClass(element, className) {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    removeClass(element, className) {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }
    

    componentDidUpdate() {
        if (this.state.mobileMenuActive)
            this.addClass(document.body, 'body-overflow-hidden');
        else
            this.removeClass(document.body, 'body-overflow-hidden');
    }

    HomeStart(){
        console.log("OK")
    }
    render() {
        const logo = this.state.layoutColorMode === 'dark' ? 'assets/layout/images/logo-white.svg': 'assets/layout/images/logo.svg';
        const wrapperClass = classNames('layout-wrapper', {
            'layout-overlay': this.state.layoutMode === 'overlay',
            'layout-static': this.state.layoutMode === 'static',
            'layout-static-sidebar-inactive': this.state.staticMenuInactive && this.state.layoutMode === 'static',
            'layout-overlay-sidebar-active': this.state.overlayMenuActive && this.state.layoutMode === 'overlay',
            'layout-mobile-sidebar-active': this.state.mobileMenuActive
        });

        const sidebarClassName = classNames("layout-sidebar", {
            'layout-sidebar-dark': this.state.layoutColorMode === 'dark',
            'layout-sidebar-light': this.state.layoutColorMode === 'light'
        });

        if (Const.token === null){
            return(
                <div>
                    <Route path="/login" exact component={LoginPage} />
                    <Route path="/" render= {() => ( <Redirect to={{pathname:   "/login"}} />)} />
                </div>
            );
        } else{
            return (
            <div className={wrapperClass} onClick={this.onWrapperClick}>
                <AppTopbar onToggleMenu={this.onToggleMenu}/>
                <Growl ref={(el) => this.growl= el} style={{borderRadius:'50px' }}/>
                <div ref={(el) => this.sidebar = el} className={sidebarClassName} onClick={this.onSidebarClick}>
                    <div className="layout-logo">
                        {/* <h2 style={{color: 'white'}}><b><i>GHN</i> - Express</b></h2> */}
                        <img width="130px" alt="Logo" src="./logo.png" />
                    </div>
                    <AppProfile Username={this.state.username} Avatar={this.state.avatar} />
                    <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} />
                </div>

                <div className="layout-main">
                    <Route path="/" exact component={HomePage}/>
                    <Route path="/order/list" exact component={ListOrder} />
                    <Route path="/order/list/new" exact component={ListNewOrder} />
                    <Route path="/order/management/" exact component={OrderManagementPage} />
                    <Route path="/order/management/:id" component={OrderManagementPage} />
                    <Route path="/warehouse/create" exact component={CreateWarehouse} />
                    <Route path="/warehouse/list" exact component={ListWarehousesPage} />
                    <Route path={`/warehouse/management/`} exact component={ManagementWarehousePage} />
                    <Route path="/warehouse/management/:id" component={ManagementWarehousePage} />
                    <Route path="/trip/create" component={CreateNewTrip}/>
                    <Route path="/trip/list" component={ListTripPage}/>
                    <Route path="/transit/create" component={CreateNewTransit}/>
                </div>

                <AppFooter />

                <div className="layout-mask"></div>
            </div>
        );
        }
    }
}

export default (App);
// export default connect(mapDispatchToProps)(LoginPage);