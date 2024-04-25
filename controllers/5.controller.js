import {pool} from "../config/db.js"
import {compare, encrypt} from "../config/handleBcrypt.js"

export const LoginAdmin = async (req, res) => {
    try{
        const {Correo, Password} = req.body
        const [Select] = await pool.query("Select Correo, Password From Usuario Where Correo=? and Tipo = 1;", [Correo]);
        console.log(Select)

        if (Select.length < 1){
            return res.status(404).json({message:"Error: No existe el correo registrado para administrador", Value: false});
        }

        if (!compare(Password, Select[0].Password)){
            return res.status(404).json({message:"Error: Contraseña incorrecta.", Value: false});
        }

        return res.status(200).json({message: "Inicio de sesión exitoso", Value: true})
    }catch (error) {//Error si algo sale mal
        return res.status(500).json({message:"Error: Algo ha salido mal.", error, Value: false});
    }
};


// Obtener paginas del catalogo principal
export const getNumPages = async (req, res) => {
    try{
        const [Select] = await pool.query("Select CEILING(Count(idPelicula)/10) as paginas from Pelicula;");

        return res.status(200).json({message:"Numero de paginas obtenido exitosamente", Paginas: parseInt(Select[0].paginas)});
    }catch (error) {//Error si algo sale mal
        console.log(error)
        return res.status(500).json({message:"Error: Algo ha salido mal.", Paginas: -1, error});
    }
}


export const getPaginaPelicula = async (req, res) => {
    let numPeliculas = 10;
    try{
        const pagina = req.params.pagina
        const [Select] = await pool.query("Select idPelicula, Nombre, Clasificacion, Imagen from Pelicula limit ?,?;", 
            [((pagina-1)*numPeliculas), numPeliculas]);

        return res.status(200).json({message:"Peliculas obtenidas exitosamente.", Peliculas: Select});
    }catch (error) {//Error si algo sale mal
        return res.status(500).json({message:"Error: Algo ha salido mal.", error: error, Peliculas: []});
    }
}


// Obtener paginas del catalogo por busqueda
export const getNumPagesBusqueda = async (req, res) => {
    try{
        const {Nombre} = req.body;

        let query = ""
        query = "Select CEILING(Count(idPelicula)/10) as paginas from Pelicula Where UPPER(Nombre) LIKE '%"+Nombre.toUpperCase()+"%';"
        const [Select] = await pool.query(query);

        return res.status(200).json({message:"Numero de paginas obtenido exitosamente", Paginas: parseInt(Select[0].paginas)});
    }catch (error) {//Error si algo sale mal
        console.log(error)
        return res.status(500).json({message:"Error: Algo ha salido mal.", Paginas: -1, error});
    }
}


export const getPaginaPeliculaBusqueda = async (req, res) => {
    let numPeliculas = 10;
    try{
        const {Nombre} = req.body;
        const pagina = req.params.pagina;

        let query = "";
        query = "Select idPelicula, Nombre, Clasificacion, Imagen from Pelicula Where UPPER(Nombre) LIKE '%"+Nombre.toUpperCase()+"%' limit "+((pagina-1)*numPeliculas)+","+ numPeliculas;
        console.log(query)
        const [Select] = await pool.query(query);

        return res.status(200).json({message:"Peliculas obtenidas exitosamente.", Peliculas: Select});
    }catch (error) {//Error si algo sale mal
        console.log(error)
        return res.status(500).json({message:"Error: Algo ha salido mal.", Paginas: -1, error});
    }
}


// Obtener paginas de peliculas de la watchlist

export const getNumPagesWatchlist= async (req, res) => {
    try{
        const {idUsuario} = req.body;

        let query = ""
        query = "Select CEILING(Count(p.idPelicula)/10) as paginas from Pelicula p Inner Join Watchlist_Pelicula wp on p.idPelicula = wp.idPelicula Inner join Watchlist wl on wl.idWatchlist = wp.idWatchlist Inner join Usuario usr on usr.idUsuario = wl.idUsuario Where usr.idUsuario = "+idUsuario+" ;"
        const [Select] = await pool.query(query);

        return res.status(200).json({message:"Numero de paginas obtenido exitosamente", Paginas: parseInt(Select[0].paginas)});
    }catch (error) {//Error si algo sale mal
        console.log(error)
        return res.status(500).json({message:"Error: Algo ha salido mal.", Paginas: -1, error});
    }
}


