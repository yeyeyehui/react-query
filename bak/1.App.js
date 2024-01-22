import { useState } from "react";

import { useQuery } from "react-query";

import { ReactQueryDevtools } from "react-query/devtools";

import request from "./request";

function Users() {
  const { data, isLoading, isError } = useQuery(
    "users",
    () =>
      request.get("/users", {
        params: {
          pageNumber: 1,
        },
      }),
    {
      refetchOnWindowFocus: false, // 当窗口获取焦点的时候重新数据
      refetchOnReconnect: false, // 当网络恢复的时候重新获取
      staleTime: 5000, // 5秒内不需要重新获取
      cacheTime: 5000, // 5秒内数据有效
      // refetchInterval: 1000, // 每隔1秒拉取一次接口
    }
  );

  if (isLoading) {
    return <div>数据加载中...</div>;
  }

  if (isError) {
    return <div>数据加载出错</div>;
  }

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
function App() {
  const [show, setShow] = useState(true);

  return (
    <>
      <button onClick={() => setShow(!show)}>{show ? "隐藏" : "显示"}</button>

      {show && <Users />}

      <ReactQueryDevtools initialIsOpen={true} />
    </>
  );
}

export default App;
