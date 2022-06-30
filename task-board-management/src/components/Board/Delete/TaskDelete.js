import React from "react";
import { nestedBoardTaskDelete } from "../../../actions/ApiCall";
import useAuth from "../../../Hooks/useAuth";

const TaskDelete = ({ title, boardId, boardColumnId, taskId }) => {
  const {
    user,
    // socket,
    setIsLoading,
    authTokenRef,
    updateToken,
    setAuthError,
    setAuthSuccess,
    logOut,
  } = useAuth();

  //board normal task delete
  const handleBoardTaskDelete = () => {
      console.log("clicked");
    nestedBoardTaskDelete(authTokenRef.current, boardId, boardColumnId, taskId)
      .then(async (res) => {
        console.log(res);
      })
      .catch(async (error) => {
        if (!error.response) {
          setAuthSuccess("");
          setAuthError("NETWOKR ERROR !!!");
        }
        if (error.response) {
          setAuthSuccess("");
          setAuthError(error.response?.data?.errorMessage);

          if (error.response.data.invalidAuthTokenMessage) {
            await updateToken().then(async (res) => {
              await nestedBoardTaskDelete(
                authTokenRef.current,
                boardId,
                boardColumnId,
                taskId
              );
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
  };

  return (
    <div>
      <p role="button" onClick={handleBoardTaskDelete}>
        {title}
      </p>
    </div>
  );
};

export default TaskDelete;
