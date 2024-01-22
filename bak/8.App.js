import { useState } from "react";

import { useQuery, useQueryClient } from "react-query";

import { ReactQueryDevtools } from "react-query/devtools";

import request from "./request";

function Users({ setUserId }) {
  const { data, isLoading, isFetching } = useQuery("users", () =>
    request.get("/users")
  );

  if (isLoading) return "加载中....";

  return (
    <>
      <ul>
        {data?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      {isFetching && "更新中..."}
    </>
  );
}

function App() {
  const queryClient = useQueryClient();

  const [show, setShow] = useState(false);
  return (
    <>
      <button
        onMouseEnter={() => {
          // 预查询
          queryClient.prefetchQuery("users", () => request.get("/users"));
        }}
        onClick={() => setShow(true)}
      >
        显示用户列表
      </button>

      {show && <Users />}

      <ReactQueryDevtools initialIsOpen={true} />
    </>
  );
}

export default App;
