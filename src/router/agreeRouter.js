import { Router } from "express";

// module

import { getAgreeMessage, getSingleAgreeMessage, postAgreeMessage } from "../controllers/agreeController.js";


const agreeRouter = Router();


agreeRouter.get("/agree", getAgreeMessage)
agreeRouter.get("/agree/:id", getSingleAgreeMessage)
agreeRouter.post("/agree", postAgreeMessage)


export default agreeRouter;