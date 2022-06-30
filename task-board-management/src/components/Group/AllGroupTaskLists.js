import { isEmpty } from "lodash";
import React from "react";
import { Card } from "react-bootstrap";
import CustomRadioButton from "../../custom/CustomRadioButton";

const AllGroupTaskLists = (props) => {
  const { groupListsTask } = props;

  //uncompleted tasks
  let unCompletedTasks = [];
  groupListsTask.map((task) => {
    if (!task.task_complete) {
      unCompletedTasks.push(task);
    }
  });

  return (
    <div className="my-3">
      {unCompletedTasks &&
        unCompletedTasks.map((list, index) => (
          <div key={index}>
            <Card className="mt-3">
              <Card.Body className="d-flex">
                <CustomRadioButton
                  id={`${list.task_id}`}
                  //onClick={removeTaskHandler}
                />
                <p>{list.task_title} </p>
              </Card.Body>
            </Card>
          </div>
        ))}

      {isEmpty(unCompletedTasks) && <p>you have no task oho</p>}
    </div>
  );
};

export default AllGroupTaskLists;
