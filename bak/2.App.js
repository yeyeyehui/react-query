import { useEffect, useState } from "react";

import { useQuery, QueryObserver, useQueryClient } from "react-query";

import { ReactQueryDevtools } from "react-query/devtools";

import request from "./request";

function Users() {
  const { data } = useQuery("users", () =>
    request.get("/users", {
      params: {
        pageNumber: 1,
      },
    })
  );
  return (
    <>
      <ul>
        {data?.data?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  );
}

function Status() {
  const [data, setData] = useState();

  const queryClient = useQueryClient();

  // 获取其他组件的请求数据
  useEffect(() => {
    const observer = new QueryObserver(queryClient, { queryKey: "users" });

    return observer.subscribe((result) => setData(result?.data?.data));
  }, [queryClient]);

  return <div>共计{data?.length}个用户</div>;
}

function App() {
  return (
    <>
      <Users />
      <Status />
      <ReactQueryDevtools initialIsOpen={true} />
    </>
  );
}

export default App;
