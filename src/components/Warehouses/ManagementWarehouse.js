import React, {Component} from 'react'
import {Card} from 'primereact/card';
import {Growl} from 'primereact/growl';
import * as Const from '../../core/constants'
import { PageHeader } from 'antd';
import { Form, Input } from 'antd';
import 'antd/dist/antd.css';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import { isUndefined, isNullOrUndefined } from 'util';
import {GetWarehouseById , GetAllWarehouse, UpdateArea} from '../../service/WarehouseService'
import {GetListBaskets, AddToBasket, RemoveOrder, CreateBasket} from '../../service/BasketService'
import {GetOrdersByBasketId, GetOrdersById, GetOrdersWillTransit} from '../../service/OrderService'
import {Dialog} from 'primereact/dialog';
import {Chips} from 'primereact/chips';
import {Dropdown} from 'primereact/dropdown';
import {Checkbox} from 'primereact/checkbox';
import { GetDistrictByCityCode ,GetWards} from '../../service/AddressService'
import { PickList } from 'primereact/picklist';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CreateNewPackage, GetListPackage } from '../../service/PackageService';

const routes = Const.Route_ManagementWarehouses
const typeBasket = [
    {label:"Pick", value:"PICK"},
    {label:"Delivery", value:"DELIVERY"},
    {label:"Return", value:"RETURN"}
]
const keyFilter = [
    {label:"Phường", value:"WARD"}
]
export class ManagementWarehousePage extends Component {
    constructor(props){
        super(props)
        this.state={
            warehouse:null,
            warehouseId:"",
            baskets: null,
            showDialogBasket: false,
            selectedBasket:null,
            orders: [],
            showChips: false,
            showDialogCreateBasket: false,
            typeBasket:"",
            selectedValueFilter:null,
            selectedKeyFilter:null,
            valuesFilter:null,
            selectedValueFilter: null,
            labelBasket: "",
            listArea: [],
            selectedAreas:[],

            showDialogCreatePackage: false,
            selectedOrders: [],
            listOrdersWillTransit:[],
            loadingDialogPackage: false,
            listPackages: []
        }
    }
    searchWarehouse= async ()=>{
        if (!isNullOrUndefined(this.state.warehouseId)){
            this.setState(
                {
                    iconBtnVerify: "pi pi-spin pi-refresh",
                    classBtnVerify: "p-button-raised p-button-warning"
                }
            )
            await GetWarehouseById(this.state.warehouseId).then( async (res) => {
                await this.setState({warehouse:res.data.data[0],selectedAreas: res.data.data[0].area})
                await GetDistrictByCityCode(this.state.warehouse.address.district.cityCode,200).then(async re=>{
                    await this.setState({listArea: re.data.data})
                })
                await GetListPackage().then(res => {
                    if (res.data.status == "OK"){
                        this.setState({listPackages: res.data.data})
                    }
                })
                await GetListBaskets(this.state.warehouseId).then(res =>{
                    this.setState({baskets: res.data.data})
                    }).then(()=>{
                        this.setState(
                            {
                                iconBtnVerify: "pi pi-fw pi-check",
                                classBtnVerify: "p-button-raised p-button-success"
                            }
                        )
                    }).catch(err =>{
                            this.setState(
                                {
                                    iconBtnVerify: "pi pi-fw pi-check",
                                    classBtnVerify: "p-button-raised p-button-success",
                                    baskets: []
                                }
                            )   
                    })
            }).catch(err =>{
                if (!isUndefined(err.response))
                    Const.showError(err.name,err.response.data.message,this.growl)
                else
                    Const.showError(err.name,err.message,this.growl)
                this.setState(
                    {
                        iconBtnVerify: "pi pi-fw pi-times",
                        classBtnVerify: "p-button-raised p-button-danger"
                    }
                )
            })
        }
    }
    componentDidUpdate=()=>{
        var wID = JSON.parse(localStorage.getItem("warehouse"))
        if(wID.id != this.state.warehouseId){
            this.setState({warehouseId: wID.id},()=>{
                this.searchWarehouse()
            })
        }
    }
     componentWillMount=()=>{
        const {id} = this.props.match.params;
        if (!isNullOrUndefined(id)){
            this.setState({warehouseId: id},()=>{
                this.searchWarehouse()
            })
        } else {
            var wID = JSON.parse(localStorage.getItem("warehouse"))
            this.setState({warehouseId: wID.id},()=>{
                this.searchWarehouse()
            })
        }
    }
    showCreateBasketDialog=()=>{
        this.setState({showDialogCreateBasket: true})
    }
    Address = (e)=>{
         console.log(e)
        if (!isNullOrUndefined(e.address)) {
            var numb = !isUndefined(e.address.number) ? e.address.number+", " : ""
            return (
            numb+
            e.address.street.prefix+" "+e.address.street.name+" "+
            e.address.ward.prefix+" "+e.address.ward.name+", " +
            e.address.district.name+" "+
            e.address.city.name)
        } else return " "

    }
    handleHide=()=>{
        if (this.state.showDialogBasket !== false)
            this.setState({showDialogBasket: false})
    }
    handleOnClick = (item)=>{
        this.setState({selectedBasket: item, showDialogBasket: true})
        GetOrdersByBasketId(item.ID).then(res => {
            this.setState({orders: res.data.data, showChips: true})
        }).catch(err =>{
            this.setState({showChips: true})
        })
    }
    customChip=(item)=>{
        var id = !isNullOrUndefined(item.id)?[...item.id] : !isNullOrUndefined(item)? [...item] : ""
        if(id == "")
            return(<span> </span>)
        else
        return(
            <div>
                <span>{id[0]+id[1]+id[2]+id[3]+"..."+id[id.length-3]+id[id.length-2]+id[id.length-1]}-<b>{item.status}</b></span>
            </div>
        )
    }

