import React from "react";
import { nestedBoardSubGroupTaskDelete } from "../../../actions/ApiCall";
import useAuth from "../../../Hooks/useAuth";

const SubGroupTaskDelete = ({
  title,
  boardId,
  boardColumnId,
  taskId,
  groupId,
  subGroupId,
}) => {
  const {
    setIsLoading,
    authTokenRef,
    updateToken,
    setAuthError,
    setAuthSuccess,
    logOut,
  } = useAuth();

  //board subgroup task delete
  const handleSubGroupTaskDelete = () => {
    console.log("clicked");
    nestedBoardSubGroupTaskDelete(
      authTokenRef.current,
      title,
      boardId,
      boardColumnId,
      taskId,
      groupId,
      subGroupId
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
              await nestedBoardSubGroupTaskDelete(
                authTokenRef.current,
                title,
                boardId,
                boardColumnId,
                taskId,
                groupId,
                subGroupId
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
      <p role="button" onClick={handleSubGroupTaskDelete}>
        {title}
      </p>
    </div>
  );
};

export default SubGroupTaskDelete;
