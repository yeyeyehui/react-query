import { useState } from "react";

import { useQuery } from "react-query";

import { ReactQueryDevtools } from "react-query/devtools";

import request, { CancelToken } from "./request";

const initialUser = { id: "1", name: "name1" };

function User({ userId = initialUser.id }) {
  const { data, isIdle, isError, error } = useQuery(
    ["user", userId],
    () => {
      const source = CancelToken.source();

      const promise = request
        .get("/user", {
          params: { userId, pageNumber: 1 },
          cancelToken: source.token,
        })
        .catch((error) => {
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
      initialData: initialUser, // 初始化数据
      staleTime: 5000, // 5秒内不需要重新获取
      initialStale: false, //初始化数据标记为不过期
    }
  );

  // 依赖/user请求结果再次请求
  const postsQuery = useQuery(
    ["posts", data?.id],
    () => request.get("/posts", { params: { userId: data?.id } }),
    {
      enabled: !!data?.id,
    }
  );

  // 根据enabled判断是请求过，请求过的才显示元素
  if (isIdle) return null;

  // 报错
  if (isError) return <div>{error.message}</div>;

  return (
    <>
      <div>
        {data?.id ? (
          <p>
            {data?.id}:{data?.name}
          </p>
        ) : (
          <p>用户不存在</p>
        )}
      </div>
      <div>贴子数量:{postsQuery.data?.length}</div>
    </>
  );
}

function App() {
  const [userId, setUserId] = useState(initialUser.id);

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
