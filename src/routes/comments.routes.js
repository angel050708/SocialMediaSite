import { Router } from "express";
import { deleteComment } from "../controllers/comments.controller.js";

const router = Router();

router.delete("/:id", deleteComment);

export default router;
