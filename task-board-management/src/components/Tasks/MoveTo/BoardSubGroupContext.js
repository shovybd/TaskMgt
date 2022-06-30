import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { ContextMenu, ContextMenuTrigger } from "react-contextmenu";
import CustomRadioButton from "../../../custom/CustomRadioButton";
import SubGroupTaskDelete from "../../Board/Delete/SubGroupTaskDelete";
import BoardMenuContainer from "./BoardMenuContainer";

const BoardSubGroupContext = ({
  boardColumnTask,
  boardId,
  boardColumnId,
  index,
  groupId,
  subGroupId,
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

  // showing submenu when hovering board task mouse right click option move to
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
      <ContextMenuTrigger id={`sub_${boardColumnTask.task_id}`}>
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

      <ContextMenu id={`sub_${boardColumnTask.task_id}`}>
        <Card>
          <Card.Body className="p-0 m-0">
            {menuItem.map((items, index) => (
              <div key={index}>
                {!items.nested && (
                  <SubGroupTaskDelete
                    title={items.item}
                    boardId={boardId}
                    boardColumnId={boardColumnId}
                    taskId={boardColumnTask.task_id}
                    groupId={groupId}
                    subGroupId={subGroupId}
                  />
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

export default BoardSubGroupContext;
