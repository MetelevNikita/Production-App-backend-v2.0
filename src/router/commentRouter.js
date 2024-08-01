import { Router } from "express";

// module

import { getComment, getSingleComment, postComment } from "../controllers/commentControllers.js";

const commentRouter = Router();


commentRouter.get("/comment", getComment)
commentRouter.get("/comment/:id", getSingleComment)
commentRouter.post("/comment", postComment)

//

export default commentRouter;