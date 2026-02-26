import { Router } from "express";
import { categoryController } from "../controllers/category.controller";
import { protect, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator";

const router = Router();

router
    .route("/")
    .get(categoryController.getCategories)
    .post(protect, authorize("admin"), validate(createCategorySchema), categoryController.createCategory);

router
    .route("/:id")
    .put(protect, authorize("admin"), validate(updateCategorySchema), categoryController.updateCategory)
    .delete(protect, authorize("admin"), categoryController.deleteCategory);

export default router;
