import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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

        if (url[url.length - 1] == "generate-billing") {
            this.setState({ generate_billing: true })
        }

        if (url[url.length - 1] == "data-import") {
            this.setState({ data_import: true })
        }

        if (url[url.length - 2] == "flat-rate-billing") {
            this.setState({ flatrate_billing: true })
            if (url[url.length - 1] == "monthly-data-prep-macro") {
                this.setState({ monthly_data_prep_macro: true })
            } else if (url[url.length - 1] == "update-flatrate-billing-macro") {
                this.setState({ update_flatrate_billing_macro: true })
            } else if (url[url.length - 1] == "flatrate-billing-complete-macro") {
                this.setState({ flatrate_billing_complete_macro: true })
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
        const userType = userData.user_type;
        var listArr = [];
        console.log("ddd", userData, userType);
        console.log("userType", userType);
        //var hrArr = [];//test changes
        if (userType == "admin") {

            listArr.push(<li key="1-1" className={"nav-item " + (this.state.data_import ? "active" : "")} >
                <Link to={'/billing/data-import'} className="nav-link"><i className="fa fa-cloud-download" aria-hidden="true"></i>
                    <span>&nbsp; Data Import</span></Link>
            </li>);

            listArr.push(<li key="2" className={"nav-item " + (this.state.generate_billing ? "active" : "")} >
                <Link to={'/billing/generate-billing'} className="nav-link"><i className="fa fa-align-justify" aria-hidden="true"></i>
                    <span>&nbsp; Generate Billing</span></Link>
            </li>);


            listArr.push(<li key="3" className={"nav-item dropdown " + (this.state.flatrate_billing ? "active show" : "")}>
                <Link className="nav-link dropdown-toggle" to={''} id="pagesDropdown" role="button"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                    <i className="fa fa-line-chart" aria-hidden="true"></i><span>&nbsp;Flat Rate Billing</span>
                </Link>
                <div className={"dropdown-menu " + (this.state.flatrate_billing ? "show" : "")} aria-labelledby="pagesDropdown">
                    <Link to={'/billing/flat-rate-billing/monthly-data-prep-macro'} className={"nav-link " + (this.state.monthly_data_prep_macro ? "active" : "")}><h6 className="dropdown-header">Monthly Data Prep</h6></Link>
                    <Link to={'/billing/flat-rate-billing/update-flatrate-billing-macro'} className={"nav-link " + (this.state.update_flatrate_billing_macro ? "active" : "")}><h6 className="dropdown-header">Update Flatrate Billing</h6></Link>
                    <Link to={'/billing/flat-rate-billing/flatrate-billing-complete-macro'} className={"nav-link " + (this.state.flatrate_billing_complete_macro ? "active" : "")}><h6 className="dropdown-header">Flatrate Billing Complete</h6></Link>

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
