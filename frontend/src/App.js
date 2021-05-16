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
import Transaction from './pages/transaction/transaction'
import ReportPage from './pages/reports/reports.view'


const App = () => {
    const isAuthenticated = Auth.isAuthenticated();


    return (<Router>
        <Switch>
            <PublicRoute exact path='/login' component={Login} isAuthenticated={isAuthenticated} />
            <PrivateRoute exact path='/home' component={Home} isAuthenticated={isAuthenticated} />
            <PrivateRoute exact path='/transaction' component={Transaction} isAuthenticated={isAuthenticated} />
            <PrivateRoute exact path='/report' component={ReportPage} isAuthenticated={isAuthenticated} />
            <Redirect to={isAuthenticated ? '/home' : '/login'} />
        </Switch>
    </Router>);
}

export default App;