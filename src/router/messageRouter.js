import Router from "express";

// module

import { getMessage, getSingleMessage, postMessage, deleteMessage, updateMessage } from "../controllers/messageController.js";



const messageRouter = Router();

messageRouter.get("/message", getMessage);
messageRouter.get("/message/:id", getSingleMessage);
messageRouter.post("/message", postMessage);
messageRouter.delete("/message/:id", deleteMessage);
messageRouter.put("/message/:id", updateMessage);



//

export default messageRouter;
