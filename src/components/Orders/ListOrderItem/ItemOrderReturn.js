import React, {Component} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {GetOrdersByType} from '../../../service/OrderService'
import {Growl} from 'primereact/growl';

import * as Const from '../../../core/constants'
import { isUndefined } from 'util';
const Type = "RETURN"
var   growl= <Growl/>
export class ItemOrderReturn extends Component{
    constructor(){
        super()
        this.state ={
            orders:[],
            err: '',
            isLoading: true,
        }
    }
    
    componentDidMount(){
        GetOrdersByType(Type,false).then(res=>{
            console.log(res.data)
            this.setState({orders:res.data.data,isLoading: false})
        }).catch(err=>{
            // if (!isUndefined(err.response))
            //     Const.showError(err.name,err.response.data.message,this.growl)
            // else
            //     Const.showError(err.name,err.message,this.growl)    
            this.setState({isLoading: false})             
            
        })
    }
    render(){
                return(
                    <div>
                        <Growl ref={(el) => this.growl= el} style={{borderRadius:'50px' }}/>
                        <DataTable value={this.state.orders} loading={this.state.isLoading}
                        style={{ textAlign: "center"}} emptyMessage="No customers found">
                            <Column field="id" header="Order Id" bodyStyle={{textAlign: 'center', overflow: 'auto', width:"3em"}}
                            className="col-overflow" sortable filter filterPlaceholder="Search by ID"/>
                            <Column field="creatorId" header="Creator Id" bodyStyle={{textAlign: 'center', overflow: 'auto'}} 
                            className="col-overflow" sortable filter filterPlaceholder="Creator ID"/>
                            <Column field="type" header="Type" bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
                            <Column field="status" header="Status" bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
                            <Column field="createdTime" sortable filter header="Created Time" bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
                        </DataTable>
                    </div>
        )
    }
}