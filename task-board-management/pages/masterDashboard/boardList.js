import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import useStateRef from "react-usestateref";
import BoardEdit from "../../src/components/Board/BoardEdit";
import DashboardLayout from "../../src/components/Layout/DashboardLayout";
import HeaderNav from "../../src/components/Shared/HeaderNav";
import useAuth from "../../src/Hooks/useAuth";
import editImg from "/public/images/edit.svg";

const BoardList = () => {
  const { user, socket } = useAuth();
  const [userId, setUserId] = useState(user._id);
  const [boardLists, setBoardLists] = useState([]);
  const [editable, setEditable, editableRef] = useStateRef(false);

  //get all baords using socket
  useEffect(() => {
    const userData = { userId: userId };
    socket.current.emit("getBoards", userData);
    socket.current.on("getBoards", async (res) => {
      const newBoardLists = await res;
      setBoardLists(newBoardLists);
    });
  }, [socket, userId, boardLists]);

  const toggleEditable = () => setEditable(!editable); //toggle editable

  //for showing 10 row per column
  let modified_boardLists = [];
  if (boardLists.length > 0) {
    let index = 0;
    for (let i = 0; i < boardLists.length; i++) {
      if (i % 10 === 0) {
        index++;
      }
      if (!modified_boardLists[index]) {
        modified_boardLists[index] = [];
      }
      modified_boardLists[index].push(boardLists[i]);
    }
  }

  return (
    <div>
      <HeaderNav />
      <div className="mt-5 list-container">
        {/* showing board list  */}
        {modified_boardLists &&
          modified_boardLists.map((row, index) => (
            <div key={index} className="card-container">
              {row &&
                row.map((col, index) => (
                  <div key={index} style={{ marginBottom: 15 }}>
                    <Card>
                      <Card.Body className="d-flex">
                        {/* if user click on card user will be redirected to the dynamic single board  */}
                        <Link
                          href={
                            editable
                              ? ""
                              : `/masterDashboard/boardName/${col?._id}?name=${col?.board_title}`
                          }
                          passHref
                        >
                          <a>
                            <BoardEdit
                              title={col?.board_title}
                              id={col?._id}
                              editable={editableRef.current}
                              setEditable={setEditable}
                            />
                          </a>
                        </Link>

                        {/* user will be able to edit the title of board by clicking this img  */}
                        <Image
                          onClick={toggleEditable}
                          src={editImg}
                          alt=""
                          role="button"
                        />
                      </Card.Body>
                    </Card>
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};

BoardList.Layout = DashboardLayout;
export default BoardList;
