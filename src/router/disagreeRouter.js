import { Router } from "express";

// module

import { getDisagreeMessage, getSingleDisagreeMessage, postDisagreeMessage } from "../controllers/disagreeController.js";


const disagreeRouter = Router();

disagreeRouter.get("/disagree", getDisagreeMessage)
disagreeRouter.get("/disagree/:id", getSingleDisagreeMessage)
disagreeRouter.post("/disagree", postDisagreeMessage)

export default disagreeRouter;
