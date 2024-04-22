import { Router } from "express";
import { query5 } from "../controllers/3.controllers.js"
const router = Router();

//Rutas van aqui ----------
router.post("/getCalificacion", query5);

export default router;