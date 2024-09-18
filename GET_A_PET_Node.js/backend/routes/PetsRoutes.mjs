import { Router } from "express";
import PetController from "../controller/PetController.mjs";
import checkToken from "../helpers/verify-token.mjs";

const router = Router();

router.post("/create", checkToken, PetController.create);

export default router;
