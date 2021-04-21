import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// handle the public routes
function PublicRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => {
                if (!rest.isAuthenticated) {
                    return <Component {...props} />
                } else {
                    return <Redirect to={
                        {
                            pathname: "/home"
                        }
                    } />
                }
            }}
        />
    )
}

export default PublicRoute;