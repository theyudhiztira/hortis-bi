import Auth from './Auth'
import {
    BrowserRouter as Router,
    Switch,
    Redirect
} from 'react-router-dom'
import PublicRoute from './routes/PublicRoute'
import PrivateRoute from './routes/PrivateRoute'
import Login from './pages/login/login'
import Home from './pages/home/home'
import TransactionNew from './pages/transactionNew'
import ReportNew from './pages/reportsNew'
import ReportsSecondLayer from './pages/reportsSecondLayer'
import ReportsThirdLayer from './pages/reportsThirdLayer'
import 'antd/dist/antd.css'


const App = () => {
    const isAuthenticated = Auth.isAuthenticated();


    return (<Router>
        <Switch>
            <PublicRoute exact path='/login' component={Login} isAuthenticated={isAuthenticated} />
            <PrivateRoute exact path='/home' component={Home} isAuthenticated={isAuthenticated} />
            {/* <PrivateRoute exact path='/transaction' component={Transaction} isAuthenticated={isAuthenticated} /> */}
            <PrivateRoute exact path='/transaction-new' component={TransactionNew} isAuthenticated={isAuthenticated} />
            <PrivateRoute exact path='/report-new' component={ReportNew} isAuthenticated={isAuthenticated} />
            <PrivateRoute exact path='/report-second/:data' component={ReportsSecondLayer} isAuthenticated={isAuthenticated} />
            <PrivateRoute exact path='/report-third/:data' component={ReportsThirdLayer} isAuthenticated={isAuthenticated} />
            
            {/* <PrivateRoute exact path='/products' component={Products} isAuthenticated={isAuthenticated} /> */}
            <Redirect to={isAuthenticated ? '/home' : '/login'} />
        </Switch>
    </Router>);
}

export default App;