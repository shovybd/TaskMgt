import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import GoogleLogin from "react-google-login";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import withAuth from "../HOC/withAuth";
import useAuth from "../src/Hooks/useAuth";
import frame from "/public/images/Frame2.svg";
import frame2 from "/public/images/Frame3.svg";
import ellips from "/public/images/icon/circle.svg";
import dot from "/public/images/icon/dot.svg";
import dot2 from "/public/images/icon/dot3.svg";
import logo from "/public/images/icon/logo.svg";

const Login = () => {
  const [code, setCode] = useState("");
  const history = useRouter();
  const location = history.pathname;
  const {
    user,
    setIsLoading,
    setUser,
    setAuthError,
    setAuthSuccess,
    setAuthToken,
    setRefreshToken,
    loginWithGoogle,
  } = useAuth();

  //google login
  const responseSuccessGoogle = (res) => {
    loginWithGoogle(res, location, history);
  };

  //linkedin login
  const { linkedInLogin } = useLinkedIn({
    clientId: `${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}`,
    redirectUri: `${
      typeof window === "object" && window.location.origin
    }/auth/linkedin/callback`,
    onSuccess: (code) => {
      console.log(code);
      setIsLoading(true);
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/linkedin/callback?code=${code}`
        )
        .then((res) => {
          console.log(res);
          const linkedinResponse = res.data;
          const linkedinUserResponse = res.data.user;
          if (linkedinResponse.authToken && linkedinResponse.refreshToken) {
            window.localStorage.setItem(
              "authToken",
              JSON.stringify(linkedinResponse.authToken)
            );
            window.localStorage.setItem(
              "refreshToken",
              JSON.stringify(linkedinResponse.refreshToken)
            );
            setAuthToken(linkedinResponse.authToken);
            setRefreshToken(linkedinResponse.refreshToken);
            if (linkedinUserResponse) {
              window.localStorage.setItem(
                "user",
                JSON.stringify(linkedinUserResponse)
              );
              const linkedinUserData = window.localStorage.getItem("user");
              const linkedinInitialData = JSON.parse(linkedinUserData);
              setUser(linkedinInitialData);
              const destination = location?.state?.from || "/masterDashboard";
              history.replace(destination);
              setAuthError("");
            }
          }
        })
        .catch(function (error) {
          if (error.response) {
            setAuthSuccess("");
            setAuthError(error.response.data.errorMessage);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
          console.log(error.config);
        })
        .finally(() => setIsLoading(false));
    },
    scope: "r_emailaddress r_liteprofile",
    onError: (error) => {
      console.log(error);
      setCode("");
      console.log(error.errorMessage);
    },
  });

  return (
    <div>
      <div className="position-absolute top-0 start-0 circle ">
        <Image src={ellips} alt="" />
      </div>
      <section className="login-section">
        <div className="position-absolute top-0 end-0">
          <Image src={dot} alt="" />
        </div>
        <div className="logo text-center">
          <Image src={logo} alt="" />
        </div>
        <div className="card-div">
          <div className="wrapper ">
            {/* normal login form  */}

            <form
            // onSubmit={handleSubmit(onSubmit)} // for submitting data
            >
              <div className="badge">
                <Image src={dot2} alt="" />
              </div>

              <h3 className="login-text">Login to your account</h3>

              <label htmlFor="userEmail">Write your email</label>
              <input
                type="email"
                placeholder="Email"
                name="userEmail"
                id="userEmail"
              />

              <label htmlFor="userPassword">Type your password</label>
              <input
                type="password"
                name="userPassword"
                placeholder="Password"
                id="userPassword"
              />

              <button className="login-btn text-center  bg-primary text-white btn col-12 ">
                Login
              </button>

              {/* google login */}
              <GoogleLogin
                clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                render={(renderProps) => (
                  <div
                    onClick={renderProps.onClick}
                    className="social-btn btn col-12"
                  >
                    <div className="social-img">
                      <Image src={frame} alt="" />
                    </div>
                  </div>
                )}
                buttonText="Login"
                onSuccess={responseSuccessGoogle}
                cookiePolicy={"single_host_origin"}
              />
              {/* linkedin login  */}
              <div onClick={linkedInLogin} className="social-btn btn col-12 ">
                <div className="social-img linkedin-login-text ">
                  <Image src={frame2} alt="" />
                </div>
              </div>

              <p className="text-primary sign-up-text">
                Can’t log in? Sign up for an account
              </p>

              <div className="second-badge">
                <Image src={dot2} alt="" />
              </div>
              
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

// export default Login;

export default withAuth(Login, {
  isProtectedRoute: false,
  redirectIfNotAuthenticated: "/login",
  redirectIfAuthenticated: "/masterDashboard",
}); // route is not protected . without login user can access this page. If user is  not logged in then user can't access protected routes without login
