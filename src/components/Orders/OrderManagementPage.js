import React, {Component} from 'react'
import {Card} from 'primereact/card';
import {Growl} from 'primereact/growl';
import * as Const from '../../core/constants'
import {GetOrdersById} from '../../service/OrderService'
import { PageHeader } from 'antd';
import { Form, Input } from 'antd';
import 'antd/dist/antd.css';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Fieldset} from 'primereact/fieldset';
import { isUndefined, isNullOrUndefined } from 'util';
import {Dropdown} from 'primereact/dropdown';

const statusOrder = [
    {label: 'New', value: 'NEW'},
    {label: 'Pending', value: 'PENDING'},
    {label: 'Read to pick', value: 'READY_TO_PICK'},
    {label: 'Picking', value: 'PICKING'},
    {label: 'Picked', value: 'PICKED'},
    {label: 'Picked failed', value: 'PICKED_FAILED'},
    {label: 'Ready to delivery', value: 'READY_TO_DELIVERY'},
    {label: 'Delivering', value: 'DELIVERING'},
    {label: 'Delivered', value: 'DELIVERED'},
    {label: 'Delivered failed', value: 'DELIVERED_FAILED'},
    {label: 'Completed', value: 'COMPLETED'},
    {label: 'Return', value: 'RETURN'},
    {label: 'Returned', value: 'RETURNED'},
    {label: 'Canceled', value: 'CANCELED'}
];

const routes = Const.Route_ManagementOrder

