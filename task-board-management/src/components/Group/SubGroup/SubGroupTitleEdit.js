//sub group title editing

import React, { useState } from "react";
import useStateRef from "react-usestateref";
import useAuth from "../../../Hooks/useAuth";
import { saveContentAfterPressEnter } from "../../../utilities/contentEditable";

const SubGroupTitleEdit = ({
  //props are accessing here which were send by parent component
  title,
  editable,
  setEditable,
  subGroupId,
  groupId,
}) => {
  const [value, setValue] = useState(title); //setting states
  const [editingValue, setEditingValue, editingValueRef] = useStateRef(value); //useStateRef used for getting current value of a state. If  we  want to access current value of editingValue we can access it by writing editingValueRef.current
  const onChange = (event) => setEditingValue(event.target.value); // setting edited value here

  const { user, socket } = useAuth(); //importing this from useAuthentication page

  const [userId, setUserId] = useState(user._id);

  //title edit function
  const handleGroupTitleEdit = async (e) => {
    setEditable(true); // enable editing
    if (e.target.value.trim() === "") {
      setEditingValue(value); //if user send empty text for edit this will reset initial value
    }
    const group_title = editingValueRef.current;
    const group_Data = {
      user_id: userId,
      group_id: groupId,
      sub_group_id: subGroupId,
      group_title,
    }; // sending group data to the backend

    //web socket used here
    socket.current.emit("editGroup", group_Data); //sending data from frontend
    socket.current.on("editGroup", async (res) => {
      //geting data from backend
      const newTaskLists = await res;
      //console.log(newTaskLists);
      // setValue(newTaskLists.group.group_title);
    });
    setEditable(false); //set editing state disabled
    e.preventDefault(); // preventing from loading page

    // errors not handled for web socket please handle the errors
  };

  return (
    <div className="multiline-edit-div">
      <input
        disabled={!editable} //editable option disabled in initial state
        type="text"
        aria-label="Field name"
        value={editingValue} // edited value or initial value will be set here
        onChange={onChange}
        onKeyDown={saveContentAfterPressEnter} // clicking enter
        onBlur={handleGroupTitleEdit} //if enter clicked onBlur  will be fired
      />
    </div>
  );
};

export default SubGroupTitleEdit;
