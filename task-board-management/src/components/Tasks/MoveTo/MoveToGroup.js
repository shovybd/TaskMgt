import { isEmpty } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import useStateRef from "react-usestateref";
import { MoveTaskToGroup } from "../../../actions/ApiCall";
import useAuth from "../../../Hooks/useAuth";
import { URLS } from "../../../utilities/constants";
import SubGroupTaskMenu from "../../Group/SubGroup/SubGroupTaskMenu";
import arrow from "/public/images/arrow.svg";

const MoveToGroup = ({ title, groupList, groupIndex, taskId }) => {
  const {
    user,
    socket,
    authTokenRef,
    updateToken,
    setAuthError,
    setAuthSuccess,
    logOut,
    setIsLoading,
  } = useAuth();

  const [isHovering, setIsHovering] = useState(false);
  const [item, setItem, itemRef] = useStateRef(-1);
  const router = useRouter();

  //onMouseOver
  const handleMouseOver = (e, groupIndex) => {
    setItem(groupIndex);
    setIsHovering(true);
  };
  //onMouseLeave
  const handleMouseOut = (e, groupIndex) => {
    setItem(groupIndex);
    setIsHovering(false);
  };

  //move task to Group
  const handleMoveTaskToGroup = () => {
    MoveTaskToGroup(authTokenRef.current, groupList._id, taskId, title)
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
              await MoveTaskToGroup(
                authTokenRef.current,
                groupList._id,
                taskId,
                title
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
      {groupList && (
        <div>
          {groupList.nested ? (
            <div
              onMouseEnter={(e) => handleMouseOver(e, groupIndex)}
              onMouseLeave={(e) => handleMouseOut(e, groupIndex)}
              id="testDropdown"
            >
               {/* for create task mouse right click options sub group menu  */}
              <div
                className={
                  router.asPath === `${URLS.CREATETASK}`
                    ? "d-block btn-group dropend   d-flex justify-content-between"
                    : "d-none"
                }
              >
                <p onClick={handleMoveTaskToGroup}>{groupList.group_title}</p>
                {/* showing sub group  menu  */}
                <SubGroupTaskMenu
                  item={itemRef.current}
                  groupId={groupList._id}
                  taskId={taskId}
                  title={title}
                  index={groupIndex}
                  isHovering={isHovering}
                  subGroup={groupList.sub_group}
                />
                <div>
                  <Image src={arrow} alt="" />
                </div>
              </div>

              {/* for board mouse right click options sub group menu  */}
              <div
                className={
                  router.asPath === `${URLS.CREATETASK}`
                    ? "d-none"
                    : "d-block board-subgroup-move"
                }
              >
                <div className="accordion">
                  <div className="d-flex ">
                    <div className="me-2">
                      <Image src={arrow} alt="" />
                    </div>
                    <p onClick={handleMoveTaskToGroup}>
                      {groupList.group_title}
                    </p>
                  </div>
                  <SubGroupTaskMenu
                    item={itemRef.current}
                    groupId={groupList._id}
                    taskId={taskId}
                    title={title}
                    index={groupIndex}
                    isHovering={isHovering}
                    subGroup={groupList.sub_group}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p onClick={handleMoveTaskToGroup}>{groupList.group_title}</p>
          )}
        </div>
      )}

      {isEmpty(groupList) && <p>You have no group</p>}
    </>
  );
};

export default MoveToGroup;
