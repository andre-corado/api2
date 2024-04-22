import { Router } from "express";
import { query2 } from "../controllers/3.controllers.js"
const router = Router();

//Rutas van aqui ----------
router.post("/save", query2);

export default router;