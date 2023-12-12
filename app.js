const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
// routes
const productRoutes = require("./src/routers/product");
const userRoutes = require("./src/routers/user");
const cartRoutes = require("./src/routers/cart");
const orderRoutes = require("./src/routers/order");
const historyRoutes = require("./src/routers/history");
const adminRoutes = require("./src/routers/admin");

dotenv.config();
///////////////////////
// Cấu hình
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://client-shop-eta.vercel.app",
      "https://admin-shop-phi.vercel.app",
    ],
    methods: ["GET,POST,PUT,PATH,DELETE,OPTIONS,HEAD"],
    credentials: true,
  })
); // cho phép mọi url đều lấy được tài nguyên localhost của mình
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

///////////////////////////////////

// routes
app.use(productRoutes);
app.use(userRoutes);
app.use(cartRoutes);
app.use(orderRoutes);
app.use(historyRoutes);
app.use(adminRoutes);

// Hiển thị thông báo không tìm thấy trang khi không đường dẫn không đúng đinh dạng
app.use("/", (req, res) => {
  res.status(404).send("Page Not Found");
});

mongoose
  .connect(
    `mongodb+srv://hoinfx21956:Nh123456@cluster0.tmb7gx7.mongodb.net/myshop?retryWrites=true`
  )
  .then((result) => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://client-shop-eta.vercel.app",
      "https://admin-shop-phi.vercel.app",
    ],
    methods: ["GET,POST,PUT,PATH,DELETE,OPTIONS,HEAD"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`a user connected": ${socket.id}`);
  socket.on("send_message", (data) => {
    console.log(data);
  });
  socket.on("disconnect", () => {
    console.log(`a user disconnect": ${socket.id}`);
  });
});

server.listen(process.env.PORT, () => {
  console.log("Server Started");
});
