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
import { GetWarehouseById, GetAllWarehouse } from '../../service/WarehouseService';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import {DataTable} from 'primereact/datatable';
import { GetShipperAvailable } from '../../service/UserService';
import { Column } from 'primereact/column';
import {CreateANewTrip} from '../../service/TripService'
import {Messages} from 'primereact/messages';
import {Message} from 'primereact/message';
import { GetListPackage } from '../../service/PackageService';
import { CreateNewTransition } from '../../service/TransitionService';
const items = [
    {label: 'Chọn kho'},
    {label: 'Thông tin cơ bản'},
    {label: 'Trạng thái'}
];
const typeTrip= [
    {label:"Pick", value:"PICK"},
    {label:"Delivery", value:"DELIVERY"},
    {label:"Return", value:"RETURN"}
]
const routes = Const.Route_CreateNewTransit
export class CreateNewTransit extends Component {
    constructor(props){
        super(props)
        this.state= {
            selectedWarehouse: null,
            selectedPackage: [],
            orders:[],
            selectedOrders:[],
            packages: [],
            activeIndex: 0,
            shippers: null,
            selectedShipper:null,
            showListShipper: false,
            loadingListShipper: true,
            listDestination:[],
            selectedDestination: null,
            newTransit: [],
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
                    GetListPackage().then(res =>{
                        if(res.data.status == "OK"){
                            this.setState({packages: res.data.data,activeIndex: 1},()=>{
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
            }).then(()=>{
                GetAllWarehouse(100,0).then(res=>{
                    if(res.data.status == "OK"){
                        this.setState({listDestination: res.data.data})
                    }
                })
            })
            .catch(err => {
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
        const {selectedWarehouse, selectedPackage, selectedShipper, selectedDestination} = this.state
        if(selectedDestination == null || selectedWarehouse == null || selectedPackage.length == 0 || selectedShipper == null){
            Const.showError("Lỗi","Bạn phải nhập đầy đủ thông tin", this.growl)
            return;
        }
            CreateNewTransition(selectedWarehouse,selectedPackage,selectedDestination,selectedShipper).then(res=>{
                if(res.data.status == "OK"){
                    this.setState({newTransit: res.data.data[0], iconStatusCreate: "pi pi-check",activeIndex:2})
                    this.messages.show([
                    {sticky: true, severity: 'success', summary: 'Created transition', detail: `Transition submitted. ID transition: ${this.state.newTransit.id}` },
                    {sticky: true, severity: 'warn', summary: 'Sent to shipper', detail: 'Waiting for reply'}]);
                     Const.showSuccess("Thành công","Tạo phiên luân chuyển thành công",this.growl)
                }
            }).catch(err =>{
                if (!isUndefined(err.response)){
                    Const.showError(err.name,err.response.data.message,this.growl)
                } else {
                    Const.showError(err.name,err.message,this.growl)  
                }
                this.setState({newTransit: [], iconStatusCreate: "pi pi-times"})
                
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
                <Card title="Khởi tạo luân chuyển" style={{paddingTop:"10px"}}>
                    <Steps model={items} activeIndex={this.state.activeIndex}/>
                    {(this.state.activeIndex == 0) ? 
                    <Form labelCol={{span: 4}}  wrapperCol={{ span: 14 }} style={{marginTop: 20}}>
                        <Form.Item label="Mã kho">
                        <Input.Group compact>
                            <Form.Item >
                                <InputText placeholder="Mã kho" value={this.state.selectedWarehouse} style={{width: 300}}
                                readOnly/>
                            </Form.Item>
                            <Form.Item>
                               <Button label="Verify" className={this.state.classBtnVerify} style={{marginLeft:10}}
                                icon={this.state.iconBtnVerify} iconPos="left" onClick={this.searchWarehouse}/>
                            </Form.Item>
                        </Input.Group>
                        </Form.Item>
                    </Form>
                    : this.state.activeIndex == 1 ?
                    <Form labelCol={{span: 5}}  wrapperCol={{ span: 24 }} style={{marginTop: 20}}>
                        <div className="p-grid p-justify-between">
                            <div className="p-col-5">
                                <Form.Item label="Kho">
                                    <InputText value={this.state.selectedWarehouse} readOnly style={{width: 300}}/>
                                </Form.Item>
                            </div>
                            <div className="p-col-6">
                                <Form.Item label="Kiện hàng" rules={[{ required: true, message: 'Dữ liệu bắt buộc phải nhập' }]}>
                                    <Dropdown options={this.state.packages} style={{width: 300}} optionLabel="code"
                                    onChange={(e)=> this.setState({selectedPackage: e.target.value})} value={this.state.selectedPackage}/>
                                </Form.Item>
                            </div>
                        </div>
                        <div className="p-grid p-justify-between">
                            <div className="p-col-5">
                                <Form.Item label="Nơi đến" rules={[{ required: true, message: 'Loại bắt buộc phải nhập' }]}>
                                <Dropdown options={this.state.listDestination} style={{width: 300}} onChange={e => this.setState({selectedDestination: e.target.value})}
                                value={this.state.selectedDestination} optionLabel="name"/>
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
                                <Button label="Finish" style={{float:"right", marginLeft: 20, marginRight: 50}}
                                onClick={this.handleNextStep}/>
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