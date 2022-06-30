import React, { useEffect, useState } from "react";
import useStateRef from "react-usestateref";
import DashboardLayout from "../../src/components/Layout/DashboardLayout";
import TaskCard from "../../src/components/Tasks/TaskCard";
import useAuth from "../../src/Hooks/useAuth";
import { selectAllInlineText } from "../../src/utilities/contentEditable";
import TaskCompleted from "/src/components/Tasks/TaskCompleted";

const CreateTask = () => {
  const { socket, user } = useAuth();

  let [taskLists, setTaskLists] = useState([]);
  const [userId, setUserId, userIdRef] = useStateRef(user._id);
  const [taskTitle, setTaskTitle] = useState("");

  const handleTitleChange = (e) => {
    setTaskTitle(e.target.value);
  };

  //get task list
  useEffect(() => {
    const userData = { userId: userId };
    socket.current.emit("getTasks", userData);
    socket.current.on("getTasks", async (res) => {
      const newTaskLists = await res;
      setTaskLists(newTaskLists);
      //console.log(newTaskLists);
      // if(res.errorMessage){
      // }
    });

    // fetchTaskList(authTokenRef.current)
    //   .then((taskList) => {
    //     setTaskLists(taskList);
    //     console.log(taskList);
    //   })
    //   .catch(async (error) => {
    //     if (!error.response) {
    //       setAuthSuccess("");
    //       setAuthError("NETWOKR ERROR !!!");
    //     }
    //     if (error.response) {
    //       console.log(error.response);
    //       setAuthSuccess("");
    //       setAuthError(error.response?.data?.errorMessage);
    //       if (error.response.data.invalidAuthTokenMessage) {
    //         await updateToken().then(async (res) => {
    //           await fetchTaskList(authTokenRef.current);
    //         });
    //       } else if (error.response.data.invalidRefreshTokenMessage) {
    //         setAuthSuccess("");
    //         setAuthError(error.response.data.invalidRefreshTokenMessage);
    //         logOut();
    //       }
    //     } else if (error.request) {
    //       console.log(error.request);
    //     } else {
    //       console.log("Error", error.message);
    //     }
    //     setIsLoading(false);
    //     console.log(error.config);
    //   });
  }, [
    socket,
    userId,
    taskLists,
    // authTokenRef,
    // setAuthError,
    // setAuthSuccess,
    // setIsLoading,
    // updateToken,
    // logOut,
  ]);

  const data = { taskTitle, userId };

  // create task
  const saveTitleAfterPressEnter = (e) => {
    if (e.key === "Enter") {
      const title = e.target.value;
      socket.current.emit("addTask", data);
      socket.current.on("addTask", async (res) => {
        const newTaskLists = await res;
        // console.log(newTaskLists);
        // setTaskLists((taskLists) => [...taskLists, newTaskLists]);
      });
      e.preventDefault();
      setTaskTitle("");
    }
  };

  //for showing 10 row per column
  let modified_taskLists = [];
  if (taskLists.length > 0) {
    let index = 0;
    for (let i = 0; i < taskLists.length; i++) {
      if (i % 6 === 0) {
        index++;
      }
      if (!modified_taskLists[index]) {
        modified_taskLists[index] = [];
      }
      modified_taskLists[index].push(taskLists[i]);
    }
  }

  return (
    <div className="create-task-div">
      <div className="input-group user-input sms-history-input-group-2">
        <div>
          <input
            id="taskTitle"
            name="taskTitle"
            value={taskTitle}
            type="text"
            onChange={handleTitleChange}
            placeholder="Write task"
            className="form-control textarea-enter-new-card"
            onClick={selectAllInlineText}
            onKeyDown={saveTitleAfterPressEnter}
            // onMouseDown={(e) => e.preventDefault()}
            spellCheck={false}
          />
        </div>
      </div>
      
      {/* all tasks added  */}
      <div className="list-container">
        {modified_taskLists &&
          modified_taskLists.map((row, index) => (
            <div key={index} className="card-container">
              {row &&
                row.map((col, index) => (
                  <div key={col._id} style={{ marginBottom: 15 }}>
                    <TaskCard
                      task={col}
                      index={index}
                      taskLists={taskLists}
                      setTaskLists={setTaskLists}
                    />
                  </div>
                ))}
            </div>
          ))}
      </div>
      {/* completed task  */}
      <TaskCompleted taskLists={taskLists} setTaskLists={setTaskLists} />
    </div>
  );
};

CreateTask.Layout = DashboardLayout;
export default CreateTask;
