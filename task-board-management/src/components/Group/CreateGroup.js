import React, { useState } from "react";
import useAuth from "../../Hooks/useAuth";

const CreateGroup = (props) => {
  const {
    handleCheckbox,
    isnested,
    setIsNested,
    groupLists,
    register,
    handleSubmit,
    reset,
  } = props;
  const { user, socket } = useAuth();
  const [userId, setUserId] = useState(user._id);

  //submitting data to the backend for create group
  const onSubmit = async (data) => {
    const userData = { data, userId: userId };
    await socket.current.emit("createGroup", userData);
    await socket.current.on("createGroup", async (res) => {
      const newGroupLists = await res;
      reset();
      setIsNested(false);
    });
  };

  return (
    <form
      id="hook-form"
      className=" mx-2 py-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <input
          className="mobile-input col-12 rounded-pill"
          placeholder="write your Board Name"
          name="group_title"
          type="text"
          id="group_title"
          {...register("group_title")}
        />
      </div>

      <div className="d-flex checkbox-div  mb-2 ">
        <div>
          <input
            type="checkbox"
            name="nested"
            id="nested"
            {...register("nested")}
            onClick={handleCheckbox}
          />
          <label htmlFor="nested" className="d-flex">
            {" "}
            <span></span>{" "}
          </label>
        </div>
        <p className="ps-2 ms-1">Nested</p>{" "}
      </div>

      {/* after checkbox checked user can select which group user want to nesting the new group  */}
      {isnested && (
        <div>
          <select
            required
            className="form-select  col-12 rounded-pill "
            name="super_group_id"
            id="super_group_id"
            {...register("super_group_id")}
          >
            <option value="Select Board">Select Group</option>
            {groupLists.map((groupList, index) => (
              <option key={index} value={groupList._id}>
                {groupList.group_title}
              </option>
            ))}
          </select>
        </div>
      )}
    </form>
  );
};

export default CreateGroup;
