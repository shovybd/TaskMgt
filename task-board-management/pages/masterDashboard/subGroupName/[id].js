//single dynamic sub group

import { isEmpty } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import useStateRef from "react-usestateref";
import { subGroupTaskComplete } from "../../../src/actions/ApiCall";
import SubGroupTitleEdit from "../../../src/components/Group/SubGroup/SubGroupTitleEdit";
import DashboardLayout from "../../../src/components/Layout/DashboardLayout";
import CustomRadioButton from "../../../src/custom/CustomRadioButton";
import useAuth from "../../../src/Hooks/useAuth";
import BreadCrumb from "../../../src/utilities/BreadCrumb";
import arrow from "/public/images/arrow.svg";
import edit from "/public/images/groupEdit.svg";
const SubGroupEdit = () => {
  const router = useRouter();
  const [subGroupId, setSubGroupId, subGroupIdRef] = useStateRef(null);
  const [superGroupId, setSuperGroupId] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [superGroupName, setSuperGroupName] = useState("");
  const [subGroupTaskList, setSubGroupTaskList] = useState([]);
  const [editable, setEditable, editableRef] = useStateRef(false);
  const toggleEditable = () => setEditable(!editable);

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
  const [userId, setUserId, userIdRef] = useStateRef(user._id);

  //get single group data using socket
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (router.isReady) {
      const { id, groupid, name, supergroup } = router.query;
      setSubGroupId(id);
      setSuperGroupId(groupid);
      setSuperGroupName(supergroup);

      const group_Data = {
        user_id: userId,
        group_id: groupid,
        sub_group_id: id,
      };
      socket.current.emit("getSingleGroupData", group_Data);
      socket.current.on("getSingleGroupData", async (res) => {
        const newTaskLists = await res;
        console.log(newTaskLists.sub_group_task_list);
        setSubGroupTaskList(newTaskLists.sub_group_task_list);
        setGroupName(newTaskLists.sub_group_title);
      });
    }
  }, [
    socket,
    userId,
    router.isReady,
    router.query,
    setSubGroupId,
    subGroupTaskList,
  ]);

  //uncompleted task  showed 6 row per columns
  let unCompletedTasks = [];
  subGroupTaskList.map((task, index) => {
    if (!task.task_complete) {
      unCompletedTasks.push(task);
    }
  });
  let modified_subGroupTaskList = [];
  if (unCompletedTasks.length > 0) {
    let index = 0;
    for (let i = 0; i < unCompletedTasks.length; i++) {
      if (i % 6 === 0) {
        index++;
      }
      if (!modified_subGroupTaskList[index]) {
        modified_subGroupTaskList[index] = [];
      }
      modified_subGroupTaskList[index].push(unCompletedTasks[i]);
    }
  }

  // show completed task 3 row per columns
  let completedTasks = [];
  let modified_completedTasks = [];
  {
    subGroupTaskList &&
      subGroupTaskList.map((task) => {
        if (task.task_complete) {
          completedTasks.push(task);
        }
      });

    if (completedTasks.length > 0) {
      let index = 0;
      for (let i = 0; i < completedTasks.length; i++) {
        if (i % 3 === 0) {
          index++;
        }
        if (!modified_completedTasks[index]) {
          modified_completedTasks[index] = [];
        }
        modified_completedTasks[index].push(completedTasks[i]);
      }
    }
  }

  //task completed function
  const removeTaskHandler = (e, taskId) => {
    subGroupTaskComplete(authTokenRef.current, superGroupId, subGroupId, taskId)
      .then(async (res) => {
        console.log(res);
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
              await subGroupTaskComplete(
                authTokenRef.current,
                superGroupId,
                subGroupId,
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
    e.preventDefault();
  };

  return (
    <section>
      <BreadCrumb>
        <div className="d-flex">
          {/* linking with super group */}
          <Link
            href={`/masterDashboard/groupName/${superGroupId}?name=${superGroupName}`}
            passHref
          >
            {superGroupName}
          </Link>

          <span className="ms-1 me-1 ">
            <Image src={arrow} width="6px" height="10px" alt="" />
          </span>

          {/* sub group title edit  */}
          {groupName && (
            <>
              <SubGroupTitleEdit
                editable={editableRef.current}
                setEditable={setEditable}
                title={groupName}
                subGroupId={subGroupId}
                groupId={superGroupId}
              />
              <div className="ms-2 me-1 edit-Img">
                <Image
                  onClick={toggleEditable}
                  src={edit}
                  width="15px"
                  height="15px"
                  alt=""
                />
              </div>
            </>
          )}
        </div>
      </BreadCrumb>

      <div className="mt-5 list-container">
        {modified_subGroupTaskList &&
          modified_subGroupTaskList.map((row, index) => (
            <div key={index} className="card-container">
              {row &&
                row.map((col, index) => (
                  <div key={index}>
                    <Card className="mt-3">
                      <Card.Body className="d-flex">
                        <CustomRadioButton // by clicking radio button task will be completed
                          id={`${col._id}`}
                          onClick={(e) =>
                            removeTaskHandler(e, `${col.task_id}`)
                          }
                        />
                        {col.task_title}
                      </Card.Body>
                    </Card>
                  </div>
                ))}
            </div>
          ))}
        {/* if modified_subGroupTaskList  empty this will be shown */}
        {isEmpty(modified_subGroupTaskList) && <p>You have no task</p>}
      </div>

      {/* completed task showed  */}
      <div className="mt-5 list-container">
        {modified_completedTasks &&
          modified_completedTasks.map((row, index) => (
            <div key={index} className="card-container">
              <h5>Completed tasks 3</h5>
              {row &&
                row.map((col, index) => (
                  <div key={index}>
                    <Card className="mt-3">
                      <Card.Body className="d-flex">
                        <CustomRadioButton id={`${col._id}`} />
                        {col.task_title}
                      </Card.Body>
                    </Card>
                  </div>
                ))}
            </div>
          ))}
      </div>
    </section>
  );
};

SubGroupEdit.Layout = DashboardLayout;
export default SubGroupEdit;
