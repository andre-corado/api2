import { Router } from "express";
import { AgregarWatchList, ModificarPelicula, ReturnInfo } from "../controllers/1.controller.js"
const router = Router();

//Rutas van aqui ----------
router.post("/GetInfoPeli", ReturnInfo);
router.post("/ModificarPeli", ModificarPelicula);
router.post("/AgregarWatchList", AgregarWatchList);

export default router;
