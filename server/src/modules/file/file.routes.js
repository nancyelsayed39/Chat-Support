import { Router } from "express";
import { upload } from "../../middleware/fileUpload.js";
import { uploadFile } from "./file.controller.js";

const fileRouter = Router();

fileRouter.post("/upload", upload.single("file"), uploadFile);

export default fileRouter;
