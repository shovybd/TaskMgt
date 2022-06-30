import React, { useState } from "react";
import useStateRef from "react-usestateref";
import useAuth from "../../Hooks/useAuth";
import { saveContentAfterPressEnter } from "../../utilities/contentEditable";

const GroupTitleEdit = ({ title, editable, setEditable, id }) => {
  const [value, setValue] = useState(title);
  const [editingValue, setEditingValue, editingValueRef] = useStateRef(value);
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

  const [userId, setUserId] = useState(user._id);

  //group title edit using socket
  const handleGroupTitleEdit = async (e) => {
    setEditable(true);
    if (e.target.value.trim() === "") {
      setEditingValue(value);
    }
    const group_title = editingValueRef.current;
    const group_Data = { user_id: userId, group_id: id, group_title };
    socket.current.emit("editGroup", group_Data);
    socket.current.on("editGroup", async (res) => {
      const newTaskLists = await res;
    });
    setEditable(false);
    e.preventDefault();
  };

  return (
    <div className="multiline-edit-div">
      <input
        disabled={!editable}
        type="text"
        aria-label="Field name"
        value={editingValue}
        onChange={onChange}
        onKeyDown={saveContentAfterPressEnter}
        onBlur={handleGroupTitleEdit}
      />
    </div>
  );
};

export default GroupTitleEdit;
