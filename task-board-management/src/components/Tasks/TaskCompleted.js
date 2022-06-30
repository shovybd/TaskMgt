import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import useAuth from "../../Hooks/useAuth";

const TaskCompleted = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const { socket, user } = useAuth();
  const [userId, setUserId] = useState(user._id);

  //completed tasks fetching using socket
  useEffect(() => {
    const userData = { userId: userId };
    socket.current.emit("getCompletedTasks", userData);
    socket.current.on("getCompletedTasks", async (res) => {
      const newTaskLists = await res;
      setCompletedTasks(newTaskLists);
    });
  }, [socket, userId, completedTasks]);

  //show 3 row per column
  let modified_completedTasks = [];
  if (completedTasks.length > 0) {
    let index = 0;
    for (let i = 0; i < completedTasks.length; i++) {
      if (i % 3 === 0) {
        index++;
      }
      if (!modified_completedTasks[index]) {
        modified_completedTasks[index] = [];
      }
      modified_completedTasks[index].push(completedTasks[i]);
    }
  }

  return (
    <div className="list-container">
      {modified_completedTasks &&
        modified_completedTasks.map((row, index) => (
          <div key={index} className="card-container">
            <Card className="bg-primary">
              <Card.Body>Completed 3</Card.Body>
            </Card>
            {row &&
              row.map((col, index) => (
                <div key={index} style={{ marginBottom: 10 }}>
                  <del key={index}>
                    <Card style={{ width: "30rem", marginTop: "10px" }}>
                      <Card.Body>
                        <Card.Text>{col.task_title}</Card.Text>
                      </Card.Body>
                    </Card>
                  </del>
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};

export default TaskCompleted;
