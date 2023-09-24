import React, { Component } from 'react';
import ReactHtmlParser from "react-html-parser";
import Header from "../elements/header";
import Sidebar from "../elements/sidebar";
import * as Constants from '../config/constants';
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import LoaderDiv from "../elements/LoaderDiv";
//import CsvUpload from "./CsvUpload";
import Alert from "../elements/Alert";
import Pagination from "react-js-pagination";
//require("bootstrap/less/bootstrap.less");
import { Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import moment from 'moment';

import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";

const ViewModal = (props) => {





    const [tableData, setTableData] = useState([]);
    let totalPrice = 0;
    let totalQty = 0;


    useEffect(() => {
        setData();
    }, []);




    const setData = () => {
        const token = localStorage.getItem('token');
        var config = {
            headers: {
                "access-token": token
            }
        };


        const url = Constants.API_URL + "/requests/request-details/" + props.data.viewId;


        if (true) {
            //setState({ isLoading: true });
            axios.get(url, config)
                .then(result => {

                    var res = result.data;
                    //console.log(result);
                    if (res.status == 'success') {

                        setTableData([...res.data.items]);
                        //setPaginationData({ ...paginateData, totalItemsCount: res.data.totalCount });
                        //setStockData({ ...res.data.stockData })
                        // console.log("paginate", this.state.paginateData);
                        //console.log("kkkkk",tableData)

                    } else {
                        //this.setState({ redirect: false, authError: true });
                    }
                })
                .catch(error => {
                    console.log(error);
                    //this.setState({ authError: true, isLoading: false });
                });
        }
    };

    return (

        <div>


            <Modal show={true} size="lg">
                <Modal.Header closeButton onClick={props.setViewModalStatus}>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className='row'>
                        <div className='col-md-12'>
                            <div className="card mx-auto">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-3"><p></p></div>
                                        <div className="col-md-9 float-right1" >



                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">

                                    <div className="table-responsive sticky-scroll-table">
                                        <table className="table table-bordered" id="dataTable" width="100%"
                                            cellSpacing="0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Description</th>
                                                    <th>Color</th>
                                                    <th>QTY</th>
                                                    <th>Price</th>
                                                    <th>Amount</th>


                                                </tr>
                                            </thead>
                                            {/*<tfoot>
                                            <tr>
                                                <th>Job ID</th>
                                                <th>Title</th>
                                                <th>Skills</th>
                                                <th>Location</th>
                                                <th>Experience</th>
                                                <th>Action</th>
                                            </tr>
                                            </tfoot>*/}
                                            <tbody>
                                                {


                                                    tableData && tableData.map((object, i) => {
                                                        const price = object.price * object.quantity;
                                                        totalPrice += price;
                                                        totalQty += object.quantity;
                                                        //console.log(object);
                                                        return(<tr key={"tr-" + i}>
                                                            <td>{object.request_item_id}</td>
                                                            <td>{object.stock.product.product_name} X {object.quantity}</td>
                                                            <td>{object.stock.color.color_name}</td>
                                                            <td>{object.quantity}</td>
                                                            <td>{object.price}</td>
                                                            <td>{price}</td>







                                                        </tr>)
                                                    })
                                                }

                                                {

                                                    tableData.length == 0 && <tr key="tr-1" ><td colSpan="24"><div key="div-1" align="center">No results found</div></td></tr>

                                                }
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                <td colSpan="3">

                                                </td>
                                                <td>
                                                    {totalQty}
                                                </td>
                                                <td>

                                                </td>
                                                <td>
                                                    {totalPrice}
                                                </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>

                                <div className="card-footer small text-muted">

                                </div>
                            </div>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.setViewModalStatus}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>

        </div>
    )
}



export default class RequestManagement extends Component {
    constructor() {
        super();
        this.state = {
            redirect: false,
            toDashboard: false,
            isLoading: false,
            deleted: false,
            paginateData: {
                currentPage: 1,
                itemsCountPerPage: 50,
                totalItemsCount: 0
            },
            page: 1,
            users: [],
            modalStatus: false,
            formFrom: "create",
            formData: {},
            categories: {},
            viewModalStatus: false,
            viewId: 0,
            query: "",
            selected_customer_id: ""
        };
        //This binding removeTag is necessary to make `this` work in the callback
        //this.removeEmployee = this.removeClient.bind(this);
        //this.onFormSubmit = this.onFormSubmit.bind(this)
    }

