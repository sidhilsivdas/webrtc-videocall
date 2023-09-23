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
import { useState } from 'react';
import moment from 'moment';
import { useParams } from 'react-router';
import RequestContainer from "../elements/RequestContainer";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";


export default class CreateRequest extends Component {
    constructor(props) {

        super(props);
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
            requestItems: [{ id: 1, stock_id: 0, stock_value: "Select - Stock", stock_quantity: 0,quantity: "", price: "" }],
            curRow: 0,
            query: "",
            totalData: {
                quantity: 0,
                price: 0
            },
            selected_customer_id: "",
            quantity_exceed_error:false,
            toRequests:false

        };
        //This binding removeTag is necessary to make `this` work in the callback
        //this.removeEmployee = this.removeClient.bind(this);
        //this.onFormSubmit = this.onFormSubmit.bind(this)
        this.selectorRef = React.createRef(null);
    }

    addItem() {

        if (this.validateForm()) {

            let requestItemArr = [...this.state.requestItems];
            let hCount = requestItemArr.length + 1;
            let item = { id: hCount, stock_id: 0, stock_value: "Select - Stock",stock_quantity:0, quantity: "", price: "" };
            requestItemArr.unshift({ ...item });
            // this.setState({ requestItems: [...requestItemArr], curRow: hCount + 1 });

            this.setState(prevState => ({
                requestItems: [...requestItemArr],
                curRow: hCount

            }), () => {
                this.calculateTotal();
            })

            //console.log("kkk",this.selectorRef.current)

            if (this.selectorRef.current)
                this.selectorRef.current.focus();



        } else {
            alert("Please fill all the for values")
        }

    }

    calculateTotal = () => {
        //console.log(`calTotal`);
        let requestItems = [...this.state.requestItems];
        let totalDataObj = {
            quantity: 0,
            price: 0
        }
        //console.log(requestItems, requestItems.length);
        if (requestItems.length != 0) {

            for (let i = 0; i < requestItems.length; i++) {
                //console.log(totalDataObj[i].quantity)
                totalDataObj.quantity += requestItems[i].quantity ? (+requestItems[i].quantity) : 0;
                totalDataObj.price += requestItems[i].price ? (+requestItems[i].price) : 0;

            }
        }

        this.setState(prevState => ({
            totalData: { ...totalDataObj }

        }))


    }

    updateData(obj) {
        let newObj = { ...obj };
        delete newObj.id;
        delete newObj.created_at;
        this.setState({ modalStatus: true, formFrom: obj.id, formData: { ...newObj } });

    }

    removeItem(index) {

        let requestItemArr = [...this.state.requestItems];
        requestItemArr.splice(index, 1);
        let hCount = requestItemArr.length + 1;

        //requestItemArr.
        const newObj = requestItemArr.map(item => {
            hCount -= 1
            return { ...item, id: hCount }
        }

        );

        this.setState(prevState => ({
            requestItems: [...newObj],
            curRow: hCount

        }), () => {
            this.calculateTotal();
        })

        //this.calculateTotal();

    }





    async componentDidMount() {






    }

    handleInputChange = (e, index) => {
        const { name, value } = e.target;
        let requestItemsArr = this.state.requestItems;
        let quantity_exceed_error = false;
        let newVal = value;

        if(name == "quantity"){
            
            let stock_quantity = +requestItemsArr[index].stock_quantity;
            let current_quantity = stock_quantity - (+value);
           
            //console.log(typeof stock_quantity, typeof current_quantity, current_quantity, stock_quantity)
            if(current_quantity < 0){
                quantity_exceed_error = true;
                newVal = 0
            }else{
                quantity_exceed_error = false;
                
            }
        }
        requestItemsArr[index][name] = newVal;
        //requestItemsArr[index][stock_quantity] = current_quantity

        //console.log(requestItemsArr);
        this.setState(prevState => ({
            requestItems: [...requestItemsArr],
            quantity_exceed_error
        }), () => {
            this.calculateTotal();
        })
    }


    validateForm = () => {
        let requestItemsArr = [...this.state.requestItems];
        for (let i = 0; i < requestItemsArr.length; i++) {
            if (!(requestItemsArr[i].quantity && requestItemsArr[i].price && requestItemsArr[i].stock_id)) {
                return false;
            }
        }
        return true;
    }

    submitForm = () => {
        let selected_customer_id = this.state.selected_customer_id;
        if (!(this.validateForm() && selected_customer_id)) {
            alert("Enter all the values");
        } else {
            let formData = {};
            formData.customer_id = selected_customer_id;
            formData.requests = [ ...this.state.requestItems ]
            //console.log(formData)
            this.setState({isLoading:true});
            const token = localStorage.getItem('token');
    
            const headers = {
                "access-token": token
            }
    
            let method = "POST";
            let url = Constants.API_URL + "/requests";
           
    
            if (true) {
                //console.log("jjjjjjj")
                axios({
                    method: method,
                    url: url,
                    data: formData,
                    headers
                }).then(result => {
                    //setErrorData({});
                    this.setState({isLoading:false});
                    if (result.data.status) {
                        //setIsLoading(false);
                        //props.setModalStatus();
                        alert("Record Saved Successfully");
                        this.setState({toRequests:true})
                        //this.connectParent();
                        
    
                    }
                })
                    .catch(error => {
                        if (error.response) {
                            //props.setModalStatus();
                            this.setState({isLoading:false});
                            alert(error.response.data.message ? error.response.data.message : 'Server error');
                            //console.log(error.response.headers);
                        }
                    });
    
            } else {
                this.setState({isLoading:false});
            }
    
            


        }


    }


    setStockData = (itemId, obj) => {
        //alert(index)

        let requestItemsArr = [...this.state.requestItems];
        //alert(itemId)
        let itemObjArr = requestItemsArr.filter((item) => {
            if (item.id === itemId) {
                item.stock_id = obj.id;
                item.stock_value = obj.product.product_name + " - " + obj.color.color_name;
                item.stock_quantity = +obj.quantity
            }
            return item;
        });


        this.setState(prevState => ({
            requestItems: [...itemObjArr]
        }), () => {
            //this.calculateTotal();
        })

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

    loadAsyncOptions = async (coll) => {
        try {
            const token = localStorage.getItem('token');
            var config = {
                headers: {
                    "access-token": token
                }
            };
            const url = Constants.API_URL + "/" + coll + "/?page=1&perPage=50&q=" + this.state.query;
            let result = await axios.get(url, config);

            var res = result.data;
            return res.data.items;



        } catch (err) {

        }
    }

    setQuery = (value) => {
        this.setState({ query: value })
    }



    render() {
        const isLoading = this.state.isLoading;
        let requestItems = this.state.requestItems;
        let quantity_exceed_error = this.state.quantity_exceed_error;
        if (this.state.toRequests === true) {
            return <Redirect to='/request-management' />
        }
        return (
            <div>







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
                                <li className="breadcrumb-item active">Create Request </li>
                            </ol>
                        </div>
                        <div className="container-fluid">

                            <div className="card mx-auto">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-3"><p>Total Results : {this.state.paginateData.totalItemsCount ? this.state.paginateData.totalItemsCount : 0}</p></div>
                                        <div className='col-md-6'>
                                            {`Total Quantity: ${this.state.totalData.quantity} | Total Price: ${this.state.totalData.price}`}
                                        </div>

                                        <div className="col-md-3 float-right1" >
                                            
                                             <button className='btn btn-primary float-right' onClick={() => {
                                                this.submitForm()
                                            }}>Create</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <AsyncSelect
                                                //cacheOptions
                                                //isMulti
                                                //components={animatedComponents}
                                                getOptionLabel={(e) => e.full_name + " | " + e.shop_name}
                                                getOptionValue={(e) => e.id}
                                                loadOptions={
                                                    () => this.loadOptions('customers')
                                                }
                                                onInputChange={(value) => this.setQuery(value)}
                                                onChange={(value) => this.setState({ selected_customer_id: value.id })}
                                                className={'mb-2'}
                                                placeholder={'Select Customer'}
                                            />
                                        </div>
                                        <div className='col-md-6'>
                                        <Link className="btn btn-success float-right" to="#" onClick={
                                                () => this.addItem()
                                            }>+</Link>
                                        </div>
                                        <div className='col-md-12'>
                                            <div className="table-responsive1">
                                                <table className="table table-bordered" id="dataTable" width="100%"
                                                    cellSpacing="0">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Stock  {quantity_exceed_error && <span className='badge badge-danger float-right'>Not enough stock quantity</span>}</th>
                                                            <th>Quantity</th>
                                                            <th>Price</th>
                                                            <th>X</th>



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
                                                            requestItems && [...requestItems].map((item, index) => {
                                                                let spOpt = item.stock_value.split(" - ");
                                                                let defaultOpt = {
                                                                    product: { product_name: spOpt[0] },
                                                                    color: { color_name: spOpt[1] },
                                                                    quantity:item.quantity,
                                                                    stock_quantity: item.stock_quantity,
                                                                    cur_stock_quantity:(item.stock_quantity - item.quantity)
                                                                };
                                                                //return <RequestContainer key={`re-cont-${index}`} data={{item:{...item}}}/>
                                                                return (<tr key={`req-cont-tr1-${index}`}>
                                                                    <td>
                                                                        {item.id}
                                                                    </td>

                                                                    <td className='request-cont-td' style={{ 'width': '50%' }}>
                                                                        <AsyncSelect
                                                                            value={{ ...defaultOpt }}
                                                                            //cacheOptions
                                                                            autoFocus={(requestItems.length === item.id) ? true : false}
                                                                            ref={item.id == requestItems.length ? this.selectorRef : undefined}
                                                                            //isMulti
                                                                            //components={animatedComponents}
                                                                            getOptionLabel={(e) => {
                                                                                let stock_q;
                                                                                let quantity;
                                                                                let cur_stock_quantity;
                                                                                if(e.stock_quantity){
                                                                                    stock_q = e.stock_quantity;
                                                                                    quantity = e.quantity?e.quantity:0;
                                                                                    cur_stock_quantity = e.cur_stock_quantity;
                                                                                }else{
                                                                                    stock_q = e.quantity;
                                                                                    quantity = 0;
                                                                                    cur_stock_quantity = e.quantity ? e.quantity:0;
                                                                                }
                                                                                
                                                                                if (e.product.product_name != "Select") {
                                                                                    return `${e.product.product_name} - ${e.color.color_name} | (${stock_q} | ${quantity}) - ${cur_stock_quantity}`;
                                                                                } else {
                                                                                    return `Select Stock`;
                                                                                }

                                                                            }}
                                                                            getOptionValue={(e) => e.id}
                                                                            loadOptions={() => 
                                                                                 {
                                                                                    return this.loadAsyncOptions("stocks").then((res) => {
                                                                                        return res
                                                                                          .filter((r) => {
                                                                                            let stockIds = this.state.requestItems.map(item => item.stock_id);
                                                                                            return stockIds.indexOf(r.id) == -1
                                                                                        });
                                                                                          
                                                                                      });
                                                                                 }
                                                                            }
                                                                            onInputChange={(value) => this.setQuery(value)}
                                                                            onChange={(value) => this.setStockData(item.id, value)}
                                                                            className={''}
                                                                        //placeholder={'Select Stocks'}
                                                                        />
                                                                    </td>


                                                                    <td className='request-cont-td'>
                                                                        <input name="quantity" value={this.state.requestItems[index].quantity} onChange={(e) => { this.handleInputChange(e, index) }} type="number" className={"form-control"} />
                                                                    </td>

                                                                    <td className='request-cont-td'>
                                                                        <input onKeyUp={(e) => {
                                                                            e.preventDefault()
                                                                            if (e.key === 'Enter') {
                                                                                this.addItem()
                                                                            }
                                                                        }}
                                                                            name="price" value={this.state.requestItems[index].price} onChange={(e) => { this.handleInputChange(e, index) }} type="number" className={"form-control"} />
                                                                    </td>

                                                                    <td className='request-cont-td'>
                                                                        <Link to={"#"} className={`btn btn-sm btn-danger`} onClick={() => {
                                                                            this.removeItem(index)
                                                                        }}>X</Link>
                                                                    </td>

                                                                </tr>)

                                                            })
                                                        }


                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer small text-muted">
                                    <button className='btn btn-primary float-right' onClick={() => {
                                        this.submitForm()
                                    }}>Create</button>
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
