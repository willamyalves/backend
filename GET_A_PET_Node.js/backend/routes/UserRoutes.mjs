import { Router } from "express";
import UserController from "../controller/UserController.mjs";
import checkToken from "../helpers/verify-token.mjs";
import imageUpload from "../helpers/upload-image.mjs";

const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/checkuser", UserController.checkUser);
router.get("/:id", UserController.getUserById);
router.patch(
  "/edit/:id",
  checkToken,
  imageUpload.single("image"),
  UserController.editUser
);

export default router;
