import { Router } from "express";
import { getNumPagesBusqueda777,getPaginaPeliculaBusqueda777,getNumPages777,getPaginaPelicula777,getNumPages, getNumPagesBusqueda, getNumPagesWatchlist, getPaginaPelicula, getPaginaPeliculaBusqueda, getPaginaWatchlist, LoginAdmin } from "../controllers/5.controller.js";
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



//-----------------
router.post("/getnumpaginas-busqueda777", getNumPagesBusqueda777)
router.post("/getpeliculaspagina-busqueda777/:pagina", getPaginaPeliculaBusqueda777)
router.get("/getnumpaginas777", getNumPages777);
router.get("/getpeliculaspagina777/:pagina", getPaginaPelicula777)

export default router;
