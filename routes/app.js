import express from "express";
import morgan from "morgan";
import cors from "cors";

import indexRoutes from "./routes/index.routes.js";
import unoRoutes from "./routes/3.routes.js";
import unoRoutes2 from "./routes/4.routes.js";
import unoRoutes3 from "./routes/5.routes.js";
import unoRoutes4 from "./routes/6.routes.js";
import unoRoutes5 from "./routes/7.routes.js";
import unoRoutes6 from "./routes/8.routes.js";
import unoRoutes7 from "./routes/9.routes.js";

import dosRoutes from "./routes/10.routes.js";
import tresRoutes from "./routes/11.routes.js"
import cuatroRoutes from "./routes/1.js"


const app = express();

//Cors
var corsOptions = {
  origin: '*',
};

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use("/", indexRoutes);
app.use("/", unoRoutes);//registro usuarios
app.use("/", unoRoutes2);//registro peliculas
app.use("/", unoRoutes3);//retorno de actores DB
app.use("/", unoRoutes4);//retorno de peliculas DB
app.use("/", unoRoutes5);//retorno de calificacion de pelicula en DB
app.use("/", unoRoutes6);//retorno de calificacion de pelicula en DB
app.use("/", unoRoutes7);//registro de calificacion de pelicula en DB

app.use("/", dosRoutes);//validar login
app.use("/", tresRoutes)
app.use("/", cuatroRoutes)

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;