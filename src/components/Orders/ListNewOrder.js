import React, {Component} from 'react'
import { PageHeader } from 'antd';
import 'antd/dist/antd.css';
import {GetOrdersByStatus, CancelOrder} from '../../service/OrderService'
import {GetAllWarehouse, ImportToWarehouse} from '../../service/WarehouseService'
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Card} from 'primereact/card';
import {Growl} from 'primereact/growl';
import {Button} from 'primereact/button';
import {MultiSelect} from 'primereact/multiselect';
import {Dialog} from 'primereact/dialog';
import '../../layout/listneworders.css'
import * as Const from '../../core/constants'
import { isUndefined, isNullOrUndefined } from 'util';
import { InputText } from 'primereact/inputtext';
const status = "NEW"
const routes= Const.Route_ListNewOrders
var growl = <Growl/>;
export class ListNewOrder extends Component {
    constructor(props){
        super(props)
        this.state={
            activeIndex:0,
            orders:[],
            err: '',
            isLoading: true,
            selectedOrder: null,
            growl: <Growl/>,
            deactiveButton: true,
            showPopupImportWh: false,
            warehouses: null,
            globalFilterWH: null,
            selectionWH: null,
            position: 'top',
            isListWarehouseLoading: false,
            description:"",
            showDialogCancel: false,
        }
    }
    componentDidMount = ()=>{
        GetOrdersByStatus(status, true).then(res=>{
            console.log("bbbbbbbbbbbbbb",res.data)
            this.setState({orders:res.data.data,isLoading: false})
        }).catch(err=>{
            console.log("aaaaaaaaaaaa", err)
            if(!isUndefined(err.response)){
                Const.showError(err.response.data.status, err.response.data.message,this.growl)
            } else {
                Const.showError("Lỗi", err.message,this.growl)
            }  
            this.setState({isLoading: false})             
        })
    }
    renderHeader = ()=>{
        return (   
        <div>    
            Danh sách kho
                <InputText type="search" style={{width: 200, float: "right", marginBottom:30}} onInput={(e) => this.setState({globalFilterWH: e.target.value})}
                placeholder="Search kho" />
        </div>   
        )
    }

    buttons=(data)=>{
        return (
            <div className="content-section implementation button-demo">
                <Button icon="pi pi-download" className="p-button-raised p-button-warning" 
                style={{marginRight: "12px", color:"white"}} tooltip="Import to warehouse" onClick={()=>this.handleImportSingleOrderToWareHouse(data)}/>
                <Button icon="pi pi-times" className="p-button-raised p-button-danger" tooltip="Cancel this order"
                onClick={()=>this.handleShowDialogCancelOrder(data)}/>
            </div>
        );
    }

    componentDidUpdate=(preProps, preState)=>{
        if(preState.selectedOrder !== this.state.selectedOrder)
            this.handleStateDeactiveButton()
    }
    handleImportSingleOrderToWareHouse=(order)=>{
        if (!isNullOrUndefined(order)){
            this.setState({selectedOrder:[order]})
            this.handleImportToWareHouse()
        }
    }
    handleImportToWareHouse = ()=>{
        this.setState({showPopupImportWh:true})
        if(this.state.warehouses === null){
            this.setState({isListWarehouseLoading: true})
            GetAllWarehouse(100,0).then(res=>{
                console.log(res)
                this.setState({warehouses: res.data.data,isListWarehouseLoading: false})
            }).catch(err =>{
                if(!isUndefined(err.response)){
                    Const.showError(err.response.data.status, err.response.data.message,this.growl)
                } else {
                    Const.showError("Lỗi", err.message,this.growl)
                }    
            })
        }        
    }

