import { isEmpty } from "lodash";
import React from "react";
import BoardContext from "../../Tasks/MoveTo/BoardContext";
import SubGroup from "./SubGroup";

//board group accordion
const Group = ({
  groupId,
  subGroup,
  boardId,
  groupList,
  title,
  boardColumnId,
}) => {
  return (
    <div role="button" className="my-3">
      <div className="accordion " id="boardgroupAccordion">
        <div className="accordion-item">
          <div className="accordion-header" id="headingOne">
            <div
              className="accordion-button collapsed bg-secondary"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collaps_${groupId}`}
              aria-expanded="false"
              // onClick={handleAccordion}
              aria-controls={`collaps_${groupId}`}
            >
              {title}
            </div>
          </div>

          <div
            id={`collaps_${groupId}`}
            className="accordion-collapse collapse"
            aria-labelledby="headingOne"
            data-bs-parent="#groupAccordion"
          >
            <div className="accordion-body accordion-body-section ">
              {groupList &&
                groupList.map((groupTaskList, index) => (
                  <BoardContext
                    key={index}
                    index={index}
                    boardId={boardId}
                    boardColumnTask={groupTaskList}
                    groupId={groupId}
                    boardColumnId={boardColumnId}
                  />
                ))}

              {isEmpty(groupList) && (
                <p className="mt-3 text-center text-danger">You have no Task</p>
              )}

              {subGroup && (
                <SubGroup
                  groupId={groupId}
                  boardId={boardId}
                  boardColumnId={boardColumnId}
                  subGroupLists={subGroup}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;
