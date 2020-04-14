import React, {Component} from 'react'
import {Card} from 'primereact/card';
import {Growl} from 'primereact/growl';
import * as Const from '../../core/constants'
import { PageHeader } from 'antd';
import { Form, Input } from 'antd';
import 'antd/dist/antd.css';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Steps} from 'primereact/steps';
import { isUndefined, isNullOrUndefined, isObject } from 'util';
import { GetWarehouseById } from '../../service/WarehouseService';
import { GetListBaskets } from '../../service/BasketService';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import {DataTable} from 'primereact/datatable';
import { GetShipperAvailable } from '../../service/UserService';
import { Column } from 'primereact/column';
import {PickList} from 'primereact/picklist';
import {GetOrdersByBasketIdNotOnTrip} from '../../service/OrderService'
import {CreateANewTrip} from '../../service/TripService'
import {Messages} from 'primereact/messages';
import {Message} from 'primereact/message';
const items = [
    {label: 'Chọn kho'},
    {label: 'Thông tin cơ bản'},
    {label: 'Chọn order'},
    {label: 'Trạng thái'}
];
const typeTrip= [
    {label:"Pick", value:"PICK"},
    {label:"Delivery", value:"DELIVERY"},
    {label:"Return", value:"RETURN"}
]
const routes = Const.Route_CreateNewTrip
export class CreateNewTrip extends Component {
    constructor(props){
        super(props)
        this.state= {
            selectedWarehouse: null,
            selectedBasket: [],
            orders:[],
            selectedOrders:[],
            baskets: [],
            activeIndex: 0,
            type: "",
            shippers: null,
            selectedShipper:null,
            showListShipper: false,
            loadingListShipper: true,
            newTrip: [],
            iconStatusCreate: "pi pi-spin pi-spinner",
            textStatusCreate: " Đang khởi tạo"
        }

    }
    componentDidUpdate(preProp,preState){
        var warehouse = JSON.parse(localStorage.getItem("warehouse"))
        if (warehouse.id != this.state.selectedWarehouse){
            console.log("a")
            this.setState({selectedWarehouse: warehouse.id})
        }
    }
    componentDidMount=()=>{
        console.log("đi mound ",this.state.selectedShipper)
        if(isNullOrUndefined(this.state.selectedWarehouse) && !isNullOrUndefined(localStorage.getItem("warehouse"))){
            var wh = JSON.parse(localStorage.getItem("warehouse"))
            this.setState({selectedWarehouse: wh.id})
        }
    }
    searchWarehouse = ()=>{
        
        if(!isNullOrUndefined(this.state.selectedWarehouse)){
            this.setState(
                {
                    iconBtnVerify: "pi pi-spin pi-refresh",
                    classBtnVerify: "p-button-raised p-button-warning"
                }
            )
            GetWarehouseById(this.state.selectedWarehouse).then(res =>{
                if(res.data.status == "OK"){
                    GetListBaskets(this.state.selectedWarehouse).then(res =>{
                        if(res.data.status == "OK"){
                            this.setState({baskets: res.data.data,activeIndex: 1},()=>{
                                this.setState(
                                    {
                                        iconBtnVerify: "pi pi-check",
                                        classBtnVerify: "p-button-raised p-button-success"
                                    }
                                )
                            })
                        }
                    }).catch(err=>{
                        this.setState(
                            {
                                iconBtnVerify: "pi pi-fw pi-times",
                                classBtnVerify: "p-button-raised p-button-danger"
                            }
                        )
                    })
                }
            }).catch(err => {
                this.setState(
                    {
                        iconBtnVerify: "pi pi-fw pi-times",
                        classBtnVerify: "p-button-raised p-button-danger"
                    }
                )
                if (!isUndefined(err.response))
                    Const.showError(err.name,err.response.data.message,this.growl)
                else
                    Const.showError(err.name,err.message,this.growl)    
            })
        }
    }
    handleNextStep=(e)=>{
        const {selectedWarehouse, selectedBasket, selectedShipper, type} = this.state
        if(type == "" || selectedWarehouse == null || selectedBasket.length == 0 || selectedShipper == null){
            Const.showError("Lỗi","Bạn phải nhập đầy đủ thông tin", this.growl)
            return;
        }
            GetOrdersByBasketIdNotOnTrip(this.state.selectedBasket.ID).then(res =>{
                if(res.data.status == "OK"){
                    this.setState({orders: res.data.data, activeIndex:2})
                }
            }).catch(err =>{
                if (!isUndefined(err.response))
                    Const.showError(err.name,err.response.data.message,this.growl)
                else
                    Const.showError(err.name,err.message,this.growl)    
                    this.setState({orders: [], activeIndex:2})
            })
    }
    orderTemp = (e)=>{
        return(
            <div>
                <b>{e.id}</b>
            </div>
        )
    }
    handleShowDialog=(e)=>{
        this.setState({showListShipper: true})
        GetShipperAvailable().then(res =>{
            if(res.data.status == "OK"){
                this.setState({shippers: res.data.data,loadingListShipper: false})
            }
        })
    }
    dialogFooter=()=>{
        return(
            <div>
                <Button label="Select" onClick={this.handleSelectShipper}/>
            </div>
        )
    }
    handleCreateTrip=()=>{
        const {selectedBasket, selectedOrders, selectedShipper, selectedWarehouse, type} = this.state
        
        CreateANewTrip(selectedOrders, selectedShipper.id, type, selectedBasket.ID, selectedWarehouse).then(res=>{
            if(res.data.status == "OK"){
                this.setState({newTrip: res.data.data[0], iconStatusCreate: "pi pi-check",activeIndex:3})
                this.messages.show([
                {sticky: true, severity: 'success', summary: 'Created trip', detail: `Trip submitted. ID trip: ${this.state.newTrip.ID}` },
                {sticky: true, severity: 'warn', summary: 'Sent to shipper', detail: 'Waiting for reply'}]);
                 Const.showSuccess("Thành công","Tạo chuyến đi thành công",this.growl)
            }
        }).catch(err =>{
            if (!isUndefined(err.response)){
                Const.showError(err.name,err.response.data.message,this.growl)
            } else {
                Const.showError(err.name,err.message,this.growl)  
            }
            this.setState({newTrip: [], iconStatusCreate: "pi pi-times", activeIndex: 2})
            
        })
    }
    handleSelectShipper = ()=>{
        if(isNullOrUndefined(this.state.selectedShipper) ){
            Const.showError("Lỗi", "Bạn phải chọn shipper", this.growl)
            return;
        }
        this.setState({showListShipper: false})
    }
    handleOnChangePicking=(e)=>{
        this.setState({orders: e.source, selectedOrders: e.target})
    }
    render(){
        var a = isNullOrUndefined(this.messages) ? <Messages ref={(el) => this.messages = el} closable={false}></Messages>: ""
        const {selectedShipper} = this.state;
        console.log(selectedShipper)
        return(
            <div>
                <Growl ref={(el) => this.growl= el} style={{borderRadius:'50px' }}/>
                <PageHeader className="site-page-header" breadcrumb={{routes}}/>
                <Card title="Khởi tạo chuyến đi">
                    <Steps model={items} activeIndex={this.state.activeIndex}/>
                    {(this.state.activeIndex == 0) ? 
                    <Form labelCol={{span: 10}}  wrapperCol={{ span: 14 }} style={{marginTop: 20}}>
                        <Input.Group compact>
                            <Form.Item label="Mã kho">
                                <InputText placeholder="Mã kho" value={this.state.selectedWarehouse} style={{width: 300}}
                                readOnly/>
                            </Form.Item>
                            <Form.Item>
                               <Button label="Verify" className={this.state.classBtnVerify} style={{marginLeft:120}}
                                icon={this.state.iconBtnVerify} iconPos="left" onClick={this.searchWarehouse}/>
                            </Form.Item>
                        </Input.Group>
                    </Form>
                    : this.state.activeIndex == 1 ?
                    <Form labelCol={{span: 3}}  wrapperCol={{ span: 0 }} style={{marginTop: 20}}>
                        <div className="p-grid p-justify-between">
                            <div className="p-col-5">
                                <Form.Item label="Kho">
                                    <InputText value={this.state.selectedWarehouse} readOnly style={{width: 300}}/>
                                </Form.Item>
                            </div>
                            <div className="p-col-6">
                                <Form.Item label="Basket" rules={[{ required: true, message: 'Loại rỗ bắt buộc phải nhập' }]}>
                                    <Dropdown options={this.state.baskets} style={{width: 300}}
                                    onChange={(e)=> this.setState({selectedBasket: e.target.value})} value={this.state.selectedBasket}/>
                                </Form.Item>
                            </div>
                        </div>
                        <div className="p-grid p-justify-between">
                            <div className="p-col-5">
                                <Form.Item label="Loại" rules={[{ required: true, message: 'Loại bắt buộc phải nhập' }]}>
                                <Dropdown options={typeTrip} style={{width: 300}} onChange={e => this.setState({type: e.target.value})}
                                value={this.state.type}/>
                                </Form.Item>
                            </div>
                            <div className="p-col-6">
                                <Form.Item label="Shipper" rules={[{ required: true, message: 'Bạn phải chọn shipper' }]}>
                                {!isNullOrUndefined(selectedShipper) ? <img src={this.state.selectedShipper.avatar} height="45" style={{borderRadius: "100%"}}/>
                            :
                                <Button icon="pi pi-plus" iconPos="left" onClick={this.handleShowDialog}
                                    className="p-button p-button-secondary p-button-rounded"/>}
                                </Form.Item>
                            </div>
                            <div className="p-col-12">
                                <Button label="Next" style={{float:"right", marginLeft: 20, marginRight: 50}}
                                onClick={this.handleNextStep}/>
                                <Button label="Cancel" style={{float:"right"}} className="p-button-secondary"
                                onClick={e=>this.setState({activeIndex:0})}/>
                            </div>
                            
                        </div>
                    </Form>
                    : this.state.activeIndex == 2 ? 
                        <Form labelCol={{span: 7}}>
                            <div className="p-grid p-justify-between">
                                <div className="p-col-12">
                                    <Form.Item>
                                        <PickList source={this.state.orders} target={this.state.selectedOrders}
                                        onChange={this.handleOnChangePicking}
                                        style={{margin: "10px auto"}} sourceHeader="Available" targetHeader="Selected" responsive={true}
                                        sourceStyle={{height: '300px'}} targetStyle={{height: '300px'}} itemTemplate={this.orderTemp} />
                                    </Form.Item>
                                </div>
                                <div className="p-col-12">
                                <Button label="Finish" style={{float:"right", marginLeft: 20, marginRight: 50}}
                                onClick={this.handleCreateTrip}/>
                                <Button label="Cancel" style={{float:"right"}} className="p-button-secondary"
                                onClick={e=>this.setState({activeIndex:0})}/>
                            </div>
                            </div>
                        </Form>
                :<div >
                <div style={{paddingBottom:"20px"}}><Messages ref={(el) => this.messages = el} closable={false}></Messages></div>
            </div>}
                </Card>
                <Dialog header="Danh sách shipper" visible={this.state.showListShipper} footer={this.dialogFooter()}
                style={{width: '50vw'}} modal={true} onHide={() => this.setState({showListShipper: false})}>
                    <DataTable value={this.state.shippers} ref={(el) => this.dt = el} loading={this.state.loadingListShipper}
                    paginator row={10} selection={this.state.selectedShipper} 
                    onSelectionChange={(e)=>this.setState({selectedShipper: e.value})}>
                        <Column selectionMode="single"/>
                        <Column field="id" header="ID" body={(e)=> (Const.shortenID(e.id))}/>
                        <Column field="username" header="Username"/>
                        <Column field="phoneNumber" header="Phone number"/>
                    </DataTable>
                </Dialog>
            </div>
        )
    }
}