    handleAutoImport = () =>{

    }
    actionImport = ()=>{
        if (isNullOrUndefined(this.state.selectionWH.id)){
            Const.showError("Lỗi","Vui lòng chọn kho", this.growl)
            return;
        }
        this.state.selectedOrder.forEach(order =>{
            order.warehouseId = this.state.selectionWH.id
        })
        ImportToWarehouse(this.state.selectedOrder).then(res =>{
            if (res.data.status == "OK"){
                Const.showSuccess("Thành công",res.data.message,this.growl)
            }
        }).catch(err => {
            if(!isUndefined(err.response)){
                Const.showError(err.response.data.status, err.response.data.message,this.growl)
            } else {
                Const.showError("Lỗi", err.message,this.growl)
            }
        })
    }
    handleStateDeactiveButton=()=>{
        if(this.state.selectedOrder==null || this.state.selectedOrder.length < 2)
            this.setState({deactiveButton: true})
        else
            this.setState({deactiveButton: false})
    }
    handleSelectionChange = (e)=>{
        this.setState({selectedOrder: e.value});

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
    colOrderId = (e)=>{
        return (
        <a href={`./#/order/management/${e.id}`} tooltip={e.id}>{Const.shortenID(e.id)}</a>
        )
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
        const headerDataTableModal = this.renderHeader()
        const footerDialog = (
            <div>
                <Button label="Import" icon="pi pi-plus" onClick={this.actionImport} />
            </div>
        );
        const footerDialogCancel = <div><Button label="Cancel" onClick={()=>this.setState({showDialogCancel:false})}/>
        <Button label="OK" onClick={this.handleCancelOrder}/></div>
        return(
            <div>
                <Growl ref={(el) => this.growl = el} style={{borderRadius:'50px' }}/>
                <PageHeader className="site-page-header" breadcrumb={{routes}}/>
                    <Card title="List New Orders">
                    <Button label="Import to warehouse" style={{float: "right",marginBottom:"15px",zIndex:'900'}} icon="pi pi-download" iconPos="left" className="p-button-info p-button-raised"
                         disabled={this.state.deactiveButton} onClick={this.handleImportToWareHouse}/>
                    <Button label="Auto import" style={{float: "right",marginBottom:"15px",zIndex:'900', marginRight:"10px"}} icon="pi pi-download" iconPos="left" className="p-button-success p-button-raised"
                        disabled={this.state.deactiveButton} onClick={this.handleAutoImport}/>

                        <DataTable value={this.state.orders} loading={this.state.isLoading} paginator={true} rows={10} 
                        responsive rowsPerPageOptions={[10,25,50]} rowHover selection={this.state.selectedOrder} 
                        metaKeySelection={false} onSelectionChange={this.handleSelectionChange}>
                            <Column selectionMode="multiple" style={{width:'3em'}}/>

                            <Column field="id" header="Order Id" bodyStyle={{textAlign: 'center', overflow: 'auto', width:"3em"}}
                            className="col-overflow" sortable filter filterPlaceholder="Search by ID" 
                            body={this.colOrderId}/>

                            <Column field="sName" header="Người gửi" bodyStyle={{textAlign: 'center', overflow: 'auto',width:"2em"}} 
                            className="col-overflow" sortable filter filterPlaceholder="Tên người gửi"/>

                            <Column field={this.addressSender} header="Địa chỉ gửi"  bodyStyle={{textAlign: 'center', overflow: 'visible'}}
                            className="col-overflow" sortable filter filterPlaceholder="Địa chỉ gửi"/>

                            <Column field="rName" header="Người nhận" bodyStyle={{textAlign: 'center', overflow: 'auto',width:"2em"}} 
                            className="col-overflow" sortable filter filterPlaceholder="Tên người nhận"/>

                            <Column field={this.addressReceiver} header="Địa chỉ gửi"  bodyStyle={{textAlign: 'center', overflow: 'auto'}}
                            className="col-overflow" sortable filter filterPlaceholder="Địa chỉ nhận"/>

                            <Column field="type" header="Type" bodyStyle={{textAlign: 'center', overflow: 'visible'}} />

                            <Column field="status" header="Status" bodyStyle={{textAlign: 'center', overflow: 'visible'}} />

                            <Column field="createdTime" sortable filter header="Created Time" 
                            className="col-overflow" bodyStyle={{textAlign: 'center', overflow: 'auto'}} />

                            <Column header="Action" body={this.buttons} bodyStyle={{textAlign: 'center'}}/>
                        </DataTable>
                    </Card>
                <Dialog visible={this.state.showPopupImportWh} style={{width: '50vw'}} blockScroll modal={true} 
                onHide={()=>this.setState({showPopupImportWh: false})} position={this.state.position} header="Danh sách kho"
                footer={footerDialog}>
                    
                    <DataTable value={this.state.warehouses} globalFilter={this.state.globalFilterWH} header={headerDataTableModal}
                    selection={this.state.selectionWH} onSelectionChange={e => this.setState({selectionWH: e.value})}
                    responsive className="data-list-warehouse" loading={this.state.isListWarehouseLoading}>
                        <Column selectionMode="single" style={{width:'3em'}}/>
                        <Column sortable filter field="name" header="Name"/>
                        <Column sortable filter field="address.city.name" header="Thành phố"/>
                        <Column sortable filter field="address.district.name" header="Quận/Huyện"/>
                        <Column sortable filter field="address.ward.name" header="Phường/Xã"/>
                        <Column sortable filter field="address.street.name" header="Đường"/>
                        <Column sortable filter field="address.number" header="Số"/>
                    </DataTable>
                </Dialog>
                <Dialog header="Hủy đơn hàng" visible={this.state.showDialogCancel} footer={footerDialogCancel}
                    onHide={()=>this.setState({showDialogCancel: false})} style={{width:"40vw"}}>
                    <p>Bạn có chắc muốn hủy đơn hàng ?</p>
                    <InputText value={this.state.description} onChange={(e)=>this.setState({description:e.value})} 
                    placeholder="Lý do hủy đơn" style={{width:200}}/>
                </Dialog>
            </div>
        )
    }
}