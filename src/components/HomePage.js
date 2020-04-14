import React,{Component} from 'react'
import { PageHeader } from 'antd';
import 'antd/dist/antd.css';
import * as Const from '../core/constants'
import { Card } from 'primereact/card';
import '../layout/home.css'
import { GetTotalOrders, GetTotalOrdersByStatus } from '../service/OrderService';
import { GetTotalWarehouse } from '../service/WarehouseService';
import {GetTotalTrip} from '../service/TripService'
import {Chart} from 'primereact/chart';
import {ProgressBar} from 'primereact/progressbar';
const routes= Const.Route_Dashboard
export class HomePage extends Component{
    constructor(props){
        super(props)
        this.state ={
            getData: true,
            process:0,
            sizeOrder: 0,
            sizeTrip: 0,
            sizeWarehouse:0,
            sizeOrderNew: 0,
            sizeOrderPending: 0,
            sizeOrderPick: 0,
            sizeOrderDelivery: 0,
            sizeOrderReturn: 0,
            sizeOrderCanceled: 0
        }
        this.getTotal = this.getTotal.bind(this)
    }

    async componentDidMount(prop,st){
        console.log(st)
        if (this.state.getData){
          await this.getTotal()
          await this.setState({getData: false})
            }
    }
    async getTotal (){
        await GetTotalTrip().then(res=>{
            if(res.data.status == "OK"){
                this.setState({sizeTrip: res.data.data[0].size, process: this.state.process+10})
            }
        })
        await GetTotalOrders().then(res =>{
            if(res.data.status == "OK"){
                this.setState({sizeOrder: res.data.data[0].size, process: this.state.process+10})
            }
        })
        await GetTotalWarehouse().then(res =>{
            if(res.data.status == "OK")
                this.setState({sizeWarehouse: res.data.data[0].size, process: this.state.process+10})
        })
        await GetTotalOrdersByStatus("NEW").then(res =>{
            if(res.data.status == "OK")
                this.setState({sizeOrderNew: res.data.data[0].size, process: this.state.process+10})
        })
        await GetTotalOrdersByStatus("PENDING").then(res =>{
            if(res.data.status == "OK")
                this.setState({sizeOrderPending: res.data.data[0].size, process: this.state.process+10})
        })
        await GetTotalOrdersByStatus("NEW").then(res =>{
            if(res.data.status == "OK")
                this.setState({sizeOrderNew: res.data.data[0].size, process: this.state.process+30})
        })
        await GetTotalOrdersByStatus("CANCELED").then(res =>{
            if(res.data.status == "OK")
                this.setState({sizeOrderCanceled: res.data.data[0].size, process: this.state.process+30})
        })
    }
    render(){
        const data = {
            labels: ['NEW','PENDING','CANCELED'],
            datasets: [
                {
                    data: [this.state.sizeOrderNew, this.state.sizeOrderPending, this.state.sizeOrderCanceled],
                    backgroundColor: [
                        "#FFCE56",
                        "#36A2EB",
                        "#FF6384",
                    ],
                    hoverBackgroundColor: [
                        "#FFCE56",
                        "#36A2EB",
                        "#FF6384",
                    ]
                }]
            };
        return(
            
            <div>
                <PageHeader className="site-page-header" breadcrumb={{routes}}/>
                { this.state.process > 100 ? <div>
                <div className="p-grid">
                    <div className="p-col">
                        <Card style={{padding: 0,}}>
                            <div className="p-grid">
                                <div className="p-col-8">
                                    <p className="p-card-title">Orders</p>
                                    <p className="p-card-subtitle">Number of orders</p>
                                </div>
                                <div className="p-col-4">
                                    <p style={{float: "right", padding: "10px", backgroundColor: "#20d077", 
                                    color:"white", borderRadius:"5px", fontSize:"18px"}}><b>{this.state.sizeOrder}</b></p>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="p-col">
                        <Card style={{padding: 0,}}>
                                <div className="p-grid">
                                    <div className="p-col-8">
                                        <p className="p-card-title">Trips</p>
                                        <p className="p-card-subtitle">Number of trips</p>
                                    </div>
                                    <div className="p-col-4">
                                        <p style={{float: "right", padding: "10px", backgroundColor: "#f9c851", 
                                        color:"white", borderRadius:"5px", fontSize:"18px"}}><b>{this.state.sizeTrip}</b></p>
                                    </div>
                                </div>
                            </Card>
                    </div>
                    <div className="p-col">
                        <Card style={{padding: 0,}}>
                            <div className="p-grid">
                                <div className="p-col-8">
                                    <p className="p-card-title">Warehouses</p>
                                    <p className="p-card-subtitle">Number of warehouses</p>
                                </div>
                                <div className="p-col-4">
                                    <p style={{float: "right", padding: "10px", backgroundColor: "#007be5", 
                                    color:"white", borderRadius:"5px", fontSize:"18px"}}><b>{this.state.sizeWarehouse}</b></p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="p-grid" style={{marginTop: "20px"}}>
                    <div className="p-col-12">
                    <Card >
                        <Chart type="pie" data={data} />
                    </Card>
                    </div>                    
                </div>
                </div>: <ProgressBar value={this.state.process}/>}
            </div>
        )
    }
}