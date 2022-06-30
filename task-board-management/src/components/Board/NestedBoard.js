import { isEmpty } from "lodash";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Card, Container } from "react-bootstrap";
import CustomRadioButton from "../../custom/CustomRadioButton";
import BoardContext from "../Tasks/MoveTo/BoardContext";
import Group from "./Accordion/Group";
import GroupAccordion from "./Drawer/Accordion/GroupAccordion";
import plus from "/public/images/offcanvasPlus.svg";

const NestedBoard = ({
  taskLists,
  boardColumnTaskList,
  setTaskLists,
  boardDetails,
  tasks,
}) => {
  const [columns, setColumns] = useState(boardDetails);
  const [columnTaskLists, setColumnTaskLists] = useState(boardColumnTaskList);
  const [winReady, setwinReady] = useState(false);
  useEffect(() => {
    setwinReady(true);
  }, []);

  return (
    <>
      <Container>
        <DragDropContext>
          <Droppable
            droppableId="productsSequence"
            direction="horizontal"
            type="column"
          >
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <div className="board-details-content">
                  {columns &&
                    columns.map((boardColumn, i) => (
                      <div key={i} className="column-div">
                        <div className="d-flex justify-content-center align-items-center">
                          <h6 className="me-2">
                            {boardColumn?.board_column_title}
                          </h6>
                          <div>
                            <Image
                              type="button"
                              data-bs-toggle="offcanvas"
                              data-bs-target="#offcanvasRight"
                              aria-controls="offcanvasRight"
                              src={plus}
                              alt=""
                            />
                          </div>
                        </div>
                        {winReady &&
                          boardColumn.board_column_task_list &&
                          boardColumn.board_column_task_list.map(
                            (boardColumnTask, i) => (
                              <div key={`draggable=${i}`} index={i}>
                                {boardColumnTask.task_title && (
                                  <BoardContext
                                    index={i}
                                    boardColumnTask={boardColumnTask}
                                    boardId={tasks._id}
                                    boardColumnId={boardColumn._id}
                                  />
                                )}
                                {boardColumnTask.group_title && (
                                  <Group
                                    groupId={boardColumnTask.group_id}
                                    groupList={boardColumnTask.group_task_list}
                                    subGroup={boardColumnTask.sub_group}
                                    title={boardColumnTask.group_title}
                                    boardId={tasks._id}
                                    boardColumnId={boardColumn._id}
                                  />
                                )}
                              </div>
                            )
                          )}
                        {isEmpty(boardColumn.board_column_task_list) && (
                          <p className="text-danger mt-5">
                            Oops! You have no Task
                          </p>
                        )}
                      </div>
                    ))}
                </div>
                {/* drawer  */}
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
                      {winReady &&
                        taskLists &&
                        taskLists.map((tasks, i) => (
                          <Draggable
                            draggableId={`draggable=${i}`}
                            key={`draggable=${i}`}
                            index={i}
                          >
                            {(provided) => (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                              >
                                {tasks?.task_title && (
                                  <Card className="mt-3 draggable-item">
                                    <Card.Body className="d-flex">
                                      <CustomRadioButton
                                        id={i}
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

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Container>
    </>
  );
};

export default NestedBoard;
