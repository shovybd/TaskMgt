import React, { useCallback, useEffect, useRef } from "react";
import useStateRef from "react-usestateref";
import { updateTask } from "../../actions/ApiCall";
import useAuth from "../../Hooks/useAuth";
import { selectAllInlineText } from "../../utilities/contentEditable";

const TaskEdit = ({ value, setValue, id }) => {
  const textareaRef = useRef();
  const onChange = (e) => {
    setValue(e.target.value);
  };

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

  //task title edit
  const handleTitleEdit = (e) => {
    if (e.key === "Enter") {
      updateTask(authTokenRef.current, id, value)
        .then(async (res) => {
          const newTaskLists = await res;
          if (newTaskLists.task) {
            setValue(newTaskLists.task?.task_title);
          }
        })
        .catch(async (error) => {
          if (!error.response) {
            setAuthSuccess("");
            setAuthError("NETWOKR ERROR !!!");
          }
          if (error.response) {
            setAuthSuccess("");
            setAuthError(error.response?.data?.errorMessage);

            if (error.response.data.errorMessage) {
              setEditingValue(value);
            }

            if (error.response.data.invalidAuthTokenMessage) {
              await updateToken().then(async (res) => {
                await updateTask(authTokenRef.current, id, value);
              });
            } else if (error.response.data.invalidRefreshTokenMessage) {
              setAuthSuccess("");
              setAuthError(error.response.data.invalidRefreshTokenMessage);
              logOut();
            }
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
          setIsLoading(false);
          console.log(error.config);
        });

      e.preventDefault();
    }
  };

// textarea size expanding
  const onInput = useCallback((target) => {
    if (target.scrollHeight > 33) {
      target.style.height = "5px";
      target.style.height = target.scrollHeight + "px";
    }
  }, []);

  useEffect(() => {
    onInput(textareaRef.current);
  }, [onInput, textareaRef]);

  return (
    <div className="multiline-edit-div">
      <textarea
        rows={1}
        aria-label="Field name"
        value={value}
        onClick={selectAllInlineText}
        onChange={onChange}
        onKeyDown={handleTitleEdit}
        onInput={(event) => onInput(event.target)}
        spellCheck={false}
        ref={textareaRef}
      />
    </div>
  );
};

export default TaskEdit;
