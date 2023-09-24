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



    let initialStockData = {
        product: { product_name: "" },
        color: { color_name: "" },
        quantity: 0
    }

    const [tableData, setTableData] = useState([]);
    const [stockData, setStockData] = useState({ ...initialStockData });
    const [paginateData, setPaginationData] = useState({
        currentPage: 1,
        itemsCountPerPage: 50,
        totalItemsCount: 0
    });

    useEffect(() => {
        setData(1);
    }, []);


    const handlePageChange = (pageNumber) => {
        //alert(pageNumber);
        // console.log("triggered", pageNumber);
        setPaginationData({ paginateData: { ...paginateData, currentPage: pageNumber } });
        setData(pageNumber);
    }

    const setData = (page) => {
        const token = localStorage.getItem('token');
        var config = {
            headers: {
                "access-token": token
            }
        };


        const url = Constants.API_URL + "/stocks/get-stock-history/" + props.data.viewId + "?page=" + page + "&perPage=" + paginateData.itemsCountPerPage;


        if (true) {
            //setState({ isLoading: true });
            axios.get(url, config)
                .then(result => {

                    var res = result.data;
                    //console.log(result);
                    if (res.status == 'success') {

                        setTableData([...res.data.items]);
                        setPaginationData({ ...paginateData, totalItemsCount: res.data.totalCount });
                        setStockData({ ...res.data.stockData })
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
                                        <div className="col-md-3"><p>Total Results : {paginateData.totalItemsCount ? paginateData.totalItemsCount : 0}</p></div>
                                        <div className="col-md-9 float-right1" >

                                            {stockData ? stockData.product.product_name : ""} | {stockData ? stockData.color.color_name : ""} | Stock: {stockData ? stockData.quantity : 0}

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
                                                    <th>Type</th>
                                                    <th>Quantity</th>
                                                    <th>Quantity Before</th>
                                                    <th>Quantity After</th>
                                                    <th>Created At</th>

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
                                                    tableData && tableData.map((object, i) =>
                                                        <tr key={"tr-" + i}>
                                                            <td>{object.id}</td>
                                                            <td>{(object.customer? `${object.description} to ${object.customer.full_name}`: object.description) }</td>
                                                            <td>{object.type == "add" ? 'Stock Added' : 'Sold'}</td>
                                                            <td>{object.quantity_in}</td>
                                                            <td>{object.quantity_before_update}</td>
                                                            <td>{object.quantity_after_update}</td>


                                                            <td>{moment(object.created_at, "YYYY-MM-DD HH:mm:ss").format('Do MMM YYYY, h:mm A')}</td>



                                                        </tr>
                                                    )
                                                }

                                                {

                                                    tableData.length == 0 && <tr key="tr-1" ><td colSpan="24"><div key="div-1" align="center">No results found</div></td></tr>

                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="card-footer small text-muted">
                                    {paginateData.totalItemsCount ?
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
                                                    activePage={paginateData.currentPage}
                                                    itemsCountPerPage={paginateData.itemsCountPerPage}
                                                    totalItemsCount={paginateData.totalItemsCount}
                                                    pageRangeDisplayed={5}
                                                    onChange={handlePageChange}
                                                />
                                            </div>
                                        </div>) : null
                                    }
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

const ManageModal = (props) => {



    let initialFormData = {
        product_id: "",
        color_id: "",
        quantity: "",
        description: ""

    }

    const [formData, setFormData] = useState(initialFormData);
    const [errorData, setErrorData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [formAction, setFormAction] = useState("create");

    const [query, setQuery] = useState("");

    const [testdata, setTestData] = useState(false);
    const animatedComponents = makeAnimated();

    const validateForm = () => {
        const formClone = { ...formData };
        let errorDetails = {};
        setErrorData({ ...errorDetails });
        for (const [key, value] of Object.entries(formClone)) {

            if (!value) {
                errorDetails[key] = true
            }
        };

        if (Object.keys(errorDetails).length != 0) {
            setErrorData({ ...errorDetails });
            return false;
        }
        //console.log(errorDetails);
        return true;
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {

        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('token');

        const headers = {
            "access-token": token
        }

        let method;
        let url;
        if (props.data.formFrom == "create") {
            url = Constants.API_URL + "/stocks";
            method = "POST";
        } else {
            url = Constants.API_URL + "/stocks/" + props.data.formFrom;
            method = "PUT";
        }

        const formObj = { ...formData, type: "add" };

        if (validateForm()) {
            //console.log("jjjjjjj")
            axios({
                method: method,
                url: url,
                data: formObj,
                headers
            }).then(result => {
                setErrorData({});
                setIsLoading(false);
                if (result.data.status) {
                    //setIsLoading(false);
                    props.setModalStatus();
                    alert("Record Saved Successfully");
                    //this.connectParent();

                }
            })
                .catch(error => {
                    if (error.response) {
                        //props.setModalStatus();
                        setIsLoading(false);
                        alert(error.response.data.message ? error.response.data.message : 'Server error');
                        //console.log(error.response.headers);
                    }
                });

        } else {
            setIsLoading(false);
        }



    }

    const loadOptions = (coll) => {
        const token = localStorage.getItem('token');
        var config = {
            headers: {
                "access-token": token
            }
        };

        const url = Constants.API_URL + "/" + coll + "/?page=1&perPage=50&q=" + query;
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

    return (
        <div>


            <Modal show={true} size="lg">
                <Modal.Header closeButton onClick={props.setModalStatus}>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <div className="form-row">
                                <div className="col-md-12">
                                    <div className="form-label-group">

                                        <AsyncSelect
                                            cacheOptions
                                            //isMulti
                                            components={animatedComponents}
                                            getOptionLabel={(e) => e.product_name}
                                            getOptionValue={(e) => e.id}
                                            loadOptions={() => loadOptions('products')}
                                            onInputChange={(value) => setQuery(value)}
                                            onChange={(value) => setFormData({ ...formData, product_id: +value.id })}
                                            className={errorData.product_id ? 'react-select-form-controll-error' : ''}
                                            placeholder={'Select Product'}
                                        />





                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="form-row">
                                <div className="col-md-12">
                                    <div className="form-label-group">
                                        <AsyncSelect
                                            cacheOptions
                                            //isMulti
                                            components={animatedComponents}
                                            getOptionLabel={(e) => e.color_name}
                                            getOptionValue={(e) => e.id}
                                            loadOptions={() => loadOptions('colors')}
                                            onInputChange={(value) => setQuery(value)}
                                            onChange={(value) => setFormData({ ...formData, color_id: +value.id })}
                                            className={errorData.color_id ? 'react-select-form-controll-error' : ''}
                                            placeholder={'Select Color'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="form-row">
                                <div className="col-md-12">
                                    <div className="form-label-group">
                                        <input name="quantity" value={formData.quantity} onChange={handleInputChange} type="number" className={"form-control " + (errorData.quantity ? 'is-invalid' : '')} autoFocus="autofocus" />
                                        <label htmlFor="quantity">Enter Quantity</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="form-row">
                                <div className="col-md-12">
                                    <div className="form-label-group">
                                        <textarea placeholder={"Description"} name="description" value={formData.description} onChange={handleInputChange} type="text" className={"form-control " + (errorData.description ? 'is-invalid' : '')}></textarea>

                                    </div>
                                </div>
                            </div>
                        </div>



                        <button className="btn btn-primary btn-block" type="submit" disabled={isLoading ? true : false}>Save &nbsp;&nbsp;&nbsp;
                            {isLoading ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                                <span></span>
                            )}
                        </button>

                    </form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.setModalStatus}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>

        </div>
    )
}


export default class StockManagement extends Component {
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
            selected_product_id: ""
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
            { selected_product_id: obj.id },
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


        const url = Constants.API_URL + "/stocks/?page=" + page + "&perPage=" + this.state.paginateData.itemsCountPerPage + "&product_id=" + this.state.selected_product_id;


        if (this.state.q != "") {
            this.setState({ isLoading: true });
            axios.get(url, config)
                .then(result => {

                    var res = result.data;
                    console.log(result);
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
        this.setState({ modalStatus: false, paginateData: { ...this.state.paginateData, currentPage: 1 } });
        this.setData(1);
    }

    setViewModalStatus = () => {
        this.setState({ viewModalStatus: false });

    }

    viewStockDetails = (obj) => {
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

                {modalStatus && <ManageModal data={{ 'formFrom': this.state.formFrom, 'formData': this.state.formData, categories: this.state.categories }} setModalStatus={this.setModalStatus}></ManageModal>}
                {viewModalStatus && <ViewModal data={{ viewId: this.state.viewId }} setViewModalStatus={this.setViewModalStatus}></ViewModal>}

                <Alert
                    alertData={
                        {
                            "show": deleted,
                            "message": 'Record Deleted',
                            "title": "Deleted",
                        }
                    } />



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
                                <li className="breadcrumb-item active">Stocks </li>
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
                                                        getOptionLabel={(e) => e.product_name}
                                                        getOptionValue={(e) => e.id}
                                                        loadOptions={() => this.loadOptions('products')}
                                                        onInputChange={(value) => this.setQuery(value)}
                                                        onChange={(value) => this.setProductData(value)}
                                                        //className={errorData.product_id ? 'react-select-form-controll-error' : ''}
                                                        placeholder={'Select Product'}
                                                    />
                                                </div>
                                                <div className="col-md-3 float-right1" >
                                                    <button className="btn btn-primary float-right" onClick={() => { this.createData() }}>Add/Update</button>
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
                                                            <th>Product Name</th>
                                                            <th>Color</th>
                                                            <th>Quantity</th>

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

                                                                    <td>{object.product ? object.product.product_name : ""}</td>
                                                                    <td>{object.color ? object.color.color_name : ""}</td>
                                                                    <td>{object.quantity}</td>

                                                                    <td>{moment(object.created_at, "YYYY-MM-DD HH:mm:ss").format('Do MMM YYYY, h:mm A')}</td>


                                                                    <td>
                                                                        <Link className="btn btn-warning btn-sm m-1" onClick={() => {
                                                                            this.viewStockDetails(object);
                                                                        }} to={'#'}><i className="fa fa-eye"></i></Link>

                                                                        <Link className="btn btn-success btn-sm m-1" to={`/products/stock-management/${object.id}/price-management`}><i className="fa fa-money"></i></Link>

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
