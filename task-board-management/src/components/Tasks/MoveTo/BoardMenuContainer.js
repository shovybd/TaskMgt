import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import useAuth from "../../../Hooks/useAuth";
import MoveToGroup from "./MoveToGroup";

const BoardMenuContainer = ({ title, taskId }) => {
  const [groupLists, setGroupLists] = useState([]);
  const { user, socket } = useAuth();

  const [userId, setUserId] = useState(user._id);
  //fetching groups for board tasks mouse right click
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
    <Card className="context-sub-menu">
      <Card.Body>
        {groupLists &&
          groupLists.map((groupList, index) => (
            <div key={index} className="board-move-to-group">
              <MoveToGroup
                title={title}
                groupIndex={index}
                taskId={taskId}
                groupList={groupList}
              />
            </div>
          ))}
        {isEmpty(groupLists) && <p>No group found</p>}
      </Card.Body>
    </Card>
  );
};

export default BoardMenuContainer;
