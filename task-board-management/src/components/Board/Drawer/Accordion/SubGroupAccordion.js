import { isEmpty } from "lodash";
import React from "react";
import { Card } from "react-bootstrap";
import CustomRadioButton from "../../../../custom/CustomRadioButton";

// drawer subgroup accordion
const SubGroupAccordion = ({ subGroupLists }) => {
  return (
    <div>
      {subGroupLists &&
        subGroupLists.map((subGroupList, index) => (
          <div key={index}>
            <div role="button" className="my-3">
              <div className="accordion " id="subGroupAccordion">
                <div className="accordion-item">
                  <div className="accordion-header" id="headingOne">
                    <div
                      className="accordion-button collapsed bg-danger"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collaps_${subGroupList._id}`}
                      aria-expanded="false"
                      // onClick={handleAccordion}
                      aria-controls={`collaps_${subGroupList._id}`}
                    >
                      {subGroupList.sub_group_title}
                    </div>
                  </div>

                  <div
                    id={`collaps_${subGroupList._id}`}
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#subGroupAccordion"
                  >
                    <div className="accordion-body accordion-body-section ">
                      {subGroupList.sub_group_task_list &&
                        subGroupList.sub_group_task_list.map(
                          (subGroupTask, index) => (
                            <Card className="mt-3" key={index}>
                              <Card.Body className="d-flex">
                                <CustomRadioButton
                                  id={index}
                                  //onClick={removeTaskHandler}
                                />
                                {subGroupTask.task_title}
                              </Card.Body>
                            </Card>
                          )
                        )}

                      {isEmpty(subGroupLists) && (
                        <p className="mt-3 text-center text-danger">
                          You have no Task
                        </p>
                      )}
                      {isEmpty(subGroupList.sub_group_task_list) && (
                        <p className="mt-3 text-center text-danger">
                          You have no Task
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SubGroupAccordion;
