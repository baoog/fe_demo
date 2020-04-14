import React, {Component} from 'react'
import { PageHeader } from 'antd';
import 'antd/dist/antd.css';
import {Card} from 'primereact/card';
import {Growl} from 'primereact/growl';
import * as Const from '../../core/constants'
import { GetCities , GetDistrictByCityCode, GetStreetByName ,GetWards} from '../../service/AddressService'
import { CreateNewWarehouse } from '../../service/WarehouseService'
import { Form, Input, Tooltip, Button } from 'antd';
import {InputText} from 'primereact/inputtext';
import {AutoComplete} from 'primereact/autocomplete';
import { isUndefined } from 'util';
import {Dropdown} from 'primereact/dropdown';

var growl = <Growl/>;
const routes= Const.Route_CreateWarehouse
export class CreateWarehouse extends Component {
    constructor(props){
        super(props);
        this.state ={
            cities: null,
            selectedCity: null,
            districts:null,
            selectedDist:null,
            streets: null,
            selectedStreet:null,
            wards:null,
            selectedWard: null,
            nameWH: null,
            numberAddress: null,
        }
    }

    handleChangeSelectCity=(data)=>{
        console.log(data)
        this.setState({selectedCity: data.value})
        var limit = 100
        GetDistrictByCityCode(data.value.id,limit).then(res=>{
            if (!isUndefined(res.data.data))
                this.setState({districts: res.data.data})
        })
    }

    handleChangeSelectDistrict=(data)=>{
        if(this.state.selectedCity != null){
            this.setState({selectedDist: data.value})   
            GetWards(data.value.id,1000).then(res=>{
                if (!isUndefined(res.data.data)){
                    this.setState({wards: res.data.data})
                }
            })
        } 
    }

    handleChangeSelectWard=(data)=>{
        if (this.state.selectedDist != null)
            this.setState({selectedWard: data.value})
    }

    handleSearchStreet = (e) =>{
        var limit = 100
        if (this.state.selectedDist != null)
            GetStreetByName(this.state.selectedDist.id,e.query,limit).then(res=>{
                if (!isUndefined(res.data.data)){
                        this.setState({streets:res.data.data})
                }
            })
    }

    handleSelectStreet = (data)=>{
        this.setState({selectedStreet: data.value})
    }


    componentWillMount = (prevProps, prevState)=>{
        if(this.state.cities == null)
            GetCities().then(res =>{
                this.setState({cities:res.data.data})
            })
    }
    actionCreate= (value)=>{
        console.log(value)
        var name = value.name
        var address={
            city: value.city,
            district: value.dist,
            ward: value.ward,
            street: value.street,
            number: value.number
        }
        CreateNewWarehouse(name, address).then(res =>{
            console.log(res)
            if(res.data.status === "OK")
                Const.showSuccess("Created",res.data.message,this.growl)
        }).catch((err,data) => {
            console.log(err.code,err.status,err.statusCode,err.body)
            if (!isUndefined(err.response)){
                Const.showError("Lỗi",err.response.message, this.growl)
            } else {
                Const.showError("Lỗi","Tên kho hoặc địa chỉ đã tồn tại", this.growl)
            }
        })
    }
        render(){
            const {cities} = this.state

        return(
            <div>
                <Growl ref={(el) => this.growl= el} style={{borderRadius:'50px' }}/>
                <PageHeader className="site-page-header" breadcrumb={{routes}}/>
                <Card title="Tạo kho mới">
                <Form name="complex-form" labelCol={{ span: 4 }} style={{marginTop: 15}} 
                wrapperCol={{ span: 16 }} onFinish={this.actionCreate}>
                    <Form.Item label="Tên kho *" >
                        <Form.Item name="name" noStyle rules={[{ required: true, message: 'Tên bắt buộc nhập' }]}>
                            <InputText value={this.state.nameWH} 
                            onChange={(e) => this.setState({nameWH: e.target.value})} placeholder="Nhập tên kho" 
                            style={{width: 200}} />
                        </Form.Item>
                        <Tooltip title="Useful information">
                        </Tooltip>
                    </Form.Item>
                    <Form.Item label="Địa chỉ *">
                        <Input.Group compact >
                        <Form.Item 
                            name="city"
                            noStyle rules={[{ required: true, message: 'City is required' }]}>
                            <Dropdown value={this.state.selectedCity} options={this.state.cities} onChange={this.handleChangeSelectCity} placeholder="Chọn tên thành phố" style={{ width: 200 }}
                              filter={true} filterPlaceholder="Tên thành phố" filterBy="id,name" showClear={true} optionLabel="name"/>
                    </Form.Item>
                        <Form.Item
                            name="dist"
                            noStyle
                            rules={[{ required: true, message: 'Bạn phải chọn quận/huyện' }]}>
                            <Dropdown value={this.state.selectedDist} options={this.state.districts} onChange={this.handleChangeSelectDistrict} placeholder="Chọn quận/huyện" style={{ width: 200 }}
                              filter={true} filterPlaceholder="Nhập tên quận/huyện" filterBy="id,name" showClear={true} optionLabel="name"/>                       
                   </Form.Item>
                    </Input.Group>
                </Form.Item>

                <Form.Item label=" " colon={false}>
                <Input.Group compact>
                        <Form.Item 
                            name="ward"
                            noStyle rules={[{ required: true, message: 'Bạn phải chọn phường/xã' }]}>
                            <Dropdown value={this.state.selectedWard} options={this.state.wards} onChange={this.handleChangeSelectWard} placeholder="Chọn phường/xã" style={{ width: 200 }}
                              filter={true} filterPlaceholder="Nhập tên phường/xã" filterBy="id,name" showClear={true} optionLabel="name"/>   
                    </Form.Item>
                        <Form.Item
                            name="street"
                            noStyle
                            rules={[{ required: true, message: 'Street is required' }]}>
                        <AutoComplete value={this.state.selectedStreet}  completeMethod={this.handleSearchStreet} onSelect={this.handleSelectStreet}
                            className="p-fluid"    suggestions={this.state.streets} field="name" minLength={1} style={{ width: 200 }} placeholder="Nhập tên đường" />
                   </Form.Item>
                    </Input.Group>
                </Form.Item>
                <Form.Item label=" " colon={false} >
                    <Form.Item name="number" noStyle rules={[{ required: true, message: 'Bạn nhập địa chỉ kho' }]}>
                    <InputText value={this.state.numberAddres} onChange={(e) => this.setState({numberAddres: e.target.value})} placeholder="Nhập địa chỉ kho" style={{ width: 400}}/>
                        </Form.Item>
                </Form.Item>
                <Form.Item label=" " colon={false}>
                    <Button type="primary" htmlType="submit" style={{marginBottom: "10px"}}>
                    Tạo kho mới
                    </Button>
                </Form.Item>
                    </Form>
                </Card>
            </div>
        )
    }
}