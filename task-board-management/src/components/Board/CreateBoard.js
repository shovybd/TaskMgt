import React, { useState } from "react";
import useAuth from "../../Hooks/useAuth";

const CreateBoard = ({
  handleCheckbox,
  setIsNested,
  isnested,
  boardLists,
  register,
  handleSubmit,
  reset,
}) => {
  const { user, socket } = useAuth();

  const [userId, setUserId] = useState(user._id);

  //submit  board data 
  const onSubmit = async (data) => {
    const userData = { data, userId: userId };
    await socket.current.emit("createBoard", userData);
    await socket.current.on("createBoard", async (res) => {
      const newGroupLists = await res;
      console.log(newGroupLists);
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
          name="board_title"
          type="text"
          id="board_title"
          {...register("board_title")}
        />
      </div>

      <div className="d-flex checkbox-div  mb-2 ">
        <div>
          <input
            type="checkbox"
            name="nested"
            id="nested"
            {...register("nested")}
            onChange={handleCheckbox}
          />
          <label htmlFor="nested" className="d-flex">
            {" "}
            <span></span>{" "}
          </label>
        </div>
        <p className="ps-2 ms-1"> Nested</p>{" "}
      </div>
      {isnested && (
        <div>
          <select
            required
            className="form-select  col-12 rounded-pill "
            name="board_id"
            id="board_id"
            {...register("board_id")}
          >
            <option value="Select Board">Select Board</option>
            {boardLists.map((boardList, index) => (
              <option key={index} value={boardList._id}>
                {boardList.board_title}
              </option>
            ))}
          </select>
        </div>
      )}
    </form>
  );
};

export default CreateBoard;
