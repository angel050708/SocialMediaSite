import { Router } from "express";
import {
  listIncomingRequests,
  acceptFollowRequest,
  rejectFollowRequest,
} from "../controllers/follows.controller.js";

const router = Router();

router.get("/requests", listIncomingRequests);
router.post("/:id/accept", acceptFollowRequest);
router.post("/:id/reject", rejectFollowRequest);

export default router;
