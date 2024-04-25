import { Router } from "express";
import { index, ping, tts} from "../controllers/index.controller.js"


const router = Router();

//Rutas van aqui ----------
router.get("/", index);
router.get("/ping", ping)
router.post("/tts", tts)

export default router;