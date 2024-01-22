import { useState } from "react";

import { useQuery } from "react-query";

import { ReactQueryDevtools } from "react-query/devtools";

import request, { CancelToken } from "./request";

function User({ userId }) {
  const { data, isIdle, isError, error } = useQuery(
    ["user", userId], // 动态组合缓存键
    () => {
      // 取消上一次请求
      const source = CancelToken.source();

      const promise = request
        .get("/user", {
          params: { userId, pageNumber: 1 },
          cancelToken: source.token,
        })
        .catch((error) => {
          // 报错信息
          if (request.isCancel(error)) {
            console.log(error.message);
          }
        });

      promise.cancel = () => source.cancel("请求被React Query取消了!");

      return promise;
    },
    {
      enabled: !!userId, // 没值就true
      retry: 3, // 重试三次
      //retryDelay: 1000,// 重试的间隔时间
      retryDelay: (attemptIndex) => Math.min(30000, 1000 * 2 ** attemptIndex), // 动态设置重试的间隔时间
    }
  );

  // 根据enabled判断是请求过，请求过的才显示元素
  if (isIdle) return null;

  // 报错
  if (isError) return <div>{error.message}</div>;

  return (
    <div>
      {data?.id ? (
        <p>
          {data?.id}:{data?.name}
        </p>
      ) : (
        <p>用户不存在</p>
      )}
    </div>
  );
}

function App() {
  const [userId, setUserId] = useState("");

  return (
    <>
      <input
        value={userId}
        onChange={(event) => setUserId(event.target.value)}
      />

      <User userId={userId} />

      <ReactQueryDevtools initialIsOpen={true} />
    </>
  );
}

export default App;
