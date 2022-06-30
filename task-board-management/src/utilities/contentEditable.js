//onKeyDown
export const saveContentAfterPressEnter = (e) => {
  if (e.key === "Enter" || e.key === "Escape") {
    e.target.blur();
  }
};
