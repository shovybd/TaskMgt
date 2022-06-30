import { isEmpty } from "lodash";
import React from "react";
import { Card } from "react-bootstrap";
import { Draggable } from "react-smooth-dnd";
import CustomRadioButton from "../../../custom/CustomRadioButton";
import GroupAccordion from "./Accordion/GroupAccordion";

// board drawer
const Drawer = ({  taskLists, tasks }) => {
  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="offcanvasRight"
      aria-labelledby="offcanvasRightLabel"
    >
      <div className="offcanvas-header border-bottom">
        <p id="offcanvasRightLabel">Task List</p>
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        <div className="mt-3 ">
          {taskLists &&
            taskLists.map((tasks, index) => (
              <Draggable key={index}>
                {tasks?.task_title && (
                  <Card className="mt-3 draggable-item">
                    <Card.Body className="d-flex">
                      <CustomRadioButton
                        id={index}
                        //onClick={removeTaskHandler}
                      />
                      {tasks?.task_title}
                    </Card.Body>
                  </Card>
                )}
                {tasks?.group_id && (
                  <div>
                    <GroupAccordion
                      groupId={tasks.group_id}
                      groupList={tasks?.group_task_list}
                      subGroup={tasks?.sub_group}
                      title={tasks.group_title}
                    />
                  </div>
                )}
              </Draggable>
            ))}

          {isEmpty(taskLists) && (
            <p className="mt-3 text-danger">You have no Task</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
