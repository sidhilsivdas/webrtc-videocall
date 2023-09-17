import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';



import NotFound from "./pages/notfound";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import UserManagement from "./pages/UserManagement";
import CategoryManagement from "./pages/CategoryManagement";
import ColorManagement from "./pages/ColorManagement";
import ProductManagement from "./pages/ProductManagement";
import StockManagement from "./pages/StockManagement";
import CustomerManagement from "./pages/CustomerManagement";
import PriceManagement from "./pages/PriceManagement";
import RequestManagement from "./pages/RequestManagement";
import CreateRequest from "./pages/CreateRequest";






class AppRouter extends Component {

    render() {
        return (
            <div className="App">
                <Router>
                    <Switch>


                        <Route exact path='/' component={Login} />
                        <Route exact path='/login' component={Login} />
                        

                        
                        <Route path='/dashboard' component={Dashboard} />
                        <Route exact path='/user-management' component={UserManagement} />
                        <Route exact path='/products/category-management' component={CategoryManagement} />
                        <Route exact path='/products/color-management' component={ColorManagement} />
                        <Route exact path='/products/product-management' component={ProductManagement} /> 
                        <Route exact path='/products/stock-management' component={StockManagement} />
                        <Route exact path='/products/customer-management' component={CustomerManagement} />   
                        <Route exact path='/products/price-management' component={PriceManagement} />                        
                        <Route exact path='/products/stock-management/:stockId/price-management' component={PriceManagement} />                        
                        <Route exact path='/request-management' component={RequestManagement} /> 
                        <Route exact path='/create-request' component={CreateRequest} /> 
                        

                
                       
                        

                        
                        

                        <Route path='*' component={NotFound} />


                    </Switch>
                </Router>
            </div>
        );
    }
}

export default AppRouter;