import { Router } from "express";
import { getAverageRating, query5 } from "../controllers/3.controllers.js"
const router = Router();

//Rutas van aqui ----------
router.post("/getCalificacion", query5);
router.post("/getRating", getAverageRating);

export default router;