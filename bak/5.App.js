import { useState } from "react";

import { useQuery, useQueryClient } from "react-query";

import { ReactQueryDevtools } from "react-query/devtools";

import request from "./request";

function Users({ setUserId }) {
  const usersQuery = useQuery("users", () =>
    request.get("/users", { params: { pageNumber: 1 } })
  );

  return (
    <ul>
      {usersQuery.data?.data?.map((user) => (
        <li onClick={() => setUserId(user.id)} key={user.id}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}

function User({ userId, setUserId }) {
  const queryClient = useQueryClient();

  const userQuery = useQuery(
    ["user", userId],
    () => request.get("/user", { params: { userId, pageNumber: 1 } }),
    {
      initialData: () =>
        queryClient?.getQueryData("users").data.find((user) => user.id === userId), // 动态初始化数据
      initialStable: false,
    }
  );

  return (
    <div>
      <button onClick={() => setUserId(-1)}>返回</button>
      <p>
        {userQuery.data?.id}:{userQuery.data?.name}
      </p>
    </div>
  );
}

function App() {
  const [userId, setUserId] = useState(-1);
  return (
    <>
      {userId > -1 ? (
        <User userId={userId} setUserId={setUserId} />
      ) : (
        <Users setUserId={setUserId} />
      )}
      <ReactQueryDevtools initialIsOpen={true} />
    </>
  );
}

export default App;
