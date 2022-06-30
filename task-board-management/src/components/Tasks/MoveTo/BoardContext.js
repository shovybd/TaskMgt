import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { ContextMenu, ContextMenuTrigger } from "react-contextmenu";
import CustomRadioButton from "../../../custom/CustomRadioButton";
import GroupTaskDelete from "../../Board/Delete/GroupTaskDelete";
import TaskDelete from "../../Board/Delete/TaskDelete";
import BoardMenuContainer from "./BoardMenuContainer";
const BoardContext = ({
  boardColumnTask,
  boardId,
  boardColumnId,
  index,
  groupId,
}) => {
  const menuItem = [
    {
      item: "Delete",
      id: 1,
      nested: false,
    },
    {
      item: "Move To",
      id: 2,
      nested: true,
    },
  ];

  //sub menu when hovering the mouse right click nested options
  const [isHovering, setIsHovering] = useState(false);
  const [item, setItem] = useState(-1);

  //onMouseOver
  const handleMouseOver = (e, index) => {
    setItem(index);
    setIsHovering(true);
  };

  //onMouseLeave
  const handleMouseOut = (e, index) => {
    setItem(index);
    setIsHovering(false);
  };

  return (
    <div>
      <ContextMenuTrigger id={boardColumnTask.task_id}>
        <Card className="my-3">
          <Card.Body className="d-flex">
            <CustomRadioButton
              id={index}
              //onClick={removeTaskHandler}
            />
            {boardColumnTask.task_title}
          </Card.Body>
        </Card>
      </ContextMenuTrigger>

      <ContextMenu id={boardColumnTask.task_id}>
        <Card>
          <Card.Body className="p-0 m-0">
            {menuItem.map((items, index) => (
              <div key={index}>
                {!items.nested && (
                  <>
                    {/* task delete of board  */}
                    {!groupId ? (
                      <TaskDelete
                        title={items.item}
                        boardId={boardId}
                        boardColumnId={boardColumnId}
                        taskId={boardColumnTask.task_id}
                      />
                    ) : (
                      <GroupTaskDelete
                        title={items.item}
                        boardId={boardId}
                        boardColumnId={boardColumnId}
                        taskId={boardColumnTask.task_id}
                        groupId={groupId}
                      />
                    )}
                  </>
                )}

                {items.nested && (
                  <div
                    className="move-to-text"
                    onMouseEnter={(e) => handleMouseOver(e, index)}
                    onMouseLeave={(e) => handleMouseOut(e, index)}
                  >
                    <p>{items.item}</p>

                    {isHovering && index === item && (
                      <BoardMenuContainer
                        index={index}
                        title={boardColumnTask.task_title}
                        taskId={boardColumnTask.task_id}
                      ></BoardMenuContainer>
                    )}
                  </div>
                )}
              </div>
            ))}
          </Card.Body>
        </Card>
      </ContextMenu>
    </div>
  );
};

export default BoardContext;
