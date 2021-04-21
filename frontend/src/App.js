import Auth from './Auth'
import {
    BrowserRouter as Router,
    Switch,
    Redirect
} from 'react-router-dom'
import PublicRoute from './routes/PublicRoute'
import PrivateRoute from './routes/PrivateRoute'
import Login from './pages/login'
import Home from './pages/home'
import Transaction from './pages/transaction'


const App = () => {
    const isAuthenticated = Auth.isAuthenticated();


    return (<Router>
        <Switch>
            <PublicRoute exact path='/login' component={Login} isAuthenticated={isAuthenticated} />
            <PrivateRoute exact path='/home' component={Home} isAuthenticated={isAuthenticated} />
            <PrivateRoute exact path='/transaction' component={Transaction} isAuthenticated={isAuthenticated} />
            <Redirect to={isAuthenticated ? '/home' : '/login'} />
        </Switch>
    </Router>);
}

export default App;