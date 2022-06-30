import React from "react";

//custom radio button
const CustomRadioButton = React.forwardRef((props, ref) => {
  return (
    <div className="form-check">
      <input
        className="me-2 form-check-input"
        type="radio"
        name="flexRadioDefault"
        {...props}
        ref={ref}
      />
    </div>
  );
});

CustomRadioButton.displayName = "CustomRadioButton";
export default CustomRadioButton;
