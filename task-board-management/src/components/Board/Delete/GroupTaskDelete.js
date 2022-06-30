import React from "react";
import { nestedBoardGroupTaskDelete } from "../../../actions/ApiCall";
import useAuth from "../../../Hooks/useAuth";

const GroupTaskDelete = ({
  title,
  boardId,
  boardColumnId,
  groupId,
  taskId,
}) => {
  const {
    setIsLoading,
    authTokenRef,
    updateToken,
    setAuthError,
    setAuthSuccess,
    logOut,
  } = useAuth();

  // board group task delete
  const handleGroupTaskDelete = () => {
    console.log("clicked");
    nestedBoardGroupTaskDelete(
      authTokenRef.current,
      boardId,
      boardColumnId,
      groupId,
      taskId
    )
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
              await nestedBoardGroupTaskDelete(
                authTokenRef.current,
                boardId,
                boardColumnId,
                groupId,
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
      <p role="button" onClick={handleGroupTaskDelete}>
        {title}
      </p>
    </div>
  );
};

export default GroupTaskDelete;
