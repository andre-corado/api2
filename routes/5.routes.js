import { Router } from "express";
import { query3 } from "../controllers/3.controllers.js"
const router = Router();

//Rutas van aqui ----------
router.get("/getAllActores", query3);

export default router;