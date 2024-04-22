import { Router } from "express";
import { query1 } from "../controllers/4.controller.js";
import { query2 } from "../controllers/4.controller.js";
import { query3 } from "../controllers/4.controller.js";
import { query4 } from "../controllers/4.controller.js";
import { query5 } from "../controllers/4.controller.js";
const router = Router();

//Rutas van aqui ----------
router.post("/login", query1);
router.post("/buscarPeliculaNombre",query2);
router.post("/eliminarDeWatchlist",query3);
router.post("/eliminarPelicula",query4);
router.post("/obtenerSiWatchlist",query5);

export default router;
