import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { fetchTaskList } from "../../src/actions/ApiCall";
import DashboardLayout from "../../src/components/Layout/DashboardLayout";
import useAuth from "../../src/Hooks/useAuth";
import notaskImg from "/public/images/icon/illustration.svg";

const MasterDashboard = () => {
  let [taskLists, setTaskLists] = useState([]);
  const history = useRouter();
  const {
    setIsLoading,
    authTokenRef,
    updateToken,
    setAuthError,
    setAuthSuccess,
    logOut,
  } = useAuth();

  //get task list
  useEffect(() => {
    fetchTaskList(authTokenRef.current)
      .then((taskList) => {
        setTaskLists(taskList);
      })
      .catch(async (error) => {
        if (!error.response) {
          setAuthSuccess("");
          setAuthError("NETWOKR ERROR !!!"); // network error showing
        }
        if (error.response) {
          console.log(error.response);
          setAuthSuccess("");
          setAuthError(error.response?.data?.errorMessage);
          if (error.response.data.invalidAuthTokenMessage) {
            //if auth token expired update token will be called
            await updateToken().then(async (res) => {
              await fetchTaskList(authTokenRef.current); // after updating authToken again fetching task lists so that user experience not hampered
            });
          } else if (error.response.data.invalidRefreshTokenMessage) {
            setAuthSuccess("");
            setAuthError(error.response.data.invalidRefreshTokenMessage);
            logOut(); // if refreshtoken expired user will be logout
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        setIsLoading(false);
        console.log(error.config);
      });
  }, [
    setIsLoading,
    authTokenRef,
    updateToken,
    setAuthError,
    setAuthSuccess,
    logOut,
  ]);

  //if user have existing tasks which created before then user will be redirected to the createTask page
  if (taskLists.length > 0) {
    history.replace("/masterDashboard/createTask");
  }

  return (
    <>
      {/* if user is new and don't have any task created before this page will be shown */}

      <div className="text-center">
        <div>
          <Image src={notaskImg} alt="" />
        </div>
        <h3>You Have No task</h3>

        {/* by clicking this button user can go create task page . where user can create new tasks */}
        <Link
          href="/masterDashboard/createTask"
          as="/masterDashboard/createTask"
          passHref
        >
          <button className="btn btn-primary">Create New Task</button>
        </Link>
      </div>
    </>
  );
};

MasterDashboard.Layout = DashboardLayout; //for showing sidebar in this page
export default MasterDashboard;
