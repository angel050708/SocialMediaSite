import { Router } from "express";
import { getProfile, listUserPosts, updateMe, listUsers } from "../controllers/users.controller.js";
import { sendFollowRequest, removeFollow } from "../controllers/follows.controller.js";
import { validate } from "../middleware/validate.js";
import { updateMeSchema } from "../validators/users.validators.js";

const router = Router();

router.get("/", listUsers);
router.patch("/me", validate(updateMeSchema), updateMe);
router.post("/:username/follow", sendFollowRequest);
router.delete("/:username/follow", removeFollow);
router.get("/:username/posts", listUserPosts);
router.get("/:username", getProfile);

export default router;
