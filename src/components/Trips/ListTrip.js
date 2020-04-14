import React, {Component} from 'react'
import {Card} from 'primereact/card';
import {Growl} from 'primereact/growl';
import * as Const from '../../core/constants'
import { PageHeader } from 'antd';
import { Form, Input } from 'antd';
import 'antd/dist/antd.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GetAnyTrip } from '../../service/TripService';

const routes = Const.Route_ListTrip
export class ListTripPage extends Component{
    constructor(props){
        super(props)
        this.state ={
            trips : [],
            warehoues: JSON.parse(localStorage.getItem("warehouse"))
        }
    }
    async componentDidUpdate(){
        
    }
    async componentDidMount(){
        await GetAnyTrip().then(res=>{
            console.log(res.data)
            if(res.data.status == "OK"){
                if(this.state.trips.length == 0){
                    this.setState({trips: res.data.data})
                }
            }
        }).catch(err =>{
            this.setState({trips: []})
        })
    }
    render(){
        return(
            <div>
                <Growl ref={(el) => this.growl= el} style={{borderRadius:'50px' }}/>
                <PageHeader className="site-page-header" breadcrumb={{routes}}/>
                <Card title="Danh sách chuyến đi" style={{padding:"15px 0"}}>
                    <DataTable value={this.state.trips}>
                        <Column field="_id" header="Mã chuyến đi"/>
                        <Column field="type" header="Loại chuyến đi"/>
                    </DataTable>
                </Card>
            </div>
        )
    }
}