    createData() {
        this.setState({ modalStatus: true, formFrom: "create", deleted: false, formData: {} });


    }

    updateData(obj) {
        let newObj = { ...obj };
        delete newObj.id;
        delete newObj.created_at;
        this.setState({ deleted: false, modalStatus: true, formFrom: obj.id, formData: { ...newObj } });

    }

    setProductData = (obj) => {
        this.setState(
            { selected_customer_id: obj.id },
            () => {
                this.setData(1)
            });

    }

    loadOptions = (coll) => {
        const token = localStorage.getItem('token');
        var config = {
            headers: {
                "access-token": token
            }
        };

        const url = Constants.API_URL + "/" + coll + "/?page=1&perPage=50&q=" + this.state.query;
        return axios.get(url, config)
            .then(result => {

                var res = result.data;
                return res.data.items;
            })
            .catch(error => {
                console.log(error);
                //this.setState({ authError: true, isLoading: false });
            });
    }

    setQuery = (value) => {
        this.setState({ query: value })
    }



    async componentDidMount() {

        try {
            const token = localStorage.getItem('token');
            var config = {
                headers: {
                    "access-token": token
                }
            };
            const url = Constants.API_URL + "/stocks/?page=1&perPage=50";
            let resData = await axios.get(url, config);

            this.setState({ categories: [...resData.data.data.items] });



        } catch (err) {

        }

        this.setState({ paginateData: { ...this.state.paginateData, currentPage: 1 } });
        this.setData(1);

    }

    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = event => {
        event.preventDefault();
        this.setData(1);
    }

