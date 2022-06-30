import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import useStateRef from "react-usestateref";
import { io } from "socket.io-client";

const useAuthentication = () => {
  //checking localstorage and getting tokens and user data
  let localUserState = null;
  if (typeof localStorage !== "undefined" && localStorage.getItem("user"))
    try {
      localUserState = JSON.parse(localStorage.getItem("user") || "");
    } catch (error) {
      console.error("Not a JSON response");
    }

  let localAuthTokenState = null;
  if (
    typeof localStorage !== "undefined" &&
    localStorage.getItem("authToken")
  ) {
    localAuthTokenState = JSON.parse(localStorage.getItem("authToken") || "");
  }
  let localRefreshStateToken = null;
  if (
    typeof localStorage !== "undefined" &&
    localStorage.getItem("refreshToken")
  ) {
    localRefreshStateToken = JSON.parse(
      localStorage.getItem("refreshToken") || ""
    );
  }

  const history = useRouter();

  const location = history.pathname;
  const [authToken, setAuthToken, authTokenRef] = useStateRef(
    localAuthTokenState || ""
  );

  const [refreshToken, setRefreshToken] = useState(
    localRefreshStateToken || ""
  );
  const [user, setUser] = useState(localUserState || {});
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState("");
  const [authError, setAuthError] = useState("");

  //google login
  const loginWithGoogle = async (res, location, history) => {
    setIsLoading(true);
    const data = { tokenId: res.tokenId };
    // google login api
    await axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/google-login`, data)
      .then((res) => {
        console.log(res);
        let googleResponse = res.data;
        if (googleResponse.authToken && googleResponse.refreshToken) {
          //set auth token to localstorage
          window.localStorage.setItem(
            "authToken",
            JSON.stringify(googleResponse.authToken)
          );
          //set auth token to localstorage
          window.localStorage.setItem(
            "refreshToken",
            JSON.stringify(googleResponse.refreshToken)
          );
          setAuthToken(googleResponse.authToken);
          setRefreshToken(googleResponse.refreshToken);
          //set user to the localstorage
          if (googleResponse.user) {
            window.localStorage.setItem(
              "user",
              JSON.stringify(googleResponse.user)
            );
            const googleUserData = window.localStorage.getItem("user");
            const googleInitialData = JSON.parse(googleUserData);
            setUser(googleInitialData);
            //after successfull login redirecting the user to the masterDashboard page
            const destination = location?.state?.from || "/masterDashboard";
            history.replace(destination);
            setAuthError("");
          }
        }
      })
      //catching errors
      .catch(function (error) {
        if (!error.response) {
          setAuthSuccess("");
          setAuthError("NETWOKR ERROR !!!");
        }
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
  };

  //update token
  let updateToken = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/user/refresh-token`, {
        headers: {
          "refresh-token": refreshToken,
        },
      })
      .then((res) => {
        const dataResponse = res.data;
        if (dataResponse.authToken) {
          //setting new auth token in localstorage
          window.localStorage.setItem(
            "authToken",
            JSON.stringify(dataResponse.authToken)
          );
          setAuthToken(dataResponse.authToken);
        } else if (dataResponse.userRefreshTokenErrorMessage) {
          logOut();
        }

        if (isLoading) {
          setIsLoading(false);
        }
      })
      .catch(function (error) {
        if (!error.response) {
          setAuthSuccess("");
          setAuthError("NETWOKR ERROR !!!");
        }
        if (error.response) {
          setAuthSuccess("");
          setAuthError(error.response.data.errorMessage);
          if (error.response.data.invalidRefreshTokenMessage) {
            setAuthError(error.response.data.invalidRefreshTokenMessage);
            logOut(); // if refresh token expired user will be logged out
          }
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      })
      .finally(() => setIsLoading(false));
  };

  //logout
  const logOut = async () => {
    setIsLoading(true);
    await axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/user/logout`, {
        headers: {
          "refresh-token": refreshToken,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.userLogoutMessage) {
          setUser("");
          localStorage.clear();
          history.push("/login");
        }
      })
      .catch((error) => {
        if (!error.response) {
          setAuthSuccess("");
          setAuthError("NETWOKR ERROR !!!");
        }
        if (error.response) {
          setAuthSuccess("");
          setAuthError(error.response.data.errorMessage);
        }
      })
      .finally(() => setIsLoading(false));
  };

  // socket connection
  const socket = useRef();
  useEffect(() => {
    socket.current = io(`${process.env.NEXT_PUBLIC_BASE_URL_SOCKET}`);
  }, []);

//returning all states and functions so that all the children can access
  return {
    socket,
    user,
    setUser,
    loginWithGoogle,
    setIsLoading,
    setAuthError,
    setAuthSuccess,
    logOut,
    authToken,
    authTokenRef,
    setAuthToken,
    setRefreshToken,
    refreshToken,
    updateToken,
    history,
  };
};

export default useAuthentication;
