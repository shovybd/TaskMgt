import Link from "next/link";
import React from "react";
import { Card } from "react-bootstrap";
import SubGroupTask from "./SubGroupTask";

const SubGroupList = ({ groupList }) => {
  return (
    <div>
      {groupList.sub_group &&
        groupList.sub_group.map((subGroupTask, idx) => (
          <div key={idx}>
            {/* linking with dynamic single sub group page  */}
            <Link
              href={`/masterDashboard/subGroupName/${subGroupTask?._id}?groupid=${groupList?._id}&name=${subGroupTask?.sub_group_title}&supergroup=${groupList?.group_title}`}
              passHref
            >
              <Card role="button">
                <Card.Body className="bg-danger text-white">
                  {subGroupTask?.sub_group_title}
                </Card.Body>
              </Card>
            </Link>
            <SubGroupTask subGroupTasklist={subGroupTask.sub_group_task_list} />
          </div>
        ))}
    </div>
  );
};

export default SubGroupList;
