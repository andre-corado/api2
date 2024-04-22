import { Router } from "express";
import { query6 } from "../controllers/3.controllers.js"
const router = Router();

//Rutas van aqui ----------
router.post("/setActor", query6);

export default router;