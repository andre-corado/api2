import {createTransport } from "nodemailer";

import {
    DB_DATABASE,
    DB_HOST,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
  } from "../config/config.js";

import {createConnection } from "mysql";

var conn = createConnection({
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASSWORD,
    database:DB_DATABASE,
    port:DB_PORT
})

conn.connect(function(err){
    if(err)throw err
    console.log("Conexion a mysql!")
    
})

export const ReturnInfo = async (req, res) =>{
    try {
        
    
    console.log("si entra")
    var query1 = conn.query(
        `SELECT P.IdPelicula, P.Nombre, P.Resumen as Sinopsis, Director,Imagen,Trailer, Estreno,GROUP_CONCAT(DISTINCT A.idActor,',',A.nombre) as Reparto, P.duracion, P.clasificacion, GROUP_CONCAT(DISTINCT U.Nombre,',', C.contenido) as Comentarios
        FROM Pelicula as P 
        INNER JOIN Pelicula_Actor as PA ON PA.idPelicula = P.idPelicula 
        INNER JOIN Actor as A ON A.idActor = PA.idActor 
        LEFT JOIN Comentario as C ON C.idPelicula = P.idPelicula
        LEFT JOIN Usuario as U ON U.idUsuario = C.idUsuario
        WHERE P.idPelicula = '${req.body.idPelicula}'
        GROUP BY P.Nombre, P.Resumen, P.duracion, P.clasificacion; `,

        function (err, result){
            console.log(result)
            if(err) throw err

            if(result.length > 0){
                const actors = result[0].Reparto.split(",") 
                const actorArray = [] 
                for(let i=0; i<actors.length; i+=2){
                    const actorObj = {}
                    actorObj["Id"] = actors[i].trim() 
                    actorObj["Nombre"] = actors[i+1].trim() 
                    actorArray.push(actorObj) 
                }
                result[0].Reparto = actorArray
                if (result[0].Comentarios !== null) {
                    const coments = result[0].Comentarios.split(",")
                    const comentArray = []
                    for (let i = 0; i < coments.length; i += 2) {
                        const comentrObj = {}
                        comentrObj["Nombre"] = coments[i].trim()
                        comentrObj["Comentario"] = coments[i + 1].trim()
                        comentArray.push(comentrObj)
                    }
                    result[0].Comentarios = comentArray
                }
                

                res.send({Peliculas:result[0]}); 

            }else{
                res.send({"message":"La pelicula que busca no existe"})
            }
        }
    )
}
catch (error) {
  console.log(error);      
}
} 

export const ModificarPelicula = async (req, res) => {
    try {
        
    

    var updateFields = '';

    if (req.body.Nombre && req.body.Nombre !== '') {
        updateFields += `Nombre = '${req.body.Nombre}', `;
    }

    if (req.body.Director && req.body.Director !== '') {
        updateFields += `Director = '${req.body.Director}', `;
    }

    if (req.body.Estreno && req.body.Estreno !== '') {
        updateFields += `Estreno = '${req.body.Estreno}', `;
    }

    if (req.body.Resumen && req.body.Resumen !== '') {
        updateFields += `Resumen = '${req.body.Resumen}', `;
    }

    if (req.body.Duracion && req.body.Duracion !== '') {
        updateFields += `Duracion = '${req.body.Duracion}', `;
    }

    if (req.body.Clasificacion && req.body.Clasificacion !== '') {
        updateFields += `Clasificacion = '${req.body.Clasificacion}', `;
    }

    if (req.body.Imagen && req.body.Imagen !== '') {
        updateFields += `Imagen = '${req.body.Imagen}', `;
    }

    if (req.body.Trailer && req.body.Trailer !== '') {
        updateFields += `Trailer = '${req.body.Trailer}', `;
    }

    if (updateFields === '') {
        res.send({"message":"No se proporcionaron datos para actualizar"});
        return;
    }

    updateFields = updateFields.slice(0, -2); // Elimina la última coma y el espacio

    var query1 = conn.query(
        `UPDATE Pelicula SET 
        ${updateFields}
        WHERE idPelicula='${req.body.idPelicula}';`,
        function (err, result){
            if (err) throw err;

            // Realiza una segunda consulta para obtener la información de la película actualizada
            var query2 = conn.query(
                `SELECT * FROM Pelicula WHERE idPelicula='${req.body.idPelicula}'`,
                function (err, result) {
                    if (err) throw err;

                    if (result.length > 0) {
                        res.send({ Pelicula: result[0] });
                    } else {
                        res.send({ "message": "La pelicula que desea editar no existe" });
                    }
                }
            );
        }
    );
} catch (error) {
      console.log(error);  
}
}

export const AgregarWatchList = async (req, res) => {

    try {
        
    
    var query1 = conn.query(
        `SELECT idWatchlist FROM Watchlist WHERE idUsuario='${req.body.idUsuario}';`,
        function (err, result){
            if (err) throw err;

            if (result.length > 0) {
                console.log("si existe: " + result[0]['idWatchlist'])
                var query2 = conn.query(
                    `INSERT INTO Watchlist_Pelicula (idWatchlist, idPelicula) VALUES ('${result[0]['idWatchlist']}','${req.body.idPelicula}');`,
                    function (err, result) {
                        console.log(result)
                        if (err) throw err;
                        else{
                            res.send({ "message": "La pelicula se agrego a la watchlist" });
                        }
                    }
               );
                
            } else {
                var query3 = conn.query(
                    `INSERT INTO Watchlist (idUsuario) VALUES ('${req.body.idUsuario}');`,
                    function (err, result) {
                        if (err) throw err;
                    }
                );

                var query4 = conn.query(
                    `SELECT idWatchlist FROM Watchlist WHERE idUsuario='${req.body.idUsuario}';`,
                    function (err, result){
                        if (err) throw err;
                        if (result.length > 0) {
                            console.log("si existe: " + result[0]['idWatchlist'])
                            var query5 = conn.query(
                                `INSERT INTO Watchlist_Pelicula (idWatchlist, idPelicula) VALUES ('${result[0]['idWatchlist']}','${req.body.idPelicula}');`,
                                function (err, result) {
                                    console.log(result)
                                    if (err) throw err;
                                    else{
                                        res.send({ "message": "La pelicula se agrego a la watchlist" });
                                    }
                                }
                           );
                            
                        }
                    });
            }

        }
    );
} catch (error) {
   console.log(error);     
}
}




 