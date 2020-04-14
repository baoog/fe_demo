import React, { Component } from 'react';
import {ProgressSpinner} from 'primereact/progressspinner';
import '../layout/loading.css';

export class Loading extends Component {

    isLoading(e ){
        
    }
    render(){
        const {isLoading} = this.props;
        if (isLoading == true)
            return(
                <div className="layout">
                    <div className="background"></div>
                    <div className="loading">
                        <ProgressSpinner style={{width: '50px', height: '50px'}}/>
                    </div>
                </div>
            )
        else return(<div></div>)
            }
}