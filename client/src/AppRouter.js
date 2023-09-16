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

                
                       
                        

                        
                        

                        <Route path='*' component={NotFound} />


                    </Switch>
                </Router>
            </div>
        );
    }
}

export default AppRouter;