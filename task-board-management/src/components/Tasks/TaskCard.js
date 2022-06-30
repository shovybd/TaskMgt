import React from "react";
import { Card } from "react-bootstrap";
import { ContextMenu, ContextMenuTrigger } from "react-contextmenu";
import useStateRef from "react-usestateref";
import { taskComplete } from "../../actions/ApiCall/index";
import CustomRadioButton from "../../custom/CustomRadioButton";
import MenuContainer from "./MoveTo/MenuContainer";
import TaskEdit from "./TaskEdit";
const TaskCard = (props) => {
  const { task, index, taskLists, setTaskLists } = props;
  const [multilineValue, setMultilineValue, multilineValueRef] = useStateRef(
    task?.task_title
  );

  const id = task._id;

  //task completed function
  const removeTaskHandler = (e, index) => {
    taskComplete(authTokenRef.current, task._id)
      .then(async (res) => {
        // console.log(res);
        // const taskToUpdate = id;
        // const newTaskLists = [...taskLists];
        // let deletedTask = newTaskLists.splice(id, 1);
        // const newTasks = taskLists.filter((item) => {
        //   return item._id !== task._id;
        //   // console.log(item._id);
        //   // console.log(task._id);
        // });
        // setTaskLists(newTasks);
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
              await taskComplete(authTokenRef.current, task._id);
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
    <div className="task-card-container btn-group dropend">
      {task && (
        <ContextMenuTrigger id={task._id}>
          <Card>
            <Card.Body className="d-flex">
              <CustomRadioButton onClick={removeTaskHandler} />

              {/* task edit  */}
              <TaskEdit
                className="trello-content-editable"
                tagName="pre"
                value={multilineValueRef.current}
                id={task._id}
                setTaskLists={setTaskLists}
                setValue={setMultilineValue}
              />
            </Card.Body>
          </Card>
        </ContextMenuTrigger>
      )}

      {/* mouse right click menu  */}
      <ContextMenu id={task._id}>
        <MenuContainer title={task.task_title} taskId={task._id} />
      </ContextMenu>
    </div>
  );
};

export default TaskCard;
