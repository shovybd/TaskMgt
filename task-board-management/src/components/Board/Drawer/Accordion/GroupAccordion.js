import { isEmpty } from "lodash";
import React from "react";
import { Card } from "react-bootstrap";
import CustomRadioButton from "../../../../custom/CustomRadioButton";
import SubGroupAccordion from "./SubGroupAccordion";

//drawer group accordion
const GroupAccordion = ({ groupId, subGroup, groupList, title }) => {
  return (
    <div role="button" className="my-3">
      <div className="accordion " id="groupAccordion">
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
                  
                    <Card className="mt-3" key={index}>
                      <Card.Body className="d-flex">
                        <CustomRadioButton
                          id={index}
                          //onClick={removeTaskHandler}
                        />
                        {groupTaskList.task_title}
                      </Card.Body>
                    </Card>
                  
                ))}

              {isEmpty(groupList) && (
                <p className="mt-3 text-center text-danger">You have no Task</p>
              )}

              {subGroup && <SubGroupAccordion subGroupLists={subGroup} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupAccordion;
