import { isEmpty } from "lodash";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { fetchDrawerData } from "../../actions/ApiCall";
import useAuth from "../../Hooks/useAuth";
import Drawer from "./Drawer/Drawer";
import NestedBoard from "./NestedBoard";
import plus from "/public/images/offcanvasPlus.svg";

const SingleBoard = ({ isNested, tasks, title }) => {
  const [taskLists, setTaskLists] = useState([]);

  const {
    authTokenRef,
    updateToken,
    setAuthError,
    setAuthSuccess,
    logOut,
    setIsLoading,
  } = useAuth();

  //fetching group task lists
  useEffect(() => {
    fetchDrawerData(authTokenRef.current)
      .then((data) => {
        setTaskLists(data);
      })
      .catch(async (error) => {
        if (!error.response) {
          setAuthSuccess("");
          setAuthError("NETWOKR ERROR !!!");
        }
        if (error.response) {
          console.log(error.response);
          setAuthSuccess("");
          setAuthError(error.response?.data?.errorMessage);
          if (error.response.data.invalidAuthTokenMessage) {
            await updateToken().then(async (res) => {
              await fetchDrawerData(authTokenRef.current);
              // console.log(callbackFunction);
            });
          } else if (error.response.data.invalidRefreshTokenMessage) {
            setAuthSuccess("");
            setAuthError(error.response.data.invalidRefreshTokenMessage);
            logOut();
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
    authTokenRef,
    updateToken,
    setAuthError,
    setAuthSuccess,
    logOut,
    setIsLoading,
  ]);

  return (
    <div className="singleboard-container">
      {!isNested && (
        <div>
          {title && (
            <div className="d-flex">
              <h6 className="me-2">{title}</h6>
              <div>
                <Image
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasRight"
                  aria-controls="offcanvasRight"
                  src={plus}
                  alt=""
                />
              </div>
            </div>
          )}

          {tasks &&
            tasks.task_list &&
            tasks.task_list.map((taskList, index) => (
              <Card key={index} className="mt-3">
                <Card.Body>{taskList.task_title}</Card.Body>
              </Card>
            ))}
          {isEmpty(tasks.task_list) && (
            <p className=" text-danger">Oops! You have no Task</p>
          )}
        </div>
      )}

      {isNested && (
        <div>
          <NestedBoard
            taskLists={taskLists}
            setTaskLists={setTaskLists}
            boardDetails={tasks.board_column}
            //boardColumnTaskList={tasks.board_column?.board_column_task_list}
            tasks={tasks}
          />
        </div>
      )}

      <Drawer setTaskLists={setTaskLists} taskLists={taskLists} />
    </div>
  );
};

export default SingleBoard;
