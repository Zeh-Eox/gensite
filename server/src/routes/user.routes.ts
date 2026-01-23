import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createUserProject,
  getUserAllProjects,
  getUserCredits,
  getUserProject,
  purchaseCredits,
  togglePublish,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.use(protect);

userRouter.get("/credits", getUserCredits);
userRouter.post("/credits/purchase", purchaseCredits);
userRouter.get("/projects", getUserAllProjects);
userRouter.get("/projects/:projectId", getUserProject);
userRouter.post("/projects", createUserProject);
userRouter.patch("/projects/:projectId/publish", togglePublish);

export default userRouter;