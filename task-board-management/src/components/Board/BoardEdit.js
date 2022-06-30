import React, { useCallback, useEffect, useRef, useState } from "react";
import useStateRef from "react-usestateref";
import useAuth from "../../Hooks/useAuth";
import { saveContentAfterPressEnter } from "../../utilities/contentEditable";

const BoardEdit = ({ title, editable, setEditable, id }) => {
  const [value, setValue] = useState(title);
  const [editingValue, setEditingValue, editingValueRef] = useStateRef(value);
  const textareaRef = useRef();
  const onChange = (event) => setEditingValue(event.target.value);

  const {
    user,
    socket,
    authTokenRef,
    setAuthError,
    setAuthSuccess,
    setIsLoading,
    updateToken,
    logOut,
  } = useAuth();

  const [userId, setUserId, userIdRef] = useStateRef(user._id);

  const onInput = useCallback((target) => {
    if (target.scrollHeight > 33) {
      target.style.height = "5px";
      target.style.height = target.scrollHeight + "px";
    }
  }, []);

  useEffect(() => {
    onInput(textareaRef.current);
  }, [onInput, textareaRef]);

  //board title edit
  const handleTitleEdit = async (e) => {
    let isMounted = true;
    setEditable(true);
    if (e.target.value.trim() === "") {
      setEditingValue(value);
    }
    const boardName = editingValueRef.current;
    const userData = { userId: userId, id, boardName };
    socket.current.emit("editBoard", userData);
    socket.current.on("editBoard", async (res) => {
      const newTaskLists = await res;
      if (isMounted) {
        setEditingValue(newTaskLists.updatedBoard.board_title);
      }
    });

    setEditable(false);
    e.preventDefault();
  };

  return (
    <div className="multiline-edit-div">
      <textarea
        rows={1}
        disabled={!editable}
        value={editingValue}
        onBlur={handleTitleEdit}
        onChange={onChange}
        onKeyDown={saveContentAfterPressEnter}
        onInput={(event) => onInput(event.target)}
        spellCheck={false}
        ref={textareaRef}
      />
    </div>
  );
};

export default BoardEdit;
