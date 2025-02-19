import express from "express";
import jwtAuth from "../../middleware/jwt.middleware.js";
import { generateScript, getAllURL, getUserScripts, verifyScriptInstallation } from "./script.controller.js";

const ScriptRouter = express.Router();

ScriptRouter.get('/get-all-url', getAllURL);

ScriptRouter.get('/get-user-script', jwtAuth, getUserScripts);

ScriptRouter.post('/generate-script', jwtAuth, generateScript);

ScriptRouter.post('/verify-script', verifyScriptInstallation);


export default ScriptRouter;