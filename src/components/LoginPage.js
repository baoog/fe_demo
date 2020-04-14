import React, { Component } from 'react';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Panel} from 'primereact/panel';
import {Growl} from 'primereact/growl';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {LoginService} from '../service/AuthService'
import '../layout/login.css';
import { Loading } from './Loading';
import {GetInfoUser} from '../service/UserService'
import { isUndefined } from 'util';
import * as Const from '../core/constants'
import {Carousel} from 'primereact/carousel';
import { Card } from 'primereact/card';
import {Checkbox} from 'primereact/checkbox';
var growl = <Growl/>
export class LoginPage extends Component {
    constructor(){
        super();
        this.state = {
            user: {
                username: "",
                password: ""
            },
            loading: false,
            img: [
                {url: "assets/brand/brand-0.jpg"},
                {url: "https://file.hstatic.net/1000376681/file/ghn-anh-xuan-hoa_593d9b52720a4c3c981a955181ae5a9e.jpg"}
            ]
        }    
        this.responsiveSettings = [
            {
                breakpoint: '1024px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '768px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '560px',
                numVisible: 1,
                numScroll: 1
            }
        ];
    }
    handleChangeInput = event => {
        const {name, value} = event.target;
        let user = this.state.user;
        user[name] = value;
        this.setState({
            user
        });
    }
    triggerEnter = (event)=>{
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            this.actionLogin();
          }
    }
    leftSide=(img)=>{
        console.log(img)
        return(
            <div className="car-details">
                <div className="p-grid">
                    <div style={{backgroundColor: "#ff8833"}}>
                        <img src={img.url} className="brand-img"/>
                    </div>
                </div>
                
            </div>
        )
    }
    actionLogin = ()=>{
        if (this.state.username === "" || this.state.password === ""){
            this.showError("Lỗi","Vui lòng điền đầy đủ username/password")
            return;
        }
        this.setState({loading: true})
        LoginService(this.state.user).then(res =>{
            this.setState({loading: false})
            if (res.data.status === "OK"){
                localStorage.setItem("user_token",res.data.data[0].token)
                Const.showSuccess("Đăng nhập thành công","Xin chào "+this.state.user.username,this.growl)
                GetInfoUser(localStorage.getItem("user_token")).then(res =>{
                    console.log(res)
                    localStorage.setItem("avatar",res.data.data[0].avatar)
                    localStorage.setItem("username",res.data.data[0].username)
                }).then(res=>{
                    window.location = "/"
                }).catch(err=>{
                    if (!isUndefined(err.response)){
                        Const.showError("Lỗi",err.response.message, this.growl)
                    } else {
                        Const.showError("Lỗi",err.message, this.growl)
                    }
                })
            } else {
                console.log(res)
                Const.showError("Lỗi",res.message,this.growl)
                
            }
        }).catch((err,res)=>{
            this.setState({loading: false})
            console.log(err.response)
            if (!isUndefined(err.response)){
                Const.showError("Error",err.response.data.message,this.growl)
            } else {
                Const.showError("Error",err.message,this.growl)
            }
        });
    }

    render(){
        const cardFooter = <div><a href="#" style={{marginLeft:"20px"}}>Quên mật khẩu</a></div>
        return(
            <div>
                <Growl ref={(el) => this.growl= el} style={{borderRadius:'50px' }}/>
                <Loading isLoading={this.state.loading}/>
            <div className="p-grid" style={{marginLeft: "-15px", marginRight: "0px",marginBottom: "-5px" ,height: "100vh"}}>
                <div className="p-col-6" >
                    <Carousel value={this.state.img} numVisible={1} itemTemplate={this.leftSide}
                    style={{width: "50vw"}}  circular={true} autoplayInterval={3200}></Carousel>
                </div>
                <div onKeyUp={this.triggerEnter} className="p-col-6">
                    
                    <div className="logo">
                        <img src="assets/layout/images/ghn.png"/>
                    </div>
                    <div className="container-login">
                    <Card  style={{backgroundColor:'white', border:"1px solid #ccc"}} footer={cardFooter}>
                        <div className="input-wrapper">
                            <span className="p-float-label">
                                <InputText className="input-control" id="float-input" name="username" type="text" size="40" value={this.state.user.username} onChange={this.handleChangeInput} />
                                <label htmlFor="float-input"><UserOutlined className="site-form-item-icon" style={{fontSize: "17px"}}/>  Username</label>
                            </span>
                        </div>
                        <div className="input-wrapper">
                            <span className="p-float-label">
                                <InputText className="input-control" id="float-input" size="40" type="password" name="password" value={this.state.user.password} onChange={this.handleChangeInput}/>
                                <label htmlFor="float-input"><LockOutlined className="site-form-item-icon" style={{fontSize: "17px"}}/> Password</label>
                            </span>
                        </div>
                        <div className="input-wrapper">
                            <Checkbox inputId="cb1" value="Remember password" ></Checkbox>
                            <label htmlFor="cb1" className="p-checkbox-label">Lưu mật khẩu</label>
                        </div>
                        <div className="button-login">
                            <Button label="Login" onClick={this.actionLogin} className="p-button-info" style={{width: 100}} />
                        </div>
                    </Card>
                    </div>
                    
                </div>
            </div>
            </div>
    )}
}