import env from "dotenv";
import cors from "cors";
env.config();

import express from "express";

import helmet from "helmet";

import ConfigRouter from "./routes/index.js";

import dbCon from "./config/dbCon.config.js";
import apiDocs from "./doc.js";

// import addSuperAdmin from "./config/superAdmin.config.js";
// setting superadmin
// addSuperAdmin();

const app = express();

const PORT = process.env.PORT || 8000;

const router = express.Router();
apiDocs(app);
// app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

app.use(cors());

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

dbCon();

ConfigRouter(router);

app.use("/api", router);

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
