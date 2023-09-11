import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';



import NotFound from "./pages/notfound";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import GenerateBilling from "./pages/GenerateBilling";
import FlatRateBilling from "./pages/FlatRateBilling";
import EventDetailBilling from "./pages/EventDetailBilling";
import IqBilling from "./pages/IqBilling";
import MonthlyDataPrepMacroView from "./pages/MonthlyDataPrepMacroView";
import UpdateFlatrateBillingMacroView from "./pages/UpdateFlatrateBillingMacroView";
import FlatrateBillingCompleteMacroView from "./pages/FlatrateBillingCompleteMacroView";
import TaskDataUpdateMacroView from './pages/TaskDataUpdateMacroView';
import UpdateBillingHoursMasterMacroView from './pages/UpdateBillingHoursMasterMacroView';
import UpdateIqDataView from './pages/UpdateIqDataView';
import ImportData from './pages/ImportData';

class AppRouter extends Component {

    render() {
        return (
            <div className="App">
                <Router>
                    <Switch>


                        <Route exact path='/' component={Login} />
                        <Route exact path='/login' component={Login} />
                        

                        
                        <Route path='/dashboard' component={Dashboard} />
                        <Route exact path='/billing/generate-billing' component={GenerateBilling} />
                        <Route exact path='/billing/data-import' component={ImportData} />
                        <Route exact path='/billing/flat-rate-billing' component={FlatRateBilling} />
                        <Route exact path='/billing/event-detail-billing' component={EventDetailBilling} />
                        <Route exact path='/billing/iq-billing' component={IqBilling} />
                        <Route path='/billing/flat-rate-billing/monthly-data-prep-macro' component={MonthlyDataPrepMacroView} />
                        <Route path='/billing/flat-rate-billing/update-flatrate-billing-macro' component={UpdateFlatrateBillingMacroView} />
                        <Route path='/billing/flat-rate-billing/flatrate-billing-complete-macro' component={FlatrateBillingCompleteMacroView} />

                        {/* STARTING MONTHLY DETAIL BILLING */}
                         <Route path='/billing/monthly-detail-billing/task-data-update-macro' component={TaskDataUpdateMacroView} /> 
                         <Route path='/billing/monthly-detail-billing/update-billing-hours-master-macro' component={UpdateBillingHoursMasterMacroView} /> 
                         <Route path='/billing/monthly-detail-billing/update-iq-data-macro' component={UpdateIqDataView} /> 

                
                       
                        

                        
                        

                        <Route path='*' component={NotFound} />


                    </Switch>
                </Router>
            </div>
        );
    }
}

export default AppRouter;