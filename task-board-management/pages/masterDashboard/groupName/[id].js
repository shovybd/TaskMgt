//single dynamic group

import { isEmpty } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import useStateRef from "react-usestateref";
import { groupTaskComplete } from "../../../src/actions/ApiCall";
import GroupTitleEdit from "../../../src/components/Group/GroupTitleEdit";
import DashboardLayout from "../../../src/components/Layout/DashboardLayout";
import CustomRadioButton from "../../../src/custom/CustomRadioButton";
import useAuth from "../../../src/Hooks/useAuth";
import BreadCrumb from "../../../src/utilities/BreadCrumb";
import edit from "/public/images/groupEdit.svg";
const GroupEdit = () => {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groupTasks, setGroupTasks] = useState([]);

  const [editable, setEditable, editableRef] = useStateRef(false);
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
  //get single dynamic group data using socket
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (router.isReady) {
      const { name, id } = router.query;
      setGroupId(id);

      const group_Data = { user_id: userId, group_id: id };
      socket.current.emit("getSingleGroupData", group_Data);
      socket.current.on("getSingleGroupData", async (res) => {
        const newTaskLists = await res;
        //console.log(newTaskLists.group_task_list);
        setGroupTasks(newTaskLists.group_task_list);
        setGroupName(newTaskLists.group_title);
      });
    }
  }, [userId, socket, router.isReady, router.query, groupTasks]);

  const toggleEditable = () => setEditable(!editable);

  //uncompleted task showed 6 row per column
  let unCompletedTasks = [];
  let modified_groupTasks = [];
  {
    groupTasks &&
      groupTasks.map((task) => {
        if (!task.task_complete) {
          unCompletedTasks.push(task);
        }
      });

    if (unCompletedTasks.length > 0) {
      let index = 0;
      for (let i = 0; i < unCompletedTasks.length; i++) {
        if (i % 6 === 0) {
          index++;
        }
        if (!modified_groupTasks[index]) {
          modified_groupTasks[index] = [];
        }
        modified_groupTasks[index].push(unCompletedTasks[i]);
      }
    }
  }

  //completd task showed 3 row per column
  let completedTasks = [];
  let modified_completedTasks = [];
  {
    groupTasks &&
      groupTasks.map((task) => {
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
    groupTaskComplete(authTokenRef.current, groupId, taskId)
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
              await groupTaskComplete(authTokenRef.current, groupId, taskId);
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
    <>
      <BreadCrumb>
        <div className="d-flex">
          {/* group title edit */}
          {groupName && (
            <>
              <GroupTitleEdit
                editable={editableRef.current}
                setEditable={setEditable}
                title={groupName}
                id={groupId}
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

      <div className="mt-5 ">
        {isEmpty(modified_groupTasks) && <p>you have no task</p>}
        {/* group uncompleted tasks showed  */}
        <div className="list-container">
          {modified_groupTasks &&
            modified_groupTasks.map((row, index) => (
              <div key={index} className="card-container">
                {row &&
                  row.map((col, index) => (
                    <div key={col._id} style={{ marginBottom: 15 }}>
                      <Card className="mt-3">
                        <Card.Body className="d-flex">
                          <CustomRadioButton
                            id={`${col._id}`}
                            onClick={(e) =>
                              removeTaskHandler(e, `${col.task_id}`)
                            }
                          />
                          <p>{col.task_title}</p>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
              </div>
            ))}
        </div>

        {/* completd tasks showed  */}
        <div className="list-container">
          {modified_completedTasks &&
            modified_completedTasks.map((row, index) => (
              <div key={index} className="card-container">
                <h5>Completed tasks 3</h5>
                {row &&
                  row.map((col) => (
                    <div key={col._id} style={{ marginBottom: 15 }}>
                      <Card className="mt-3">
                        <Card.Body className="d-flex">
                          <CustomRadioButton id={`${col._id}`} />
                          <p>{col.task_title}</p>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

GroupEdit.Layout = DashboardLayout;
export default GroupEdit;
