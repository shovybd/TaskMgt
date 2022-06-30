import { isEmpty } from "lodash";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import AllGroupTaskLists from "../../src/components/Group/AllGroupTaskLists";
import SubGroupList from "../../src/components/Group/SubGroup/SubGroupList";
import DashboardLayout from "../../src/components/Layout/DashboardLayout";
import HeaderNav from "../../src/components/Shared/HeaderNav";
import useAuth from "../../src/Hooks/useAuth";

const GroupList = () => {
  const [groupLists, setGroupLists] = useState([]);
  const {
    user,
    socket,
    authTokenRef,
    updateToken,
    setAuthError,
    setAuthSuccess,
    logOut,
    setIsLoading,
  } = useAuth();

  const [userId, setUserId] = useState(user._id);

  //get groups using socket
  useEffect(() => {
    const userData = { userId: userId };
    socket.current.emit("getGroups", userData);
    socket.current.on("getGroups", async (res) => {
      const newGroupLists = await res;
      setGroupLists(newGroupLists);
      console.log(newGroupLists);
    });
  }, [socket, userId, groupLists]);

  return (
    <div>
      <HeaderNav /> {/*   second navbar  */}
      {/* all group lists shown here  */}
      <div className="mt-5 group-container">
        {groupLists &&
          groupLists.map((groupList, index) => (
            <div key={index} className="group-card-container">
              <Link
                href={`/masterDashboard/groupName/${groupList?._id}?name=${groupList?.group_title}`}
                passHref
              >
                <a>
                  <Card role="button" className="group-card">
                    <Card.Body className="bg-secondary text-white">
                      {groupList.group_title}
                    </Card.Body>
                  </Card>
                </a>
              </Link>

              {/* showing group task lists  */}
              <AllGroupTaskLists groupListsTask={groupList.group_task_list} />

              {/* showing sub group lists  */}
              {groupList.nested && <SubGroupList groupList={groupList} />}
            </div>
          ))}

        {isEmpty(groupLists) && <p>You have no group</p>}
      </div>
    </div>
  );
};
GroupList.Layout = DashboardLayout;
export default GroupList;
