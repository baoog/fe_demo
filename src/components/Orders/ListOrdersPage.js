import React, {Component} from 'react'
import { PageHeader } from 'antd';
import 'antd/dist/antd.css';
import {TabView,TabPanel} from 'primereact/tabview';
import {Card} from 'primereact/card';
import * as Const from '../../core/constants'
import { ItemOrderPending } from './ListOrderItem/ItemOrderPending';
import { ItemOrderPick } from './ListOrderItem/ItemOrderPick';
import { ItemOrderDelivery } from './ListOrderItem/ItemOrderDelivery';
import { ItemOrderReturn } from './ListOrderItem/ItemOrderReturn';

const routes= Const.Route_ListOrders

export class ListOrder extends Component {
    constructor(props){
        super(props)
        this.state={
            activeIndex:0,
            warehouse: Const.getWarehouse()
        }
    }
    componentDidUpdate(){
        var warehouse = JSON.parse(localStorage.getItem("warehouse"))
        console.log(warehouse)
    }
    render(){
        return(
            <div>
            <PageHeader className="site-page-header" breadcrumb={{routes}}/>
            <Card title="Danh sách đơn hàng">
            <TabView activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({activeIndex: e.index})}>
                        <TabPanel header="Đơn hàng chưa xử lý">
                            <ItemOrderPending/>
                        </TabPanel>
                        <TabPanel header="Đơn hàng LẤY">
                            <ItemOrderPick/>
                        </TabPanel>
                        <TabPanel header="Đơn hàng GIAO">
                            <ItemOrderDelivery/>
                        </TabPanel>
                        <TabPanel header="Đơn hàng TRẢ">
                            <ItemOrderReturn/>
                        </TabPanel>
                    </TabView>
                    </Card>
            </div>
        )
    }
}