const express = require("express");

const cors = require("cors");

const logger = require("morgan");

// 创建一个服务
const app = express();

app.use(express.json());

// 设置跨域中间件
app.use(
  cors({
    allowedHeaders: ["Content-Type"], // 允许跨域的请求头
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 允许跨域的方法
  })
);

// 打印日志
app.use(logger("dev"));

app.use((req, res, next) => {
  setTimeout(next, 1000);
});

// 创建一个用户列表假数据
const users = new Array(30)
  .fill(true)
  .map((item, index) => ({ id: String(index + 1), name: `name${index + 1}` }));

// 创建30条数据的数组
const posts = new Array(30).fill(true).map((item, index) => ({
  id: String(index + 1),
  title: `title${index + 1}`,
  userId: String(index + 1),
}));

// 访问get users接口
app.get("/users", (req, res) => {
  const pageNumber = Number(req.query.pageNumber);
  const totalNumber = Math.floor(users.length / 10);
  const offset = (pageNumber - 1) * 10;
  const hasMore = pageNumber < totalNumber;
  res.json({
    pageNumber,
    totalNumber,
    hasMore,
    data: users.slice(offset, offset + 10),
  });
});

// 访问post users接口
app.post("/users", (req, res) => {
  const user = req.body;
  if (user.name) {
    user.id = users.length + 1 + "";
    users.push(user);
    res.json(user);
  } else {
    res.status(400).send({ message: "用户名不能为空!" });
  }
});

// 访问get posts接口
app.get("/posts", (req, res) => {
  res.json(posts);
});

// 访问get user接口
app.get("/user", (req, res) => {
  const userId = req.query.userId;
  const user = users.find((user) => user.id === userId);
  if (user) res.json(user);
  else res.sendStatus(404);
});

// 监听8080端口
app.listen(8080, () => console.log("8080"));
