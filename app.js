import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => {
  res.send("서버가 정상적으로 실행 중입니다!");
});


import productRouter from "./routes/products.js";
import articleRouter from "./routes/articles.js";
import commentRouter from "./routes/comments.js";

app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/comments", commentRouter);

// 404 처리
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// 에러 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});


app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}번에서 실행 중입니다.`);
});