import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { deleteProject, getProjectById, getProjectPreview, getPublishedProjects, makeRevision, rollbackToVersion, saveProjectCode } from "../controllers/project.controller.js";

const projectRouter = express.Router();

projectRouter.get('/preview/:projectId', protect, getProjectPreview)
projectRouter.get('/rollback/:projectId/:versionId', protect, rollbackToVersion)
projectRouter.get('/published', getPublishedProjects)
projectRouter.get('/published/:projectId', getProjectById)
projectRouter.put('/save/:projectId', protect, saveProjectCode)
projectRouter.post('/revision/:projectId', protect, makeRevision)
projectRouter.delete('/:projectId', protect, deleteProject)

export default projectRouter