export const getPaginaWatchlist= async (req, res) => {
    let numPeliculas = 10;
    try{
        const {idUsuario} = req.body;
        const pagina = req.params.pagina;

        let query = "";
        query = "Select p.idPelicula, p.Nombre, p.Clasificacion, p.Imagen from Pelicula p Inner Join Watchlist_Pelicula wp on p.idPelicula = wp.idPelicula Inner join Watchlist wl on wl.idWatchlist = wp.idWatchlist Inner join Usuario usr on usr.idUsuario = wl.idUsuario Where usr.idUsuario = "+idUsuario+" limit "+((pagina-1)*numPeliculas)+","+ numPeliculas+";";

        const [Select] = await pool.query(query);

        return res.status(200).json({message:"Peliculas obtenidas exitosamente.", Peliculas: Select});
    }catch (error) {//Error si algo sale mal
        console.log(error)
        return res.status(500).json({message:"Error: Algo ha salido mal.", Paginas: -1, error});
    }
}


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


// Obtener paginas del catalogo por busqueda
export const getNumPagesBusqueda777 = async (req, res) => {
    try{
        const {Nombre} = req.body;

        let query = ""
        query = "Select CEILING(Count(idActor)/10) as paginas from Actor Where UPPER(Nombre) LIKE '%"+Nombre.toUpperCase()+"%';"
        const [Select] = await pool.query(query);

        return res.status(200).json({message:"Numero de paginas obtenido exitosamente", Paginas: parseInt(Select[0].paginas)});
    }catch (error) {//Error si algo sale mal
        console.log(error)
        return res.status(500).json({message:"Error: Algo ha salido mal.", Paginas: -1, error});
    }
}

export const getPaginaPeliculaBusqueda777 = async (req, res) => {
    let numPeliculas = 10;
    try{
        const {Nombre} = req.body;
        const pagina = req.params.pagina;

        let query = "";
        query = "Select idActor, Nombre, Foto, Fecha_Nacimiento from Actor Where UPPER(Nombre) LIKE '%"+Nombre.toUpperCase()+"%' limit "+((pagina-1)*numPeliculas)+","+ numPeliculas;
        console.log(query)
        const [Select] = await pool.query(query);

        return res.status(200).json({message:"Actores obtenidas exitosamente.", Peliculas: Select});
    }catch (error) {//Error si algo sale mal
        console.log(error)
        return res.status(500).json({message:"Error: Algo ha salido mal.", Paginas: -1, error});
    }
}

// Obtener paginas del catalogo principal
export const getNumPages777 = async (req, res) => {
    try{
        const [Select] = await pool.query("Select CEILING(Count(idActor)/10) as paginas from Actor;");

        return res.status(200).json({message:"Numero de paginas obtenido exitosamente", Paginas: parseInt(Select[0].paginas)});
    }catch (error) {//Error si algo sale mal
        console.log(error)
        return res.status(500).json({message:"Error: Algo ha salido mal.", Paginas: -1, error});
    }
}

export const getPaginaPelicula777 = async (req, res) => {
    let numPeliculas = 10;
    try{
        const pagina = req.params.pagina
        const [Select] = await pool.query("Select idActor, Nombre, Foto, Fecha_Nacimiento from Actor limit ?,?;", 
            [((pagina-1)*numPeliculas), numPeliculas]);

        return res.status(200).json({message:"Actores obtenidas exitosamente.", Peliculas: Select});
    }catch (error) {//Error si algo sale mal
        return res.status(500).json({message:"Error: Algo ha salido mal.", error: error, Peliculas: []});
    }
}