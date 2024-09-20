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
router.get("/mypets", checkToken, PetController.getAllUserPets);
router.get("/myadoptions", checkToken, PetController.getAllUserAdoptions);
router.get("/:id", PetController.getPetById);
router.delete("/:id", checkToken, PetController.removePet);
router.patch(
  "/:id",
  checkToken,
  imageUpload.array("images"),
  PetController.updatePet
);
router.patch("/schedule/:id", PetController.schedule);
router.patch("/conclude/:id", PetController.concludeAdoption);

export default router;
