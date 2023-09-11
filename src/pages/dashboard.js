import React, { Component } from 'react';
import Header from "../elements/header";
import Sidebar from "../elements/sidebar";
import Footer from "../elements/footer";
import { Link } from 'react-router-dom';
import AdminMain from '../layouts/AdminMain';


export default class Dashboard extends Component {

    render() {
        return (
           <AdminMain>
            <div>
                
                
                    
                    <div id="content-wrapper">
                        <div className="container-fluid">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to={'/dashboard'} >Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item active">Overview</li>
                            </ol>

                            <div className="row d-flex justify-content-center" align="center">
									<h2>Welcome Admin!</h2>
                
  
                            </div>





                        </div>

                        
                    </div>
                
            </div>
            </AdminMain>

        );
    }
}
