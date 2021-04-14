import Auth from './Auth'
import {
    BrowserRouter as Router,
    Switch,
    Redirect
} from 'react-router-dom'
import PublicRoute from './routes/PublicRoute'
// import PrivateRoute from './routes/PrivateRoute'
import Login from './pages/login'


const App = () => {
    const isAuthenticated = Auth.isAuthenticated();


    return (<Router>
        <Switch>
            <PublicRoute exact path='/login' component={Login} isAuthenticated={isAuthenticated} />
            <Redirect to={isAuthenticated ? '/dashboard' : '/login'} />
        </Switch>
    </Router>);
}

export default App;