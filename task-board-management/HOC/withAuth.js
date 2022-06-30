//route is protected or not function

import { withRouter } from "next/router";
import React from "react";

const withAuth = (Component = null, options = {}) => {
  class WithAuthComponent extends React.Component {
    state = {
      pageLoading: true,
      redirectIfNotAuthenticated: options.redirectIfAuthenticated ?? "/login",
      redirectIfAuthenticated:
        options.redirectIfAuthenticated ?? "/masterDashboard",
    };

    componentDidMount() {
      const accessToken = window.localStorage.getItem("authToken");
      const refreshToken = window.localStorage.getItem("refreshToken");

      // Route is protected but not authenticated. SO redirect to Login
      if (options.isProtectedRoute && (!accessToken || !refreshToken)) {
        console.log("You are going to be logged out as no token is found");
        this.props.router.replace(this.state.redirectIfNotAuthenticated);
        return null;
      }

      // Route is not protected but authenticated. So redirect to Dashboard or provided url
      if (!options.isProtectedRoute && accessToken && refreshToken) {
        console.log(
          "You are going to dashboard url as you are already authenticated"
        );
        this.props.router.replace(this.state.redirectIfAuthenticated);
        return null;
      }

      this.setState({ pageLoading: false });
    }

    render() {
      const { pageLoading } = this.state;

      if (pageLoading) {
        return "";
      }
      return <Component {...this.props} />;
    }
  }

  return withRouter(WithAuthComponent);
};

export default withAuth;
