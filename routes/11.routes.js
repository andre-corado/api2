import { Router } from "express";
import { getNumPages, getNumPagesBusqueda, getNumPagesWatchlist, getPaginaPelicula, getPaginaPeliculaBusqueda, getPaginaWatchlist, LoginAdmin } from "../controllers/5.controller.js";
const router = Router();

//Rutas van aqui ----------
router.post("/loginadmin", LoginAdmin)
router.get("/getnumpaginas", getNumPages);
router.get("/getpeliculaspagina/:pagina", getPaginaPelicula)
// Rutas para obtener la pelicula de busquedas
router.post("/getnumpaginas-busqueda", getNumPagesBusqueda)
router.post("/getpeliculaspagina-busqueda/:pagina", getPaginaPeliculaBusqueda)
// Rutas para obtener las películas de la watchlist
router.post("/getnumpaginas-watchlist", getNumPagesWatchlist)
router.post("/getpeliculaspagina-watchlist/:pagina", getPaginaWatchlist)

export default router;
