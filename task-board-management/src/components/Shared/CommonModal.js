import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import useStateRef from "react-usestateref";
import {
  CREATE_BOARD,
  CREATE_GROUP,
  MODAL_ACTION_CLOSE,
} from "../../utilities/constants";
import CreateBoard from "../Board/CreateBoard";
import CreateGroup from "../Group/CreateGroup";

const CommonModal = (props) => {
  const { show, onAction, boardLists, groupLists, isBoard, isGroup } = props;
  const [isNested, setIsNested, isNestedRef] = useStateRef(false);
  //checkbox handle
  const handleCheckbox = (e) => {
    setIsNested(e.target.checked);
  };

  //react hook form
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, isDirty, isValid, errors },
  } = useForm({
    mode: "onChange",
    shouldUnregister: true,
  });

  //close modal
  const onHide = () => {
    onAction(MODAL_ACTION_CLOSE);
    reset();
    setIsNested(false);
  };

  //reset form
  const handleReset = (e) => {
    e.preventDefault();
    reset();
    setIsNested(false);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        backdrop="static"
        keyboard={false}
        animation={true}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isBoard ? ` ${CREATE_BOARD}` : ` ${CREATE_GROUP}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isBoard && (
            <CreateBoard
              handleCheckbox={handleCheckbox}
              setIsNested={setIsNested}
              isnested={isNested}
              boardLists={boardLists}
              id={boardLists._id}
              register={register}
              handleSubmit={handleSubmit}
              reset={reset}
            />
          )}
          {isGroup && (
            <CreateGroup
              handleCheckbox={handleCheckbox}
              isnested={isNestedRef.current}
              setIsNested={setIsNested}
              groupLists={groupLists}
              id={boardLists._id}
              register={register}
              handleSubmit={handleSubmit}
              reset={reset}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleReset}
            variant="primary"
            type="button"
            form="hook-form"
          >
            Reset
          </Button>
          <Button variant="primary" type="submit" form="hook-form">
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CommonModal;
