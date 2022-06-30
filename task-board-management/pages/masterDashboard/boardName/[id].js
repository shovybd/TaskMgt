//showing dynamic single board

import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useStateRef from "react-usestateref";
import { fetchSingleBoard } from "../../../src/actions/ApiCall";
import SingleBoard from "../../../src/components/Board/SingleBoard";
import DashboardLayout from "../../../src/components/Layout/DashboardLayout";
import useAuth from "../../../src/Hooks/useAuth";

const BoardDetails = () => {
  const router = useRouter();
  const [boardId, setBoardId, BoardIdRef] = useStateRef("");
  const [groupName, setGroupName] = useState("");
  const [isNested, setIsNested] = useState(false);
  const [boardsingleBoard, setBoardsingleBoard] = useState([]);
  const {
    authTokenRef,
    updateToken,
    setAuthError,
    setAuthSuccess,
    setIsLoading,
    logOut,
  } = useAuth();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (router.isReady) {
      const { name, id } = router.query;

      // fetching single board from backend
      fetchSingleBoard(id, authTokenRef.current)
        .then(async (data) => {
          setBoardsingleBoard(data); // setting response from backend
          setIsNested(data.nested);
          // console.log("single board list", data);
        })
        //catching errors
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
                await fetchSingleBoard(
                  BoardIdRef.current,
                  authTokenRef.current
                );
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
    }
  }, [
    authTokenRef,
    updateToken,
    setAuthError,
    setAuthSuccess,
    logOut,
    setIsLoading,
    BoardIdRef,
    router.isReady,
    router.query,
    //setBoardId,
  ]);

  if (isEmpty(boardsingleBoard)) {
    return <div className="not-found text-center">Board not found</div>;
  }

  return (
    <div>
      {/* single board showing  */}
      {boardsingleBoard && (
        <SingleBoard
          setBoardsingleBoard={setBoardsingleBoard}
          isNested={isNested}
          tasks={boardsingleBoard}
          title={boardsingleBoard?.board_title}
        />
      )}
    </div>
  );
};

BoardDetails.Layout = DashboardLayout;
export default BoardDetails;
