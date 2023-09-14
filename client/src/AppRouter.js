import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';



import NotFound from "./pages/notfound";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import UserManagement from "./pages/UserManagement";


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
                        

                
                       
                        

                        
                        

                        <Route path='*' component={NotFound} />


                    </Switch>
                </Router>
            </div>
        );
    }
}

export default AppRouter;