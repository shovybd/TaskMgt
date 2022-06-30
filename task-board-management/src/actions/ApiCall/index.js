//all api route of backend 

import axios from "axios";

export const fetchBoardLists = async (auth_token) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/board/list`,
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );
  return request.data;
};

export const fetchGroupLists = async (auth_token) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/group/list`,
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );
  //  console.log(request.data);
  return request.data;
};

export const fetchSingleBoard = async (boardId, auth_token) => {
  const req = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/board/list/${boardId}`,
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );
  return req.data;
};

export const updateBoard = async (auth_token, id, board_Name) => {
  const request = await axios.put(
    `${process.env.NEXT_PUBLIC_BASE_URL}/board/edit/${id}`,
    { boardName: board_Name },
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );
  // console.log(request);
  return request.data;
};

export const updateTask = async (auth_token, id, taskTitle) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/task/edit/${id}`;
  const request = await axios.put(
    url,
    { task_title: taskTitle },
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );
  return request.data;
};

export const fetchTaskList = async (auth_token) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/task/list`,
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );
  // console.log(request.data);
  return request.data;
};

export const fetchCompletedTask = async (auth_token) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/task/all-completed-tasks/`,
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );
  return request.data;
};

export const taskComplete = async (auth_token, id) => {
  //console.log(auth_token);
  const request = await axios.put(
    `${process.env.NEXT_PUBLIC_BASE_URL}/task/complete/${id}`,
    {},
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );

  return request.data;
};

export const createTask = async (auth_token, data) => {
  const request = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/task/create`,
    data,
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );

  console.log(request.data);
  return request.data;
};

export const fetchSingleGroupTask = async (id, auth_token) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/group/list/${id}`,
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );
  //console.log(request.data);
  return request.data;
};
export const fetchSingleSubGroupTask = async (id, groupId, auth_token) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/group/list/${groupId}?sub_id=${id}`,
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );
  //console.log(request.data);
  return request.data;
};

export const fetchDrawerData = async (auth_token) => {
  const request = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/board/get-groups-tasks`,
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );
  //  console.log(request.data);
  return request.data;
};

export const MoveTaskToGroup = async (auth_token, groupId, taskId, title) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/group/add-task/${groupId}/null?taskId=${taskId}`;
  const request = await axios.put(
    url,
    { task_title: title },
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );
  return request.data;
};

export const taskMoveToSubGroup = async (
  auth_token,
  groupId,
  subGroupId,
  taskId,
  title
) => {
  console.log(groupId, subGroupId, taskId, title);
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/group/add-task/${groupId}/${subGroupId}?taskId=${taskId}`;
  const request = await axios.put(
    url,
    { task_title: title },
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );
  return request.data;
};

export const groupTaskComplete = async (auth_token, id, taskId) => {
  //console.log(auth_token);
  const request = await axios.put(
    `${process.env.NEXT_PUBLIC_BASE_URL}/group/group-task-complete/${id}?task_id=${taskId}`,
    {},
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );

  return request.data;
};

export const subGroupTaskComplete = async (
  auth_token,
  groupId,
  subGroupId,
  taskId
) => {
  //console.log(auth_token);
  const request = await axios.put(
    `${process.env.NEXT_PUBLIC_BASE_URL}/group/group-task-complete/${groupId}?task_id=${taskId}&sub_group_id=${subGroupId}`,
    {},
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );

  return request.data;
};

export const nestedBoardTaskDelete = async (
  auth_token,
  boardId,
  boardColumnId,
  taskId
) => {
  //console.log(auth_token);
  const request = await axios.put(
    `${process.env.NEXT_PUBLIC_BASE_URL}/board/delete-board-column-task/${boardId}?column_id=${boardColumnId}`,
    { task_id: taskId },
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );

  return request.data;
};

export const nestedBoardGroupTaskDelete = async (
  auth_token,
  boardId,
  boardColumnId,
  groupId,
  taskId
) => {
  //console.log(auth_token);
  const request = await axios.put(
    `${process.env.NEXT_PUBLIC_BASE_URL}/board/delete-board-column-task/${boardId}?column_id=${boardColumnId}&board_column_group_id=${groupId}`,
    { task_id: taskId },
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );

  return request.data;
};

export const nestedBoardSubGroupTaskDelete = async (
  auth_token,
  boardId,
  boardColumnId,
  taskId,
  groupId,
  subGroupId
) => {
  //console.log(auth_token);
  const request = await axios.put(
    `${process.env.NEXT_PUBLIC_BASE_URL}/board/delete-board-column-task/${boardId}?column_id=${boardColumnId}&board_column_group_id=${groupId}&board_column_sub_group_id=${subGroupId}`,
    { task_id: taskId },
    {
      headers: {
        "auth-token": auth_token,
      },
    }
  );

  return request.data;
};
