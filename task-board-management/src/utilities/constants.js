//all urls
export const URLS = {
  MASTERDASHBOARD: "/masterDashboard",
  BOARDLIST: "/masterDashboard/boardList",
  GROUPLIST: "/masterDashboard/groupList",
  CREATETASK: "/masterDashboard/createTask",
};

//header nav
export const HEADERNAV = [
  {
    href: URLS.GROUPLIST,
    text: "Group List",
  },
  {
    href: URLS.BOARDLIST,
    text: "Board List",
  },
];

//modal 
export const MODAL_ACTION_CLOSE = "MODAL_ACTION_CLOSE";
export const CREATE_BOARD = "Create Board";
export const CREATE_GROUP = "Create Group";
