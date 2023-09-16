import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as Constants from '../config/constants';
//import jwt from 'jsonwebtoken';
//import jwt_decode from 'jwt-decode'

export default class Sidebar extends Component {
    constructor() {
        super();
        this.state = {
            dashboard: false,
            generate_billing: false,
            data_import: false,
            flatrate_billing: false,
            monthly_data_prep_macro: false,
            update_flatrate_billing_macro: false,
            flatrate_billing_complete_macro: false,
            //monthly detail billing
            monthly_detail_billing :false,
            prep_for_data_import_macro: false,
            task_data_update_macro: false,
            update_billing_hours_master_macro: false,
            update_iq_data_macro: false,

            user_management:false,
            products:false,
            category_management:false,
            color_management:false,
            product_management:false,
            stock_management:false




        };
        //This binding removeTag is necessary to make `this` work in the callback
        //this.removeEmployee = this.removeClient.bind(this);
        //this.onFormSubmit = this.onFormSubmit.bind(this)
    }





    componentDidMount() {

        let url = window.location.href
        url = url.split("/")
        //alert(url[url.length-1])
        if (url[url.length - 1] == "dashboard") {
            this.setState({ dashboard: true })
        }

        if (url[url.length - 1] == "user-management") {
            this.setState({ user_management: true })
        }

        if (url[url.length - 1] == "data-import") {
            this.setState({ data_import: true })
        }

        if (url[url.length - 2] == "products") {
            this.setState({ products: true })
            if (url[url.length - 1] == "category-management") {
                this.setState({ category_management: true })
            } else if (url[url.length - 1] == "color-management") {
                this.setState({ color_management: true })
            } else if (url[url.length - 1] == "product-management") {
                this.setState({ product_management: true })
            }else if (url[url.length - 1] == "stock-management") {
                this.setState({ stock_management: true })
            }
        }

        if (url[url.length - 2] == "monthly-detail-billing") {
            this.setState({ monthly_detail_billing: true })
            if (url[url.length - 1] == "prep-for-data-import-macro") {
                this.setState({ prep_for_data_import_macro: true })
            } else if (url[url.length - 1] == "task-data-update-macro") {
                this.setState({ task_data_update_macro: true })
            } else if (url[url.length - 1] == "update-billing-hours-master-macro") {
                this.setState({ update_billing_hours_master_macro: true })
            } else if (url[url.length - 1] == "update-iq-data-macro") {
                this.setState({ update_iq_data_macro: true })
            }
        }








    }


    render() {


        const userData = JSON.parse(localStorage.getItem('userData'));
        const accessToken = userData.accessToken;
        //var decodedClaims = jwt_decode(accessToken, Constants.JWT_SECRET);
        const userType = userData.role;
        var listArr = [];
        console.log("ddd", userData, userType);
        console.log("userType", userType);
        //var hrArr = [];//test changes
        if (userType == "admin") {

            listArr.push(<li key="1-1" className={"nav-item " + (this.state.user_management ? "active" : "")} >
                <Link to={'/user-management'} className="nav-link"><i className="fa fa-user" aria-hidden="true"></i>
                    <span>&nbsp; User Management</span></Link>
            </li>);

            listArr.push(<li key="3" className={"nav-item dropdown " + (this.state.products ? "active show" : "")}>
                <Link className="nav-link dropdown-toggle" to={''} id="pagesDropdown" role="button"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                    <i className="fa fa-desktop" aria-hidden="true"></i><span>&nbsp;Products</span>
                </Link>
                <div className={"dropdown-menu " + (this.state.products ? "show" : "")} aria-labelledby="pagesDropdown">
                    <Link to={'/products/category-management'} className={"nav-link " + (this.state.category_management ? "active" : "")}><h6 className="dropdown-header">Category Management</h6></Link>
                    <Link to={'/products/color-management'} className={"nav-link " + (this.state.color_management ? "active" : "")}><h6 className="dropdown-header">Color Management</h6></Link>
                    <Link to={'/products/product-management'} className={"nav-link " + (this.state.product_management ? "active" : "")}><h6 className="dropdown-header">Product Management</h6></Link>
                    <Link to={'/products/stock-management'} className={"nav-link " + (this.state.stock_management ? "active" : "")}><h6 className="dropdown-header">Stock Management</h6></Link>
                    {/* <div className="dropdown-divider"></div> */}
                </div>


            </li>);

            listArr.push(<li key="4" className={"nav-item dropdown " + (this.state.monthly_detail_billing ? "active show" : "")}>
                <Link className="nav-link dropdown-toggle" to={''} id="pagesDropdown" role="button"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                    <i className="fa fa-calendar" aria-hidden="true"></i><span>&nbsp;Monthly Detail Billing</span>
                </Link>
                <div className={"dropdown-menu " + (this.state.monthly_detail_billing ? "show" : "")} aria-labelledby="pagesDropdown">
                    <Link to={'/billing/monthly-detail-billing/task-data-update-macro'} className={"nav-link " + (this.state.task_data_update_macro ? "active" : "")}><h6 className="dropdown-header">Task Data Update</h6></Link>
                    <Link to={'/billing/monthly-detail-billing/update-billing-hours-master-macro'} className={"nav-link " + (this.state.update_billing_hours_master_macro ? "active" : "")}><h6 className="dropdown-header">Update Billing Hours Master</h6></Link>
                    <Link to={'/billing/monthly-detail-billing/update-iq-data-macro'} className={"nav-link " + (this.state.update_iq_data_macro ? "active" : "")}><h6 className="dropdown-header">Update IQ Data</h6></Link>

                    {/* <div className="dropdown-divider"></div> */}
                </div>


            </li>);



        } else if (userType == "old-admin") {
            listArr.push(<li key="1" className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to={''} id="pagesDropdown" role="button"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i className="fa-light fa-chart-tree-map"></i>
                    <span>&nbsp;Billing</span>
                </Link>
                <div className="dropdown-menu" aria-labelledby="pagesDropdown">
                    <Link to={'/billing/generate-billing'} className="nav-link"><h6 className="dropdown-header">Generate Billing</h6></Link>
                    <Link to={'/billing/flat-rate-billing'} className="nav-link"><h6 className="dropdown-header">Flat Rate Billing</h6></Link>
                    <Link to={'/billing/event-detail-billing'} className="nav-link"><h6 className="dropdown-header">Event Detail Billing</h6></Link>
                    <Link to={'/billing/iq-billing'} className="nav-link"><h6 className="dropdown-header">IQ Billing</h6></Link>
                    {/* <div className="dropdown-divider"></div> */}
                </div>


            </li>);



        } else {
            listArr.push(<li key="1" className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to={''} id="pagesDropdown" role="button"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i className="fas fa-fw fa-folder"></i>
                    <span>&nbsp;Jobs</span>
                </Link>
                <div className="dropdown-menu" aria-labelledby="pagesDropdown">
                    <Link to={'/job/available/'} className="nav-link"><h6 className="dropdown-header">Available Jobs</h6></Link>
                    <Link to={'/jobs/available/'} className="nav-link"><h6 className="dropdown-header">Applied Jobs</h6></Link>
                    {/* <div className="dropdown-divider"></div> */}
                </div>
            </li>);
        }

        return (
            <div id="wrapper">
                <ul className="sidebar navbar-nav">
                    <li className={"nav-item " + (this.state.dashboard ? "active" : "")}>
                        <Link to={'/dashboard'} className="nav-link"><i className="fas fa-fw fa-tachometer-alt"></i>
                            <span>&nbsp;Dashboard</span></Link>
                    </li>

                    {listArr}
                </ul>
            </div>
        );
    }
}
