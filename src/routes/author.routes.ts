import { Router } from "express";
import { AuthorController } from "../controllers/author.controller";
import { protect, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createAuthorSchema, updateAuthorSchema } from "../validators/author.validator";
import multer from "multer";

const router = Router();
const upload = multer();

router.route("/")
    .get(AuthorController.getAll)
    .post(protect, authorize("admin"), upload.single("imageFile"), validate(createAuthorSchema), AuthorController.create);

router.route("/:id")
    .get(AuthorController.getById)
    .put(protect, authorize("admin"), upload.single("imageFile"), validate(updateAuthorSchema), AuthorController.update)
    .delete(protect, authorize("admin"), AuthorController.remove);

export default router;
