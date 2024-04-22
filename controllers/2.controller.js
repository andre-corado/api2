import {
    DB_DATABASE,
    DB_HOST,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
} from "../config/config.js";
import mysql from 'mysql2/promise';

async function executeQuery(sql) {
    const connection = await mysql.createConnection({
        host:DB_HOST,
        user:DB_USER,
        password:DB_PASSWORD,
        database:DB_DATABASE,
        port:DB_PORT
    });
    const [rows, _] = await connection.execute(sql);
    connection.end();

    return rows;
}

export const showActors = async (req, res) =>{
    let actor = {
        id: 0,
        Nombre: "",
        Foto: "", 
        Fecha_Nacimiento: "",
        Ultimas_Peliculas: []
    }
    
    executeQuery(`SELECT idActor, Nombre, Foto, Fecha_Nacimiento FROM Actor WHERE idActor = '${req.body.idActor}';`)
                .then(results => {
                    if(results.length > 0){
                        actor.id = results[0].idActor
                        actor.Nombre = results[0].Nombre
                        actor.Foto = results[0].Foto
                        actor.Fecha_Nacimiento = results[0].Fecha_Nacimiento
                    }else{
                        res.status(400).json({"message":"No existe el actor"})
                    }
                })
                .catch(error => {
                    res.status(500).json({"message":error})
                });
    executeQuery(`SELECT p.idPelicula, p.Nombre FROM Pelicula p INNER JOIN Pelicula_Actor pa ON p.idPelicula = pa.idPelicula WHERE pa.idActor = '${req.body.idActor}';`)
                .then(results => {
                    results.forEach((movie) => {
                        actor.Ultimas_Peliculas.push({id:movie.idPelicula, Nombre:movie.Nombre})
                    })
    
                    res.status(200).json(actor)
                })
                .catch(error => {
                    res.status(500).json({"message":error})
                });
}

export const commentMovie = async (req, res) =>{    
    executeQuery(`INSERT INTO Comentario (idUsuario, idPelicula, Contenido) VALUES (${req.body.idUsuario},${req.body.idPelicula},'${req.body.comentario}');`)
                .then(results => {
                    if (results.affectedRows > 0){
                        res.status(200).json({"message":"Comentario agregado exitosamente!"})
                    }else{
                        res.status(400).json({"message":"Ocurrió un error al agregar el comentario. Intenta de nuevo."})
                    }
                })
                .catch(error => {
                    res.status(500).json({"message":error})
                });
}