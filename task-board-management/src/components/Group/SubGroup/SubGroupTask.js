import { isEmpty } from "lodash";
import React from "react";
import { Card } from "react-bootstrap";
import CustomRadioButton from "../../../custom/CustomRadioButton";

const SubGroupTask = (props) => {
  const { subGroupTasklist } = props;

  //uncompleted sub group tasks
  let unCompletedTasks = [];
  subGroupTasklist.map((task) => {
    if (!task.task_complete) {
      unCompletedTasks.push(task);
    }
  });

  return (
    <div>
      {isEmpty(unCompletedTasks) && <p>You have no task</p>}

      {unCompletedTasks &&
        unCompletedTasks.map((tasks) => (
          <div key={tasks._id}>
            <Card className="my-3">
              <Card.Body className="d-flex  align-item-center">
                <CustomRadioButton
                  id={`${tasks._id}`}
                  //onClick={removeTaskHandler}
                />
                <p>{tasks.task_title}</p>
              </Card.Body>
            </Card>
          </div>
        ))}
    </div>
  );
};

export default SubGroupTask;