    handleOnAdd = (item)=>{
        if(isNullOrUndefined(item)){
            Const.showError("Lỗi","ID order không đúng", this.growl)
            return;
        }
        var order = []
        order.id = item.value
        order.basketId = this.state.selectedBasket.ID
        Const.showWarning("Thông báo","Đang thêm vào rỗ..",this.growl)
        this.setState({orders: [...this.state.orders,order]})
        GetOrdersById(item.value,true).then(res=>{
            var order = res.data.data[0]
            AddToBasket(order,this.state.selectedBasket.ID).then(res=>{
                if (res.data.status == "OK"){
                    Const.showSuccess("Thành công", res.data.message,this.growl)
                }
            }).catch(err =>{
                var {orders} = this.state
                if(orders.length == 1){
                    this.setState({orders: []})
                } else {
                    delete orders[orders.length-1]
                this.setState({orders: orders})
                }
                if (!isUndefined(err.response))
                    Const.showError(err.name,err.response.data.message,this.growl)
                else
                    Const.showError(err.name,err.message,this.growl)
            })
        }).catch(err=>{
            var {orders} = this.state
            this.setState({orders: orders})
            if (!isUndefined(err.response))
                Const.showError(err.name,err.response.data.message,this.growl)
            else
                Const.showError(err.name,err.message,this.growl)
        })
    }

