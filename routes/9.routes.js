import { Router } from "express";
import { query7 } from "../controllers/3.controllers.js"
const router = Router();

//Rutas van aqui ----------
router.post("/setCalificacion", query7);

export default router;