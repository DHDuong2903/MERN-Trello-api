/* eslint-disable no-console */
import express from "express";
import cors from "cors";
import exitHook from "async-exit-hook";
import { CONNECT_DB, CLOSE_DB } from "./config/mongodb";
import { env } from "./config/environment";
import { APIs_V1 } from "./routes/v1";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import { corsOptions } from "./config/cors";

const START_SERVER = () => {
  const app = express();

  // Xu ly CORS
  app.use(cors(corsOptions));

  // Enable req.body json data
  app.use(express.json());

  // Use APIs v1
  app.use("/v1", APIs_V1);

  // Middleware xu ly loi tap trung
  app.use(errorHandlingMiddleware);

  // Moi truong Production [Render.com]
  if (env.BUILD_MODE === "production") {
    app.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(
        `3. Production: Hello ${env.AUTHOR}, Backend Server is running successfully at Port: ${process.env.PORT}`
      );
    });
  } else {
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      // eslint-disable-next-line no-console
      console.log(`3. Local DEV: Hello ${env.AUTHOR}, I am running at ${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`);
    });
  }

  // Clean up truoc khi dong server
  exitHook(() => {
    console.log("4. Disconnecting...");
    CLOSE_DB();
  });
};

// IIFE JavaScript
(async () => {
  try {
    console.log("1. Connecting to MongoDB Cloud Atlas...");
    await CONNECT_DB();
    console.log("2. Connected to MongoDB Cloud Atlas");
    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();

// CONNECT_DB()
//   .then(() => console.log("Connected to MongoDB Cloud Atlas!"))
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.error(error);
//     process.exit(0);
//   });
