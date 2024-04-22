import { Router } from "express";
import { commentMovie, showActors } from "../controllers/2.controller.js";
const router = Router();

//Rutas van aqui ----------
router.post("/mostrarActor", showActors);
router.post("/addComment", commentMovie);

export default router;