    setData = (page) => {
        const token = localStorage.getItem('token');
        var config = {
            headers: {
                "access-token": token
            }
        };


        const url = Constants.API_URL + "/requests/?page=" + page + "&perPage=" + this.state.paginateData.itemsCountPerPage + "&customer_id=" + this.state.selected_customer_id;


        if (this.state.q != "") {
            this.setState({ isLoading: true });
            axios.get(url, config)
                .then(result => {

                    var res = result.data;
                    //console.log(result);
                    if (res.status == 'success') {

                        this.setState({ isLoading: false, users: res.data.items, paginateData: { ...this.state.paginateData, totalItemsCount: res.data.totalCount } });
                        // console.log("paginate", this.state.paginateData);


                    } else {
                        this.setState({ redirect: false, authError: true });
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.setState({ authError: true, isLoading: false });
                });
        }
    };



    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/job/postings' />
        }
    };

    removeData(obj) {
        if (window.confirm("Are you sure? There is no redo!")) {
            const token = localStorage.getItem('token');
            var config = {
                headers: {
                    "access-token": token
                }
            };

            var id = obj.id;
            this.setState({
                isLoading: true
            });



            const url = Constants.API_URL + "/stocks/" + id;
            axios.delete(url, config)
                .then(result => {

                    var res = result.data;
                    //console.log(result);
                    if (res.status == 'success') {

                        // var newEmps = this.state.emps.filter(function (item) {
                        //     return item.employee_id !== empId
                        // });


                        this.setState({ isLoading: false, deleted: true });
                        this.setData(1);
                        //alert("Employee has been deleted");

                    } else {
                        this.setState({ redirect: false, authError: true });
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.setState({ authError: true, isLoading: false });
                });
        }

    }

    handlePageChange = (pageNumber) => {
        //alert(pageNumber);
        // console.log("triggered", pageNumber);
        this.setState({ deleted: false, paginateData: { ...this.state.paginateData, currentPage: pageNumber } });
        this.setData(pageNumber);
    }

    setModalStatus = () => {
        this.setState({ modalStatus: false });
        //this.setData();
    }

    setViewModalStatus = () => {
        this.setState({ viewModalStatus: false });

    }

    viewRequestDetails = (obj) => {
        this.setState({ viewModalStatus: true, viewId: obj.id });

    }

    render() {
        const isLoading = this.state.isLoading;
        const deleted = this.state.deleted;
        const users = this.state.users;
        const modalStatus = this.state.modalStatus;
        const viewModalStatus = this.state.viewModalStatus;
        const message = "User has been deleted";
        //console.log("deleted", deleted);

        return (
            <div>


                <Alert
                    alertData={
                        {
                            "show": deleted,
                            "message": 'Record Deleted',
                            "title": "Deleted",
                        }
                    } />

                {viewModalStatus && <ViewModal data={{ viewId: this.state.viewId }} setViewModalStatus={this.setViewModalStatus}></ViewModal>}

                <Header />
                <div id="wrapper">
                    {isLoading ? <LoaderDiv /> : null}

                    <Sidebar></Sidebar>
                    <div id="content-wrapper">
                        <div className="container-fluid">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to={'/dashboard'} >Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item active">Requests </li>
                            </ol>
                        </div>
                        <div className="container-fluid">
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className="card mx-auto">
                                        <div className="card-header">
                                            <div className="row">
                                                <div className="col-md-3"><p>Total Results : {this.state.paginateData.totalItemsCount ? this.state.paginateData.totalItemsCount : 0}</p></div>
                                                <div className='col-md-6'>
                                                    <AsyncSelect
                                                        cacheOptions
                                                        //isMulti
                                                        //components={animatedComponents}
                                                        getOptionLabel={(e) => `${e.full_name} - ${e.shop_name}`}
                                                        getOptionValue={(e) => e.id}
                                                        loadOptions={() => this.loadOptions('customers')}
                                                        onInputChange={(value) => this.setQuery(value)}
                                                        onChange={(value) => this.setProductData(value)}
                                                        //className={errorData.product_id ? 'react-select-form-controll-error' : ''}
                                                        placeholder={'Select Product'}
                                                    />
                                                </div>
                                                <div className="col-md-3 float-right1" >
                                                    <Link className="btn btn-primary float-right" to="/create-request">Create Request</Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">

                                            <div className="table-responsive sticky-scroll-table">
                                                <table className="table table-bordered" id="dataTable" width="100%"
                                                    cellSpacing="0">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Customer Name</th>
                                                            <th>Shop Name</th>
                                                            <th>Created At</th>

                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    {/*<tfoot>
                                            <tr>
                                                <th>Job ID</th>
                                                <th>Title</th>
                                                <th>Skills</th>
                                                <th>Location</th>
                                                <th>Experience</th>
                                                <th>Action</th>
                                            </tr>
                                            </tfoot>*/}
                                                    <tbody>
                                                        {
                                                            users && users.map((object, i) =>
                                                                <tr key={"tr-" + i}>
                                                                    <td>{object.id}</td>

                                                                    <td>{object.customer ? object.customer.full_name : ""}</td>
                                                                    <td>{object.customer ? object.customer.shop_name : ""}</td>


                                                                    <td>{moment(object.created_at, "YYYY-MM-DD HH:mm:ss").format('Do MMM YYYY, h:mm A')}</td>


                                                                    <td>


                                                                        <Link className="btn btn-success btn-sm m-1" to={`#`} onClick={
                                                                            () => this.viewRequestDetails(object)
                                                                        }><i className="fa fa-edit"></i></Link>

                                                                    </td>
                                                                </tr>
                                                            )
                                                        }

                                                        {

                                                            users.length == 0 && <tr key="tr-1" ><td colSpan="25"><div key="div-1" align="center">No results found</div></td></tr>

                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="card-footer small text-muted">
                                            {this.state.paginateData.totalItemsCount ?
                                                (<div className="row">
                                                    <div className="col-md-12" >
                                                        <Pagination
                                                            itemClass="page-item"
                                                            linkClass="page-link"
                                                            prevPageText="Prev"
                                                            firstPageText="First"
                                                            lastPageText="Last"
                                                            nextPageText="Next"
                                                            innerClass="pagination justify-content-end"
                                                            activePage={this.state.paginateData.currentPage}
                                                            itemsCountPerPage={this.state.paginateData.itemsCountPerPage}
                                                            totalItemsCount={this.state.paginateData.totalItemsCount}
                                                            pageRangeDisplayed={5}
                                                            onChange={this.handlePageChange.bind(this)}
                                                        />
                                                    </div>
                                                </div>) : null
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-6'>

                                </div>
                            </div>

                        </div>

                        <footer className="sticky-footer">
                            <div className="container my-auto">
                                <div className="copyright text-center my-auto">
                                    <span>Copyright © Your Website <div>{(new Date().getFullYear())}</div></span>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        );
    }
}
