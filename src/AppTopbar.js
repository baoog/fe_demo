import React, {Component} from 'react';
import {InputText} from 'primereact/inputtext';
import PropTypes from 'prop-types';
import {Menu} from 'primereact/menu';
import { Dropdown } from 'primereact/dropdown';
import {GetAllWarehouse} from './service/WarehouseService'
import { isUndefined, isNullOrUndefined } from 'util';
import * as Const from './core/constants'
import Axios from 'axios';
export class AppTopbar extends Component {
    constructor(){
        super();
        this.state = {
            warehouses:[],
            selectedWarehouse: null
        };
        var menu= <Menu/>
        this.handleGetData = this.handleGetData.bind(this)
    }
    static defaultProps = {
        onToggleMenu: null
    }

    static propTypes = {
        onToggleMenu: PropTypes.func.isRequired
    }

    handleSelection=(e)=>{
        console.log(e)
        this.setState({selectedWarehouse: e.target.value},()=>{
            localStorage.setItem("warehouse",JSON.stringify(e.target.value))
        })
    }

    async componentWillMount(){
        await this.handleGetData()
    }
    async handleGetData(){
        if(this.state.warehouses.length === 0){
            await GetAllWarehouse(100,0).then( async (res)=> {
                await this.setState({warehouses: res.data.data}, async ()=>{
                    if (this.state.selectedWarehouse == null ){
                        if (isNullOrUndefined(localStorage.getItem("warehouse"))){
                            await this.setState({selectedWarehouse: this.state.warehouses[0]}, async ()=>{
                                await localStorage.setItem("warehouse",JSON.stringify(this.state.selectedWarehouse))
                            })
                        }
                        else
                            await this.setState({selectedWarehouse: JSON.parse(localStorage.getItem("warehouse"))})
                    }
                })                
            }).catch(err => console.log(err))
        }
    }
    render() {
        const items= [
            {
                label: 'Options',icon:"pi pi-fw pi-cog"
            },
            {
                label: 'Logout',icon:"pi pi-fw pi-power-off"
            }
        ]
        return (
            <div>
                <div className="layout-topbar clearfix">
                    <button className="p-link layout-menu-button" onClick={this.props.onToggleMenu}>
                        <span className="pi pi-bars"/>
                    </button>
                    
                    <div className="layout-topbar-icons">
                        <button className="p-link" onClick={e=>this.menu.toggle(e)}>
                            <span className="layout-topbar-item-text">User</span>
                            <span className="layout-topbar-icon pi pi-user"/>
                        </button>
                    </div>
                    <div className="layout-topbar-icons" style={{marginRight:"80px"}}>
                        <span className="layout-topbar-search">
                            <Dropdown options={this.state.warehouses} key="id" optionLabel="name" value={this.state.selectedWarehouse} placeholder="Kho" style={{width:100}}
                            onChange={this.handleSelection}/>
                        </span>
                    </div>
                    
                </div>
                <Menu model={items} popup={true} ref={el => this.menu=el}/>
            </div>

        );
    }
}