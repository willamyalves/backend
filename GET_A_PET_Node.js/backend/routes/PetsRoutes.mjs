import { Router } from "express";
import PetController from "../controller/PetController.mjs";

// middlewares
import checkToken from "../helpers/verify-token.mjs";
import imageUpload from "../helpers/upload-image.mjs";

const router = Router();

router.post(
  "/create",
  checkToken,
  imageUpload.array("images"),
  PetController.create
);
router.get("/", PetController.getAll);

export default router;
