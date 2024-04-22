import { Router } from "express";
import { query4 } from "../controllers/3.controllers.js"
const router = Router();

//Rutas van aqui ----------
router.get("/getAllMovies", query4);

export default router;