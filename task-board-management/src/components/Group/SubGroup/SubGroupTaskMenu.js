import { useRouter } from "next/router";
import React from "react";
import { URLS } from "../../../utilities/constants";
import MoveToSubGroup from "../../Tasks/MoveTo/MoveToSubGroup";

const SubGroupTaskMenu = ({
  item,
  index,
  groupId,
  isHovering,
  taskId,
  title,
  subGroup,
}) => {
  const router = useRouter();

  //sub group context menu
  return (
    <div>
      <div
        className={
          router.asPath === `${URLS.CREATETASK}`
            ? "d-block context-sub-menu"
            : "d-none"
        }
      >
        {isHovering && index === item && (
          <div className="card p-3">
            {subGroup &&
              subGroup.map((subGroupTask, idx) => (
                <MoveToSubGroup
                  key={idx}
                  groupId={groupId}
                  isHovering={isHovering}
                  taskId={taskId}
                  title={title}
                  subGroupTask={subGroupTask}
                />
              ))}
          </div>
        )}
      </div>

      <div
        className={
          router.asPath === `${URLS.CREATETASK}`
            ? "d-none"
            : "d-block board-subgroup-move"
        }
      >
        <div className="card p-3">
          {subGroup &&
            subGroup.map((subGroupTask, idx) => (
              <MoveToSubGroup
                key={idx}
                groupId={groupId}
                isHovering={isHovering}
                taskId={taskId}
                title={title}
                subGroupTask={subGroupTask}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SubGroupTaskMenu;
