import express from "express";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const port = 3000;

app.use(express.json());

// userRoutes の URL の頭に /api/v1 を付ける（/users → /api/v1/users）
app.use("/api/v1", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
