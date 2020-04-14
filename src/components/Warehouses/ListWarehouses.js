import React, {Component} from 'react'
import { PageHeader } from 'antd';
import 'antd/dist/antd.css';
import {GetAllWarehouse, ImportToWarehouse} from '../../service/WarehouseService'
import { GetDistrictByCityCode ,GetWards} from '../../service/AddressService'
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Card} from 'primereact/card';
import {Growl} from 'primereact/growl';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import { isUndefined, isNullOrUndefined } from 'util';
import { InputText } from 'primereact/inputtext';
import { Form, Input } from 'antd';
import {Dropdown} from 'primereact/dropdown';

import * as Const from '../../core/constants'
import { CreateBasket } from '../../service/BasketService';

const routes= Const.Route_ListWarehouses
var growl = <Growl/>
const typeBasket = [
    {label:"Pick", value:"PICK"},
    {label:"Delivery", value:"DELIVERY"},
    {label:"Return", value:"RETURN"}
]
const keyFilter = [
    {label:"Phường", value:"WARD"}
]
export class ListWarehousesPage extends Component {
    constructor(props){
        super(props);
        this.state= {
            globalFilterWH: "",
            warehouses:null,
            selectionWH: null,
            isListWarehouseLoading: false,
            btnCreateBasket: true,
            showDialogBasket: false,
            typeBasket:"",
            selectedValueFilter:null,
            selectedKeyFilter:null,
            valuesFilter:null,
            selectedValueFilter: null,
            labelBasket: ""
        }
    }
    renderHeader = ()=>{
        return (   
        <div>    
            <Button label="Create basket" icon="pi pi-fl pi-plus" iconPos="left" style={{float: "right", marginLeft: 15, paddingTop:1,paddingBottom: 1}}
            className="p-button p-button-success" disabled={this.state.btnCreateBasket} onClick={this.showDialog}/>
            <InputText type="search" style={{width: 280, float: "right", marginBottom:30}} onInput={(e) => this.setState({globalFilterWH: e.target.value})}
            placeholder="Search kho"/>
        </div>   
        )
    }
    showDialog=()=>{
        this.setState({showDialogBasket: true})
    }
    componentWillMount = ()=>{
        this.setState({isListWarehouseLoading: true})
        GetAllWarehouse(100,0).then(res=>{
            console.log(res)
            this.setState({warehouses: res.data.data,isListWarehouseLoading: false})
        }).catch(err =>{
            if (!isUndefined(err.response))
                Const.showError(err.name,err.response.data.message,this.growl)
            else
                Const.showError(err.name,err.message,this.growl)   
        })
    }
    componentDidUpdate=(prevProps, prevState)=>{
        if (prevState.selectionWH !== this.state.selectionWH){
            if(this.state.selectionWH !== null){
                this.setState({btnCreateBasket: false})
            }else{
                this.setState({btnCreateBasket: true})
            }
        }
    }
    handleChangeSelectKeyFilter =(e)=>{
        this.setState({selectedKeyFilter: e.value})
        if (e.value === "DISTRICT"){
            console.log(this.state.selectionWH.address.district)
            GetDistrictByCityCode(this.state.selectionWH.address.district.cityCode,500).then(res =>{
                this.setState({valuesFilter: res.data.data})
            }).catch(err=>{
                if (!isUndefined(err.response))
                    Const.showError(err.name,err.response.data.message,this.growl)
                else
                    Const.showError(err.name,err.message,this.growl)     
            })
        } else if (e.value === "WARD"){
            GetWards(this.state.selectionWH.address.district.id,1000).then(res =>{
                this.setState({valuesFilter: res.data.data})
            }).catch(err=>{
                if (!isUndefined(err.response))
                    Const.showError(err.name,err.response.data.message,this.growl)
                else
                    Const.showError(err.name,err.message,this.growl)             
            })
        }
    }
    SelectValueFilter = (e)=>{
        this.setState({selectedValueFilter:e.value})
        console.log(e.value)
    }
    handleCreateBasket= ()=>{
        CreateBasket(this.state.labelBasket,this.state.selectedKeyFilter,
            this.state.selectedValueFilter,this.state.typeBasket,this.state.selectionWH.id).then(res=>{
                if (res.data.status == "OK"){
                    Const.showSuccess("Thành công",res.data.message,this.growl)
                }
            }).catch(err=>{
                if (!isUndefined(err.response))
                    Const.showError(err.name,err.response.data.message,this.growl)
                else
                    Const.showError(err.name,err.message,this.growl)   
            })

    }
    render(){
        const headerDataTableModal = this.renderHeader()
        return(
            <div>
                <Growl ref={(el) => this.growl= el} style={{borderRadius:'50px' }}/>
                <PageHeader className="site-page-header" breadcrumb={{routes}}/>
                <Card title="Danh sách kho">
                    <DataTable value={this.state.warehouses} globalFilter={this.state.globalFilterWH} header={headerDataTableModal}
                        selection={this.state.selectionWH} onSelectionChange={e => this.setState({selectionWH: e.value})}
                        responsive className="data-list-warehouse" loading={this.state.isListWarehouseLoading}>
                        <Column selectionMode="single" style={{width:'3em'}}/>
                        <Column sortable filter header="Name" 
                        body={e =>(<a href={`./#/warehouse/management/${e.id}`}>{e.name}</a>)}/>
                        <Column sortable filter field="address.number" header="Số"/>
                        <Column sortable filter field="address.street.name" header="Đường"/>
                        <Column sortable filter field="address.ward.name" header="Phường/Xã"/>
                        <Column sortable filter field="address.district.name" header="Quận/Huyện"/>
                        <Column sortable filter field="address.city.name" header="Thành phố"/>
                    </DataTable>    
                </Card>
                <Dialog header="Tạo basket" style={{width: '50vw'}} modal={true}
                visible={this.state.showDialogBasket} onHide={()=>this.setState({showDialogBasket: false})}>
                    <Form labelCol={{ span: 5 }}  wrapperCol={{ span: 16 }} name="basket">
                        <fieldset>
                            <legend>Thông tin cơ bản</legend>
                            <Form.Item label="Label" rules={[{ required: true, message: 'Nhãn bắt buộc nhập' }]}>
                            <InputText style={{width: 410}} placeholder="Nhãn rỗ" value={this.state.labelBasket}
                            onChange={(e)=>this.setState({labelBasket: e.target.value})}/>
                            </Form.Item>
                            <Form.Item label="Type" rules={[{ required: true, message: 'Bát buộc nhập loại rổ' }]}>
                                <Dropdown value={this.state.typeBasket} options={typeBasket} style={{width: 410}}
                                onChange={(e) => {this.setState({typeBasket: e.value})}} placeholder="Loại rỗ"/>
                            </Form.Item>
                            <Form.Item label="Filter">
                                <Input.Group compact>
                                    <Form.Item rules={[{ required: true, message: 'Bắt buộc phải có key filter' }]}>
                                        <Dropdown options={keyFilter} style={{width: 200}} 
                                        value={this.state.selectedKeyFilter} onChange={this.handleChangeSelectKeyFilter}/>
                                    </Form.Item>
                                    <Form.Item label=" " colon={false} rules={[{ required: true, message: 'Nhập giá trik filter' }]}>
                                        <Dropdown style={{width: 200}} onChange={this.SelectValueFilter}
                                         options={this.state.valuesFilter} optionLabel="name" optionValue="name"
                                         value={this.state.selectedValueFilter}/>
                                    </Form.Item>
                                </Input.Group>
                                <Form.Item>
                                    <Button label="Create basket" onClick={this.handleCreateBasket} style={{float: "right", marginRight: "23px"}}/>
                                </Form.Item>
                            </Form.Item>
                        </fieldset>
                    </Form>
                </Dialog>
            </div>
        )
    }
}