var growl = <Growl/>;
export class OrderManagementPage extends Component{
    constructor(props){
        super(props)
        this.state={
            iconBtnVerify: "",
            classBtnVerify: "p-button-raised",
            labelBtnVerify: "Verify",
            orderId : "",
            order:null,
            labelUpdate:"Update",
            isUpdating: false,
            newOrderStatus: "",
        }

    }
    actionUpdate = (e)=>{
        console.log("A")
        this.setState({isUpdating:true, labelUpdate: "Save"})
    }
    handleInput = (e)=>{
        this.setState({orderId: e.target.value})
    }
    searchOrder= ()=>{
        this.setState(
            {
                iconBtnVerify: "pi pi-spin pi-refresh",
                classBtnVerify: "p-button-raised p-button-warning"
            }
        )
        GetOrdersById(this.state.orderId,true).then(res=>{
            if (res.data.status === "OK"){
                this.setState({order: res.data.data[0]})
                this.setState(
                {
                    iconBtnVerify: "pi pi-fl pi-check",
                    classBtnVerify: "p-button-raised p-button-success"
                })
            }
        }).catch(err=>{
            console.log(err.response)
            if(!isUndefined(err.response)){
                Const.showError(err.status, err.response.message,this.growl)
            } else {
                Const.showError("Lỗi", err.message,this.growl)
            }
        })
    }
    componentDidMount= ()=>{
        const {id} = this.props.match.params;
        this.setState(
            {
                iconBtnVerify: "pi pi-spin pi-refresh",
                classBtnVerify: "p-button-raised p-button-warning"
            }
        )
        if(!isUndefined(id)){
            this.setState({orderId: id})
            GetOrdersById(id,true).then(res=>{
                console.log(res.data.data)
                if (res.data.status === "OK"){
                    this.setState({order: res.data.data[0]})
                    this.setState(
                    {
                        iconBtnVerify: "pi pi-fl pi-check",
                        classBtnVerify: "p-button-raised p-button-success"
                    })
                }
            }).catch(err=>{
                console.log(err.response)
                if(!isUndefined(err.response)){
                    Const.showError(err.status, err.response.message,this.growl)
                } else {
                    Const.showError("Lỗi", err.message,this.growl)
                }
                this.setState(
                    {
                        iconBtnVerify: "pi pi-fl pi-times",
                        classBtnVerify: "p-button-raised p-button-danger"
                    })
            })  
        } else {
            this.setState(
                {
                    iconBtnVerify: "",
                    classBtnVerify: "p-button-raised"
                })
        }
    }
    render(){
        let {order} = this.state
        if(!isNullOrUndefined(order)){
            var senderAddress = !isNullOrUndefined(order.sAddress) ? order.sAddress.street.name+", "+ order.sAddress.ward.prefix+
            " "+order.sAddress.ward.name+", "+ order.sAddress.district.name+", "+ order.sAddress.city.name : "";
            var receiverAddress = !isNullOrUndefined(order.rAddress) ? order.rAddress.street.name+", "+ order.rAddress.ward.prefix+
            " "+order.rAddress.ward.name+", "+ order.rAddress.district.name+", "+ order.rAddress.city.name : ""
        }

        return(
            <div>
                <Growl ref={(el) => this.growl= el} style={{borderRadius:'50px' }}/>
                <PageHeader className="site-page-header" breadcrumb={{routes}}/>
                <Card title="Quản lý đơn hàng">
                    <Form labelCol={{span: 5}}  wrapperCol={{ span: 14 }} style={{marginTop: 20}} onFinish={this.searchOrder}>
                        <fieldset>
                            <legend>Tìm kiếm đơn hàng</legend>
                            <Form.Item label="Mã đơn hàng">
                                <Input.Group compact >
                                    <Form.Item onChange={this.handleInput}>
                                        <InputText style={{width: 250}}  placeholder="Mã đơn hàng" value={isUndefined(this.state.orderId)?null:this.state.orderId}/>
                                    </Form.Item>
                                    <Form.Item style={{marginLeft: 25}}>
                                        <Button label="Verify" className={this.state.classBtnVerify} icon={this.state.iconBtnVerify} iconPos="left" onClick={this.searchOrder}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>
                        </fieldset>
                    </Form>
                    {!isNullOrUndefined(order) ? 
                    <div>
                        <div className="p-grid">
                            <div className="p-col-12">
                                <Button label={this.state.labelUpdate} style={{float: "right"}} onClick={this.actionUpdate}/>
                            </div>
                        </div>
                        <Form labelCol={{span: 5 }}  wrapperCol={{ span: 16 }} style={{marginTop: 15}}>
                            <div className="p-grid p-justify-between">
                                <div className="p-col-5" >
                                    <fieldset>
                                        <legend>Thông tin cơ bản</legend>
                                        <Form.Item label="Người gửi">
                                            <InputText style={{width: 250, marginLeft: 30}} value={this.state.order.sName} placeholder="Mã đơn hàng" id="creatorName" readOnly/>
                                        </Form.Item>
                                        <Form.Item label="SĐT người gửi" >
                                            <InputText style={{width: 250, marginLeft: 30}} value={this.state.order.sPhoneNumber} placeholder="Mã đơn hàng" id="creatorName" readOnly/>
                                        </Form.Item>
                                        <Form.Item label="Nơi gửi" >
                                            <InputText style={{width: 250, marginLeft: 30}} value={senderAddress} placeholder="Nơi gửi" readOnly/>
                                        </Form.Item>
                                        <Form.Item label="Lat" >
                                            <InputText style={{width: 250, marginLeft: 30}} value={order.sLat} placeholder="Nơi gửi" readOnly/>
                                        </Form.Item>
                                        <Form.Item label="Long" >
                                            <InputText style={{width: 250, marginLeft: 30}} value={order.sLng} placeholder="Nơi gửi" readOnly/>
                                        </Form.Item>
                                        <br/>
                                        <Form.Item label="Người nhận">
                                            <InputText style={{width: 250, marginLeft: 30}} value={order.rName} placeholder="Mã đơn hàng" id="creatorName" readOnly/>
                                        </Form.Item>
                                        <Form.Item label="SĐT người nhận">
                                            <InputText style={{width: 250, marginLeft: 30}} value={order.rPhoneNumber} placeholder="Mã đơn hàng" id="creatorName" readOnly/>
                                        </Form.Item>
                                        <Form.Item label="Nơi nhận" >
                                            <InputText style={{width: 250, marginLeft: 30}} value={receiverAddress} placeholder="Nơi nhận" readOnly/>
                                        </Form.Item>
                                        <Form.Item label="Lat" >
                                            <InputText style={{width: 250, marginLeft: 30}} value={order.rLat} placeholder="Nơi gửi" readOnly/>
                                        </Form.Item>
                                        <Form.Item label="Long" >
                                            <InputText style={{width: 250, marginLeft: 30}} value={order.rLng} placeholder="Nơi gửi" readOnly/>
                                        </Form.Item>
                                    </fieldset>
                                </div>
                                <div className="p-col-6" >
                                    <fieldset>
                                        <legend>Thông tin chi tiết</legend>
                                        {!this.state.isUpdating ? 
                                        <Form.Item label="Trạng thái" >
                                            <InputText style={{width: 250, marginLeft: 30}} value={this.state.order.status} placeholder="Trạng thái đơn" readOnly/>
                                        </Form.Item>
                                        :  <Form.Item label="Trạng thái" >
                                                <Dropdown value={this.state.newOrderStatus} options={statusOrder} style={{width: 250, marginLeft: 30}}
                                                onChange={(e) => {this.setState({newOrderStatus: e.value})}} placeholder="Select order status"/>
                                    </Form.Item>}
                                        <Form.Item label="Loại đơn" >
                                            <InputText style={{width: 250, marginLeft: 30}} value={this.state.order.type} placeholder="Loại đơn hàng" readOnly/>
                                        </Form.Item>
                                        <Form.Item label="Loại vận chuyển">
                                            <InputText style={{width: 250, marginLeft: 30}} value={this.state.order.deliveryType} placeholder="Loại vận chuyển" readOnly/>
                                        </Form.Item>
                                        <Form.Item label="Created time" >
                                            <InputText style={{width: 250, marginLeft: 30}} value={this.state.order.createdTime} placeholder="Thời gian tạo" readOnly />
                                        </Form.Item>
                                        <Form.Item label="Expected Date"  >
                                            <InputText style={{width: 250, marginLeft: 30}} value={this.state.order.expectedDD} placeholder="Expected Date" readOnly/>
                                        </Form.Item>
                                        <Form.Item label="Kho" >
                                            <InputText style={{width: 250, marginLeft: 30}} value={this.state.order.warehouseId} placeholder="Mã kho" readOnly/>
                                        </Form.Item>
                                        <Form.Item label="Chuyến đi" >
                                            <InputText style={{width: 250, marginLeft: 30}} value={this.state.order.tripId} placeholder="Chuyến đi" readOnly/>
                                        </Form.Item>
                                        <Form.Item label="Shipper" >
                                            <InputText style={{width: 250, marginLeft: 30}} value={this.state.order.shipperId} placeholder="CBĐP" readOnly/>
                                        </Form.Item>
                                        <Form.Item label="Nhân viên kho" >
                                            <InputText style={{width: 250, marginLeft: 30}} value={this.state.order.warehouseId} placeholder="Nhân viên kho" readOnly/>
                                        </Form.Item>
                                        <Form.Item label="Rỗ" >
                                            <InputText style={{width: 250, marginLeft: 30}} value={this.state.order.basketId} placeholder="Mã rỗ" readOnly/>
                                        </Form.Item>
                                        <Form.Item label="Ship COD" >
                                            <InputText style={{width: 250, marginLeft: 30}} value={this.state.order.warehouseId} placeholder="Mã COD" readOnly/>
                                        </Form.Item>
                                    </fieldset>
                                </div>
                            </div>
                        </Form>
                    </div>
                    :null}
                </Card>
            </div>
        )
    }
}
