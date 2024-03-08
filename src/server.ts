import express, { Application } from "express";
import cors from "cors";
import { apiV1 } from "./routes/v1";
import { env } from "process";

const app: Application = express();
const port = env.PORT || 7500;

// 2 cái này rất quan trọng không có thì không truyền dạng post với body json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", cors(), apiV1);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