    handleOnRemove = (item) => {
        console.log(item)
        var {orders} = this.state
        Const.showWarning("Thông báo", "Đang xóa...", this.growl)
        console.log(item.value[0])
        RemoveOrder(item.value[0].id, item.value[0].basketId).then(res =>{
            if (res.data.status == "OK"){
                Const.showSuccess("Thành công", res.data.message,this.growl)
            }
        }).then(()=>{
            this.setState({showChips: false})
            GetOrdersByBasketId(item.value[0].basketId).then(res=>{
                if (res.data.status == "OK"){
                    this.setState({orders: res.data.data,showChips: true})
                }
            }).catch(err =>{
                this.setState({showChips: true})
                if (!isUndefined(err.response))
                    if(err.response.data.status == "NOT_FOUND"){
                        this.setState({orders:[]})
                    }   
            })
        }).catch(err=>{
            if (!isUndefined(err.response))
                Const.showError(err.name,err.response.data.message,this.growl)
                else
                Const.showError(err.name,err.message,this.growl)
        })
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
            var wh = JSON.parse(localStorage.getItem("warehouse"))
            GetWards(wh.address.district.id,1000).then(res =>{
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
            this.state.selectedValueFilter,this.state.typeBasket,this.state.warehouseId).then(res=>{
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
    onAreaChange = (e)=>{
        console.log("area",e)
        var {selectedAreas} = this.state;
        if(e.checked)
            selectedAreas.push(e.value);
        else
        selectedAreas.splice(selectedAreas.findIndex(x=> x.name == e.value.name), 1);

        this.setState({selectedAreas: selectedAreas},()=>{
            UpdateArea(this.state.selectedAreas).then(res=>{
                if(res.data.status == "OK"){
                    Const.showSuccess("Thành công",res.data.message,this.growl)
                }
            }).catch(err =>{
                if (!isUndefined(err.response))
                Const.showError(err.name,err.response.data.message,this.growl)
            else
                Const.showError(err.name,err.message,this.growl) 
            })
        });
    }
    showCreatePackageDialog=()=>{
        this.setState({showDialogCreatePackage:true, loadingDialogPackage: true})
        GetOrdersWillTransit(true).then(res=>{
            this.setState({listOrdersWillTransit: res.data.data,loadingDialogPackage: false})
        }).catch(err=>{
            this.setState({listOrdersWillTransit: [],loadingDialogPackage: false})
        })
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
        console.log("addres",e)
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

    filterAddress=(e,key)=>{
        if(e.search(key) !== -1 )
        return e
    }
    handleSelectionChangeOrder = (e)=>{
        this.setState({selectedOrders: e.value});
    }
    footerDialogCreatePackage(){
     return (
            <div>
                <Button label="Tạo kiện hàng" icon="pi pi-plus" onClick={this.actionCreatePackage}/>
            </div>
        )
    }

    actionCreatePackage=()=>{
        if(this.state.selectedOrders.length === 0){
            Const.showError("Lỗi", "Bạn phải chọn đơn hàng", this.growl);
            return;
        }
        var listIdOrders = []
        this.state.selectedOrders.map(item => listIdOrders.push(item.id))
        CreateNewPackage(listIdOrders).then(res=>{
            if(res.data.status=="OK"){
                this.setState({listPackages: [...this.state.listPackages,res.data.data[0]]})
            }
        }).then(() =>{
            Const.showSuccess("Thành công", "Tạo kiện hàng thành công", this.growl)
        }).catch(err =>{
            if (!isUndefined(err.response))
                Const.showError(err.name,err.response.data.message,this.growl)
            else
                Const.showError(err.name,err.message,this.growl) 
        })
    }

    render(){
        return(
            <div>
                <Growl ref={(el) => this.growl= el} style={{borderRadius:'50px' }}/>
                <PageHeader className="site-page-header" breadcrumb={{routes}}/>
                <Card title="Quản lý kho" style={{paddingTop:"10px"}}>
                    <Form labelCol={{span: 5}}  wrapperCol={{ span: 14 }} style={{marginTop: 20}} >
                        <fieldset>
                            <legend>Tìm kiếm kho</legend>
                            <Form.Item label="Mã kho">
                                <Input.Group compact >
                                    <Form.Item onChange={this.handleInput}>
                                        <InputText style={{width: 250}}  placeholder="Mã kho" value={this.state.warehouseId ==""?null:this.state.warehouseId}
                                        readOnly/>
                                    </Form.Item>
                                    <Form.Item style={{marginLeft: 25}}>
                                        <Button label="Verify" className={this.state.classBtnVerify} icon={this.state.iconBtnVerify} iconPos="left" onClick={this.searchWarehouse}/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>
                        </fieldset>
                    </Form>
                    {!isNullOrUndefined(this.state.warehouse) ? 
                    <Form labelCol={{span: 8}}  wrapperCol={{ span: 14 }} style={{marginTop: 20}}>
                        <fieldset>
                            <legend>Thông tin cơ bản</legend>
                                <div className="p-grid p-justify-between">
                                    <div className="p-col-5">
                                        <Form.Item  label="Tên kho">
                                            <InputText value={this.state.warehouse.name} style={{width: 250}} readOnly/>
                                        </Form.Item>
                                    </div>
                                    <div className="p-col-6">
                                        <Form.Item  label="Địa chỉ">
                                            <InputText value={this.Address(this.state.warehouse)} style={{width: 250}} readOnly/>
                                        </Form.Item>
                                    </div>
                                </div>
                        </fieldset>
                        <fieldset style={{paddingBottom: "20px"}}>
                            <legend>Khu vực quản lý nhận hàng</legend>
                            {!isNullOrUndefined(this.state.listArea)&&!isNullOrUndefined(this.state.selectedAreas)? this.state.listArea.map( (item,i)=>
                                    <div style={{display:"inline-block", marginRight:"20px"}}><div style={{marginBottom:"13px"}}>
                                        <Checkbox onChange={this.onAreaChange} id={item.id} value={item} key={i}
                                        checked={this.state.selectedAreas.findIndex(x=> x.name == item.name) !== -1}
                                   />
                                    <label htmlFor={item.id} className="p-checkbox-label">{item.name}</label>
                                    </div>
                                    </div>
                                ): ""}
                        </fieldset>
                        <fieldset style={{paddingBottom: "20px"}}>
                            <legend>Rỗ
                            <Button style={{float: "right",marginRight:"20px"}} icon="pi pi-bars" 
                            className="p-button p-button-info" label="Tạo rỗ mới" onClick={this.showCreateBasketDialog}/>
                            </legend>
                                {!isNullOrUndefined(this.state.baskets)? this.state.baskets.map( (item)=>
                                    <Button key={item.ID} label={item.label} icon="pi pi-bars" onClick={()=> {return this.handleOnClick(item)}}
                                    className="p-button-raised p-button-secondary" style={{border: "1px solid #000", marginRight:"10px"}}/>
                                ): ""}
                        </fieldset>
                        <fieldset style={{paddingBottom: "10px"}}>
                            <legend>
                                Kiện hàng
                                <Button style={{float: "right",marginRight:"20px"}} icon="pi pi-th-large" 
                            className="p-button p-button-info" label="Tạo kiện hàng" onClick={this.showCreatePackageDialog}/>
                            </legend>
                            {!isNullOrUndefined(this.state.listPackages)? this.state.listPackages.map( (item)=>
                                    <Button key={item.ID} label={item.code} icon="pi pi-th-large" onClick={()=> {return this.handleOnClick(item)}}
                                    className="p-button-raised p-button-secondary" tooltip={`Status: ${item.status}`}
                                    style={item.status ==="PACKAGE"? {border: "1px solid #000", marginRight:"10px"}: {border: "1px solid red", marginRight:"10px"} }/>
                                ): ""}
                        </fieldset>
                    </Form>
                    : null}
                </Card>
                <Dialog header="Thông tin rỗ" visible={this.state.showDialogBasket} modal={true}
                onHide={this.handleHide} style={{width: '50vw'}} blockScroll>
                    {!isNullOrUndefined(this.state.selectedBasket) ? 
                    <div>
                    <Form labelCol={{span: 4}}  wrapperCol={{ span: 10 }}>
                        <div className="p-grid p-justify-between">
                            <div className="p-col">
                                <Form.Item label="ID">
                                    <InputText style={{width:200}} value={this.state.selectedBasket.ID}/>
                                </Form.Item>
                                <Form.Item label="Type">
                                    <InputText style={{width:200}} value={this.state.selectedBasket.type}/>
                                </Form.Item>
                            </div>
                            <div className="p-col">
                                <Form.Item label="Name">
                                    <InputText style={{width:200}} value={this.state.selectedBasket.label}/>
                                </Form.Item>
                                <Form.Item label="Filter">
                                    <InputText style={{width:200}} value={this.state.selectedBasket.filter.key+": "+this.state.selectedBasket.filter.value}/>
                                </Form.Item>
                            </div>
                        </div>
                    </Form>
                    <div className="p-fluid">
                            <Form.Item label="Orders">
                                {this.state.showChips ?
                                <Chips value={this.state.orders} style={{width: "89%"}} itemTemplate={this.customChip}
                                readOnly onAdd={this.handleOnAdd} onRemove={this.handleOnRemove}></Chips>
                                : <span><i className="pi pi-spin pi-spinner" iconPos="left"></i> Loading...</span>}
                            </Form.Item>
                        </div>
                    </div>
                    : null}
                </Dialog>
                <Dialog header="Tạo basket" style={{width: '50vw'}} modal={true}
                visible={this.state.showDialogCreateBasket} onHide={()=>this.setState({showDialogCreateBasket: false})}>
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
                <Dialog header="Tạo kiện hàng" visible={this.state.showDialogCreatePackage} style={{width: '50vw'}} modal={true}
                onHide={()=>this.setState({showDialogCreatePackage: false})} footer={this.footerDialogCreatePackage()}>
                    <DataTable emptyMessage="Không có đơn hàng" value={this.state.listOrdersWillTransit} selection={this.state.selectedOrders}
                    loading={this.state.loadingDialogPackage} paginator={true} rows={10} responsive onSelectionChange={this.handleSelectionChangeOrder} >
                        <Column selectionMode="multi" style={{width:45}}/>
                        <Column body={e=>(<a href={`./#/order/management/${e.id}`}>{Const.shortenID(e.id)}</a>)} header="ID"/>

                        <Column body={this.addressSender} filterPlaceholder="Địa chỉ gửi"
                        header="Địa chỉ gủi" filter sortable filterMatchMode="custom" filterFunction={this.filterAddress}/>

                        <Column body={this.addressReceiver} filterPlaceholder="Địa chỉ nhận"
                        header="Địa chỉ nhận" filter sortable filterMatchMode="custom" filterFunction={this.filterAddress}/>
                    </DataTable>
                </Dialog>
            </div> 
        )
    }
}