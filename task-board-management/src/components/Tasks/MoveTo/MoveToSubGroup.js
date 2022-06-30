import { useRouter } from "next/router";
import React from "react";
import { taskMoveToSubGroup } from "../../../actions/ApiCall";
import useAuth from "../../../Hooks/useAuth";
import { URLS } from "../../../utilities/constants";
const MoveToSubGroup = ({
  groupId,
  isHovering,
  taskId,
  title,
  subGroupTask,
}) => {
  const {
    authTokenRef,
    updateToken,
    setAuthError,
    setAuthSuccess,
    logOut,
    setIsLoading,
  } = useAuth();

  const router = useRouter();

  //move task to sub group
  const handleTaskToSubGroup = () => {
    taskMoveToSubGroup(
      authTokenRef.current,
      groupId,
      subGroupTask._id,
      taskId,
      title
    )
      .then(async (res) => {
        // console.log(res);
      })
      .catch(async (error) => {
        if (!error.response) {
          setAuthSuccess("");
          setAuthError("NETWOKR ERROR !!!");
        }
        if (error.response) {
          setAuthSuccess("");
          setAuthError(error.response?.data?.errorMessage);

          if (error.response.data.errorMessage) {
            setEditingValue(value);
          }

          if (error.response.data.invalidAuthTokenMessage) {
            await updateToken().then(async (res) => {
              await updateTask(
                authTokenRef.current,
                id,
                editingValueRef.current
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
    <>
      {/* for create task page mouse right click  */}
      {isHovering && (
        <p
          className={
            router.asPath === `${URLS.CREATETASK}` ? "d-block" : "d-none"
          }
          onClick={handleTaskToSubGroup}
        >
          {subGroupTask.sub_group_title}
        </p>
      )}

      {/* for board task mouse right click */}
      <p
        className={
          router.asPath === `${URLS.CREATETASK}` ? "d-none" : "d-block"
        }
        onClick={handleTaskToSubGroup}
      >
        {subGroupTask.sub_group_title}
      </p>
    </>
  );
};

export default MoveToSubGroup;
