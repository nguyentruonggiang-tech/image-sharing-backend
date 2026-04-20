import express from "express";
import rootRouter from "./src/routers/root.router.js";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from "./src/common/swagger/init.swagger.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", rootRouter)
const PORT = 3069;
app.listen(PORT, () => {
  console.log(`Server online at port: ${PORT}`);
});