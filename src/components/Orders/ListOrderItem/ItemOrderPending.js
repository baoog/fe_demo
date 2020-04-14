import React, {Component} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {GetOrdersByStatus, CancelOrder} from '../../../service/OrderService'
import {Growl} from 'primereact/growl';
import {Button} from 'primereact/button';
import {Menu} from 'primereact/menu';

import {SelectButton} from 'primereact/selectbutton';
import * as Const from '../../../core/constants'
import { isUndefined, isNullOrUndefined } from 'util';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
const status = "PENDING"
var growl= <Growl/>
export class ItemOrderPending extends Component{
    constructor(){
        super()
        this.state ={
            orders:[],
            err: '',
            isLoading: true,
            showDialogCancel: false,
            selectedOrder:null,
            description:"",
            warehouse : JSON.parse(localStorage.getItem("warehouse"))
        }
    }
    addressReceiver = (e)=>{
        if (!isUndefined(e.rAddress)) {
            var numb = !isUndefined(e.rAddress.number) ? e.rAddress.number+", " : ""
            return (
            numb+
            e.rAddress.street.prefix+" "+e.rAddress.street.name+" "+
            e.rAddress.ward.prefix+" "+e.rAddress.ward.name+", " +
            e.rAddress.district.name+" "+
            e.rAddress.city.name)
        } else return " "

    }


    addressSender=(e)=>{
        if (!isUndefined(e.sAddress)) {
            var numb = !isUndefined(e.sAddress.number) ? e.sAddress.number+", " : ""
            return (
            numb+
            e.sAddress.street.prefix+" "+e.sAddress.street.name+" "+
            e.sAddress.ward.prefix+" "+e.sAddress.ward.name+", " +
            e.sAddress.district.name+" "+
            e.sAddress.city.name)
        } else return " "
    }

    componentDidUpdate(preProp,preState){
        var warehouse = JSON.parse(localStorage.getItem("warehouse"))
        if (warehouse.id !== this.state.warehouse.id){
            console.log("AAA")
            this.setState({warehouse: warehouse,isLoading: true},()=>{
                GetOrdersByStatus(status, true).then(res=>{
                    this.setState({orders:res.data.data,isLoading: false, warehouse: warehouse})
                }).catch(err=>{
    
                    this.setState({isLoading: false})             
                })
            })
        }
    }

    async componentDidMount(){
        var warehouse = JSON.parse(localStorage.getItem("warehouse"))
        if (this.state.orders.length == 0 || warehouse.id != this.state.warehouse.id)
            await GetOrdersByStatus(status, true).then(res=>{
                this.setState({orders:res.data.data,isLoading: false, warehouse: warehouse})
            }).catch(err=>{
                this.setState({isLoading: false,orders:[]}) 
                if (!isNullOrUndefined(err.response)){
                }
            })
    }
    buttons=(event)=>{
        return (
            <div className="content-section implementation button-demo">
                <Button icon="pi pi-times" className="p-button-raised p-button-danger" tooltip="Cancel this order"
                onClick={()=>this.handleShowDialogCancelOrder(event)}/>
            </div>
        );
    }
    handleShowDialogCancelOrder=(e)=>{
        console.log(e.id)
        this.setState({showDialogCancel:true, selectedOrder:e})
    }
    handleCancelOrder=()=>{
        if(this.state.description==""){
            Const.showError("Lỗi","Bạn phải điền lý do", this.growl)
            return;
        }
        Const.showWarning("Thông báo","Đang tiến hành hủy đơn hàng",this.growl)
        CancelOrder(this.state.selectedOrder, this.state.description).then(res =>{
            if(res.data.status == "OK")
                Const.showSuccess("Thành công","Đã hủy đơn hàng thành công", this.growl)
        }).then(res=>{
            this.setState({isLoading:true,showDialogCancel:false},()=>{
                GetOrdersByStatus(status, true).then(res=>{
                    this.setState({orders:res.data.data,isLoading: false})
                }).catch(err=>{
        
                    this.setState({isLoading: false})             
                })
            })
        }).catch(err=>{
            if (!isUndefined(err.response))
            Const.showError(err.name,err.response.data.message,this.growl)
        else
            Const.showError(err.name,err.message,this.growl)   
        })
    }
    render(){
        const footerDialog = <div><Button label="Cancel" onClick={()=>this.setState({showDialogCancel:false})}/>
        <Button label="OK" onClick={this.handleCancelOrder}/>
        </div>
            return(
                <div>
                    <Growl ref={(el) => this.growl= el} styled={{borderRadius:'50px' }}/>
                    <DataTable value={this.state.orders} loading={this.state.isLoading} emptyMessage="Không có đơn hàng" 
                    style={{ textAlign: "center", overflow:"auto"}} responsive paginator >
                        <Column field="id" header="Order Id" bodyStyle={{textAlign: 'center', overflow: 'auto', width:"3em"}}
                        className="col-overflow" sortable filter filterPlaceholder="Search by ID" body={(e)=> (<a href={`/#/order/management/${e.id}`}>{Const.shortenID(e.id)}</a>)} />
                        <Column field="creatorId" header="Creator Id" bodyStyle={{textAlign: 'center', overflow: 'auto'}} 
                        className="col-overflow" sortable filter filterPlaceholder="Creator ID"/>
                        <Column field="status" header="Status" bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
                        <Column field="warehouseId" header="Warehouse ID" bodyStyle={{textAlign: 'center', overflow: 'auto'}} className="col-overflow" 
                        sortable filter filterPlaceholder="Search by ID" />
                        <Column field={this.addressSender} header="Địa chỉ gửi"  bodyStyle={{textAlign: 'center', overflow: 'auto',width: 50}}
                            className="col-overflow" sortable/>
                        <Column field={this.addressReceiver} header="Địa chỉ nhận"  bodyStyle={{textAlign: 'center', overflow: 'auto',width: 50}}
                            className="col-overflow" sortable/>
                        <Column field="shipCOD" header="Ship COD" bodyStyle={{textAlign: 'center', overflow: 'visible'}} 
                        sortable filter filterPlaceholder="Ship COD"/>
                        <Column field="expectedDD" header="Expected Date"  bodyStyle={{textAlign: 'center', overflow: 'visible'}}
                            className="col-overflow" sortable />
                        <Column field="createdTime" sortable header="Created Time" 
                        className="col-overflow" bodyStyle={{textAlign: 'center', overflow: 'auto'}} />
                        <Column header="Action" body={this.buttons} bodyStyle={{textAlign: 'center'}}/>
                    </DataTable>
                    <Dialog header="Hủy đơn hàng" visible={this.state.showDialogCancel} footer={footerDialog}
                    onHide={()=>this.setState({showDialogCancel: false})} style={{width:"40vw"}}>
                    <p>Bạn có chắc muốn hủy đơn hàng ?</p>
                    <InputText value={this.state.description} onChange={(e)=>this.setState({description:e.value})} placeholder="Lý do hủy đơn"/>
                </Dialog>
                </div>
                
        )
    }
}