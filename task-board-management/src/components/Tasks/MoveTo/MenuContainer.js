import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { MenuItem } from "react-contextmenu";
import useAuth from "../../../Hooks/useAuth";
import MoveToGroup from "./MoveToGroup";

const MenuContainer = ({ title, taskId }) => {
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

  //fetching all group lists for mouse right click
  useEffect(() => {
    const userData = { userId: userId };
    socket.current.emit("getGroups", userData);
    socket.current.on("getGroups", async (res) => {
      const newGroupLists = await res;
      //console.log(newGroupLists);
      setGroupLists(newGroupLists);
    });
  }, [socket, userId, groupLists]);
  return (
    <Card>
      <Card.Body>
        <Card.Title>Move To</Card.Title>
        <MenuItem>
          {groupLists &&
            groupLists.map((groupList, index) => (
              <div key={index} className="task-move-to-group">
                <MoveToGroup
                  title={title}
                  groupIndex={index}
                  taskId={taskId}
                  groupList={groupList}
                />
              </div>
            ))}

          {isEmpty(groupLists) && <p>No group found</p>}
        </MenuItem>
      </Card.Body>
    </Card>
  );
};

export default MenuContainer;
