import { Router } from "express";
import { createPost, getPost, deletePost, getFeed } from "../controllers/posts.controller.js";
import { createComment } from "../controllers/comments.controller.js";
import { likePost, unlikePost } from "../controllers/likes.controller.js";
import { validate } from "../middleware/validate.js";
import { createPostSchema } from "../validators/posts.validators.js";
import { createCommentSchema } from "../validators/comments.validators.js";

const router = Router();

router.post("/", validate(createPostSchema), createPost);
// must stay above "/:id" or Express would treat "feed" as the :id param
router.get("/feed", getFeed);
router.get("/:id", getPost);
router.delete("/:id", deletePost);
router.post("/:id/comments", validate(createCommentSchema), createComment);
router.post("/:id/like", likePost);
router.delete("/:id/like", unlikePost);

export default router;
