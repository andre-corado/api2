import { Router } from "express";
import { query1 } from "../controllers/3.controllers.js"
const router = Router();

//Rutas van aqui ----------
router.post("/send", query1);

export default router;
