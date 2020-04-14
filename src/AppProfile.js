import React, { Component } from 'react';
import classNames from 'classnames';

export class AppProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            username:'',
            avatar: ''
        };

        this.onClick = this.onClick.bind(this);
    }
    onClick(event) {
        this.setState({expanded: !this.state.expanded});
        event.preventDefault();
    }
    async Logout(){
        await localStorage.removeItem("user_token")
        await localStorage.removeItem("avatar")
        await localStorage.removeItem("username")
        await (window.location.reload(true))
    }
    render() {
        return  (
            <div className="layout-profile">
                <div>
                    <img src={this.props.Avatar} alt="" />
                </div>
                <button className="p-link layout-profile-link" onClick={this.onClick}>
                    <span className="username">{this.props.Username}</span>
                    <i className="pi pi-fw pi-cog"/>
                </button>
                <ul className={classNames({'layout-profile-expanded': this.state.expanded})}>
                    <li><button className="p-link"><i className="pi pi-fw pi-user"/><span>Account</span></button></li>
                    <li><button className="p-link"><i className="pi pi-fw pi-inbox"/><span>Notifications</span><span className="menuitem-badge">2</span></button></li>
                    <li onClick={this.Logout}><button className="p-link"><i className="pi pi-fw pi-power-off" /><span>Logout</span></button></li>
                </ul>
            </div>
        );
    }
}