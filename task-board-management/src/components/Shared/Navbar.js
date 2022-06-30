import { isEmpty } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { CREATE_BOARD, CREATE_GROUP } from "../../utilities/constants";
import CommonModal from "./CommonModal";
import logout from "/public/images/logout.svg";

const Navbar = () => {
  const router = useRouter();
  const [boardLists, setBoardLists] = useState([]);
  const [groupLists, setGroupLists] = useState([]);
  const [isBoard, setIsBoard] = useState(false);
  const [isGroup, setIsGroup] = useState(false);

  const {
    user,
    socket,
    logOut,
    authTokenRef,
    updateToken,
    setAuthError,
    setAuthSuccess,
    setIsLoading,
  } = useAuth();

  const [userId, setUserId] = useState(user._id);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // show modal
  const toglleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);
  const toglleBoard = () => {
    setIsGroup(false);
    setIsBoard(true);
  };
  const toglleGroup = () => {
    setIsBoard(false);
    setIsGroup(true);
  };
  const onConfirmModalAction = (type) => {
    toglleShowConfirmModal();
  };

  const handleBoard = () => {
    toglleShowConfirmModal();
    toglleBoard();
  };
  const handleGroup = () => {
    toglleShowConfirmModal();
    toglleGroup();
  };

  //get all boards and groups using socket
  useEffect(() => {
    const userData = { userId: userId };
    socket.current.emit("getBoards", userData);
    socket.current.on("getBoards", async (res) => {
      const newBoardLists = await res;
      setBoardLists(newBoardLists);
    });

    socket.current.emit("getGroups", userData);
    socket.current.on("getGroups", async (res) => {
      const newGroupLists = await res;
      setGroupLists(newGroupLists);
    });
  }, [socket, userId]);

  return (
    <div>
      <div className="nav-section fixed-top" id="navbar">
        <nav className="navbar navbar-expand-lg  menu border-bottom">
          <div className="container-fluid">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
            {/* switch to board or group  */}
            <div className="board-lists-div nav-item">
              <div className="btn-group  dropdown">
                <div
                  data-bs-toggle="dropdown"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-expanded="false"
                  className="dropdown-toggle"
                ></div>

                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownMenuButton"
                >
                  {isEmpty(boardLists) && (
                    <div className="not-found text-center">Board not found</div>
                  )}

                  {boardLists.map((boardList, index) => {
                    return (
                      <Link key={index} href="#" as="#" passHref>
                        <div className="dropdown-item">
                          <div className="d-flex">
                            <div>
                              <Link
                                href={`/masterDashboard/boardName/${boardList._id}?name=${boardList.board_title}`}
                              >
                                {boardList.board_title}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* create board and group dropdown  */}
            <div className="btn-group  dropdown nav-item">
              <div
                data-bs-toggle="dropdown"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-expanded="false"
                className="dropdown-toggle "
              ></div>

              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="dropdownMenuButton"
              >
                <div
                  className="dropdown-item"
                  type="button"
                  onClick={handleBoard}
                >
                  <div className="d-flex ">
                    <div>
                      <span>{CREATE_BOARD}</span>
                    </div>
                  </div>
                </div>
                <div
                  className="dropdown-item"
                  type="button"
                  onClick={handleGroup}
                >
                  <div className="d-flex ">
                    <div>
                      <span>{CREATE_GROUP}</span>
                    </div>
                  </div>
                </div>
              </ul>
            </div>

            {/* user image showing  */}
            <div className="profile-div">
              <img
                src={user.user_image_path ? user.user_image_path : profile}
                width="44px"
                height="44px"
                className="rounded-circle border border-primary img-fluid "
                alt=""
              />
            </div>

            {/* LogOut */}
            <div onClick={logOut} role="button">
              <a className="menu-links">
                <div className="menu-item  d-flex">
                  <div className="menu-icon">
                    <Image
                      src={logout}
                      width="16px"
                      height="16px"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* modal  */}
          <CommonModal
            show={showConfirmModal}
            onAction={onConfirmModalAction}
            boardLists={boardLists}
            groupLists={groupLists}
            isBoard={isBoard}
            isGroup={isGroup}
          />
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
