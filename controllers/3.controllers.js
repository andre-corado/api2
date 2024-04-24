//query post-mysql
import { createTransport } from "nodemailer";

import {
    DB_DATABASE,
    DB_HOST,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
} from "../config/config.js";

import { createConnection } from "mysql";
import uploadImage from "../utils/s3.js";
import generarUUID from "../utils/uuid.js"

//encriptado
import { encrypt, compare } from '../config/handleBcrypt.js'
import registerUser from "../utils/cognito.js";

var conn = createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT
})

conn.connect(function (err) {
    if (err) throw err
    console.log("Conexion a mysql!")

})

//guardar usuarios
export const query1 = async (req, res) => {
    console.log(req.body)//si recibi el json correctamente del contacto

    console.log("-----------------------inicio")

    //busco que no se repita el email
    var query1 = conn.query(
        `SELECT idUsuario FROM Usuario where Correo='${req.body.Correo}' ;`,
        async function (err, result) {    //result en un array cada indice es una tupla de la respectiva tabla
            if (err) throw err

            console.log(">>>>>>>")
            //var resu = JSON.stringify(result)
            /*console.log(resu)
            console.log(result)
            console.log(result.length)*/

            if (result.length > 0) {
                // F no se hace nada
                //console.log("ya existe xd, no se debe de guardar")
                console.log("YA EXISTE en DB el correo, reintente con otro correo!")
                res.send({"guardado": false})

            } else { //no existe tal correo se procede a almacenar en mysql
                console.log("Registrando Usuario!")

                //encripto el correo    **********************************************************
                const passEncrypt = encrypt(req.body.Password)
                console.log(">>>> encrypt")
                console.log(passEncrypt)

                //comparo con la password **************************************************
                const compareEncrypt = compare(req.body.Password, passEncrypt)
                console.log(">>>> comparacion")
                console.log(compareEncrypt)

                // Guardamos la foto en S3

                const user = req.body.Correo.split('@')[0];
                const filename = `profilePictures/${user}`;
                const base64 = req.body.imageB64;
                const linkS3 = await uploadImage(filename, base64);
                console.log(linkS3)

                // Guardamos el usuario en cognito
                await registerUser(req.body.Correo, passEncrypt, req.body.Correo);

                // Guardamos datos del usuario en la base de datos
                var query = conn.query(
                    `INSERT INTO Usuario(Nombre, Apellido, Password, Correo, Tipo, Foto)
                     VALUES ('${req.body.Nombre}', '${req.body.Apellido}', '${passEncrypt}', '${req.body.Correo}',
                             ${req.body.Rol}, '${linkS3}');`,
                    function (err, result) {
                        if (err) throw err

                        //ya se guardo en mysql
                        console.log("todo ok! se guardo en mysql")//inserto en mysql
                    })

                //gmail ======================================================
                var transporter = createTransport({//cuenta de la empresa ImdbX
                    host: 'smtp.gmail.com',
                    post: 465,
                    secure: true,
                    auth: {
                        user: 'imdbx.grupo3.ayd1@gmail.com',
                        pass: 'mtqwqkfmfagkoqtq'// contrasenya generada por google
                    },
                });

                //direccion hacia donde el usuario recien creado debe de redirigirse
                var direccion = "https://www.imdb.com/title/tt3915174/?ref_=nv_sr_srsg_2"

                //creacion del esquema del correo a enviar
                var mailOptions = {
                    from: "ImdbX",
                    to: req.body.Correo,
                    subject: "[ImdbX] Creacion de cuenta sastifactoriamente",
                    text: "Se le informa estimad@ " + req.body.Nombre + " " + req.body.Apellido + ",que la creacion de cuenta en ImdbX se ha realizado con exito.\n" +
                        "Puede visitar el sitio en el siguiente enlace: " + direccion + "\nAtentamente ImdbX."
                }

                //envio de correo
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        res.status(500).send(error.message) //desactivar antivirus, si este error sale: self signed certificate in certificate chain
                    } else {//todo ok
                        console.log("email enviado")
                        res.send({ "guardado": true })
                    }

                });

            }
        }
    )
}

//guardar peliculas
export const query2 = async (req, res) => {

    try {

        console.log("-----------------------inicio2")
        console.log(req.body)

        //busco que no se repita la pelicula
        var query1 = conn.query(
            `SELECT idPelicula FROM Pelicula where Nombre='${req.body.Nombre}' ;`,
            async function (err, result) {    //result en un array cada indice es una tupla de la respectiva tabla
                if (err) throw err

                console.log(">>>>>>>")

                if (result.length > 0) {
                    console.log("YA EXISTE en DB la pelicula, reintente con otro nombre!")
                    res.send({"guardado": false})

                } else { //no existe tal pelicula se procede a almacenar en mysql

                    // Guardamos la foto en S3

                    const uuid = generarUUID(3);
                    const filename = `movies/${req.body.Nombre}_${uuid}`;
                    const base64 = req.body.Imagen;
                    const linkS3 = await uploadImage(filename, base64);

                    var query = conn.query(//                                                                                                           Nombre,Director,Resumen,duracion,clasificacion,imagen,trailer,Estreno

                        //guardamos la pelicula
                        `INSERT INTO Pelicula(Nombre, Director, Resumen, duracion, clasificacion, imagen, trailer,
                                              Estreno)
                         VALUES ('${req.body.Nombre}', '${req.body.Director}', '${req.body.Resumen}',
                                 '${req.body.Duracion}', '${req.body.Clasificacion}', '${linkS3}',
                                 '${req.body.Trailer}', ${req.body.Estreno});`,
                        function (err, result) {
                            if (err) throw err
                            //ya se guardo en mysql
                            console.log("todo ok! se guardo la pelicula en mysql")//inserto en mysql
                        })

                    //obtener primary key de esta pelicula
                    var query = conn.query(//                                                                                                           Nombre,Director,Resumen,duracion,clasificacion,imagen,trailer,Estreno
                        `SELECT idPelicula
                         FROM Pelicula
                         where Nombre = '${req.body.Nombre}';`,
                        function (err, result) {
                            if (err) throw err

                            //ya se guardo en mysql
                            console.log("obtuve el idPelicula de la pelicula que acabo de guardar en mysql: ")//inserto en mysql
                            //console.log(result)

                            var keyPelicula = result[0].idPelicula
                            console.log("id de pelicula recien guardada: " + keyPelicula)

                            //obtener primary keys de los actores involucrados
                            for (let i = 0; i < req.body.Actores.length; i++) {
                                //console.log(req.body.Actores[i])

                                //obtener primary key del actor y guardar en tabla intermedia Pelicula_Actor

                                var query = conn.query(//                                                                                                           Nombre,Director,Resumen,duracion,clasificacion,imagen,trailer,Estreno
                                    `SELECT idActor
                                     FROM Actor
                                     where Nombre = '${req.body.Actores[i]}';`,
                                    function (err, result) {
                                        if (err) throw err
                                        //obtuve la primry key del actor procedo a realizar conexion de tabla intermedia
                                        console.log("actor: " + req.body.Actores[i] + " id: " + result[0].idActor)

                                        //crear enlaces en Pelicula_Actor
                                        console.log("Pelicula_Actor: " + keyPelicula + "/" + result[0].idActor + "\n")

                                        var query = conn.query(//                                                                                                           Nombre,Director,Resumen,duracion,clasificacion,imagen,trailer,Estreno
                                            `INSERT INTO Pelicula_Actor(idPelicula, idActor)
                                             VALUES (${keyPelicula}, ${result[0].idActor});`,
                                            function (err, result) {
                                                //if (err) throw err
                                                //ya se guardo en mysql
                                                console.log("todo ok! se guardo la tabla intermedia pelicula_actor en mysql")//inserto en mysql
                                            })
                                        //se finalizo todo con exito
                                    })


                            }

                        })

                    res.send({"guardado": true})

                }
            }
        )

    } catch (error) {//Error si algo sale mal pero le vale madres al try no sirve F
        console.log("catch error en guardar peli: un actor no existe")
        return res.send({ "guardado": false })
    }

}

//retornar todos los actores en db sprint 2
export const query3 = async (req, res) => {

    console.log("-------------  inicio get all actores")

    //busco que no se repita el email
    var query1 = conn.query(
        `SELECT Nombre FROM Actor ;`,
        function (err, result) {    //result en un array cada indice es una tupla de la respectiva tabla
            if (err) throw err

            console.log(">>>>>>>")
            //var resu = JSON.stringify(result)
            //console.log(resu)

            console.log(result)
            console.log(result.length)

            var array = []

            for (let index = 0; index < result.length; index++) {
                array.push(result[index].Nombre)

            }

            res.send(array)

        }
    )
}


//retornar todas las peliculas en db sprint 2
export const query4 = async (req, res) => {

    console.log("-------------  inicio get all movies")

    //busco que no se repita el email
    var query1 = conn.query(
        `SELECT Nombre FROM Pelicula ;`,
        function (err, result) {    //result en un array cada indice es una tupla de la respectiva tabla
            if (err) throw err

            console.log(">>>>>>>")
            //var resu = JSON.stringify(result)
            //console.log(resu)

            console.log(result)
            console.log(result.length)

            var array = []

            for (let index = 0; index < result.length; index++) {
                array.push(result[index].Nombre)

            }

            res.send(array)

        }
    )
}

//retornar calificacion de la pelicula actual del usuario activo en db sprint 2
export const query5 = async (req, res) => {

    console.log("-------------  inicio get califiacion de movie")

    //busco que no se repita el email
    var query1 = conn.query(
        `SELECT Puntuacion FROM Calificacion where idUsuario=${req.body.IdUsuario} and idPelicula=${req.body.IdPelicula};`,
        function (err, result) {    //result en un array cada indice es una tupla de la respectiva tabla
            if (err) throw err

            console.log(">>>>>>>")
            //var resu = JSON.stringify(result)
            //console.log(resu)

            console.log(result)
            /*console.log(result.length)
            console.log("kkk")
            console.log(result[0].Puntuacion)*/

            if(result.length==0){
                res.send({Puntuacion:0})
            }else{
                res.send(result[0])
            }

        }
    )
}


//guardar actores sprint 2
export const query6 = async (req, res) => {

    try {

        console.log("-----------------------inicio guardar actores")
        console.log(req.body)

        //busco que no se repita el actor
        var query1 = conn.query(
            `SELECT idActor FROM Actor where Nombre='${req.body.Nombre}' ;`,
            async function (err, result) {    //result en un array cada indice es una tupla de la respectiva tabla
                if (err) throw err

                console.log(">>>>>>>")

                if (result.length > 0) {
                    console.log("YA EXISTE en DB el actor, reintente con otro nombre!")
                    res.send({"guardado": false})

                } else { //no existe tal actor se procede a almacenar en mysql

                    // Guardamos la foto en S3

                    const uuid = generarUUID(3);
                    const filename = `actors/${req.body.Nombre}_${uuid}`;
                    const base64 = req.body.Foto;
                    const linkS3 = await uploadImage(filename, base64);

                    var query = conn.query(//                                                                                                           Nombre,Director,Resumen,duracion,clasificacion,imagen,trailer,Estreno

                        //guardamos la pelicula
                        `INSERT INTO Actor(Nombre, Foto, Fecha_Nacimiento)
                         VALUES ('${req.body.Nombre}', '${linkS3}', '${req.body.Fecha_Nacimiento}');`,
                        function (err, result) {
                            if (err) throw err
                            //ya se guardo en mysql
                            console.log("todo ok! se guardo actor en mysql")//inserto en mysql
                        })

                    //obtener primary key de este actor
                    var query = conn.query(//                                                                                                           Nombre,Director,Resumen,duracion,clasificacion,imagen,trailer,Estreno
                        `SELECT idActor
                         FROM Actor
                         where Nombre = '${req.body.Nombre}';`,
                        function (err, result) {
                            if (err) throw err

                            //ya se guardo en mysql
                            console.log("obtuve el idActor del actor que acabo de guardar en mysql: ")//inserto en mysql
                            //console.log(result)

                            var keyPelicula = result[0].idActor
                            console.log("id de actor recien guardada: " + keyPelicula)

                            //obtener primary keys de las peliculas involucrados
                            for (let i = 0; i < req.body.Participacion.length; i++) {
                                //console.log(req.body.Actores[i])

                                //obtener primary key de pelicula y guardar en tabla intermedia Pelicula_Actor

                                var query = conn.query(//                                                                                                           Nombre,Director,Resumen,duracion,clasificacion,imagen,trailer,Estreno
                                    `SELECT idPelicula
                                     FROM Pelicula
                                     where Nombre = '${req.body.Participacion[i]}';`,
                                    function (err, result) {
                                        if (err) throw err
                                        //obtuve la primry key del actor procedo a realizar conexion de tabla intermedia
                                        console.log("Participacion: " + req.body.Participacion[i] + " idPelicula: " + result[0].idPelicula)

                                        //crear enlaces en Pelicula_Actor
                                        console.log("Pelicula_Actor: " + keyPelicula + "/" + result[0].idPelicula + "\n")

                                        var query = conn.query(//                                                                                                           Nombre,Director,Resumen,duracion,clasificacion,imagen,trailer,Estreno
                                            `INSERT INTO Pelicula_Actor(idPelicula, idActor)
                                             VALUES (${result[0].idPelicula}, ${keyPelicula});`,
                                            function (err, result) {
                                                //if (err) throw err
                                                //ya se guardo en mysql
                                                console.log("todo ok! se guardo la tabla intermedia pelicula_actor en mysql")//inserto en mysql
                                            })
                                        //se finalizo todo con exito
                                    })


                            }

                        })

                    res.send({"guardado": true})

                }
            }
        )

    } catch (error) {//Error si algo sale mal pero le vale madres al try no sirve F
        console.log("catch error en guardar actor: una pelicula no existe")
        return res.send({ "guardado": false })
    }

}


//guardar calificacion sprint 2
export const query7 = async (req, res) => {

    try {

        console.log("-----------------------inicio guardar calificacion de usuario")
        console.log(req.body)

        //busco que no se repita la calificacion
        var query1 = conn.query(
            `SELECT idCalificacion FROM Calificacion where idUsuario=${req.body.IdUsuario} and idPelicula=${req.body.IdPelicula} ;`,
            function (err, result) {    //result en un array cada indice es una tupla de la respectiva tabla
                if (err) throw err

                console.log(">>>>>>>")

                if (result.length > 0) {
                    console.log("YA EXISTE en DB la calificacion para dicho usuario, procede a sobre-escribir")
                    var query = conn.query(//                                                                                                           Nombre,Director,Resumen,duracion,clasificacion,imagen,trailer,Estreno

                        //update la calificacion de usuario
                        `update Calificacion SET Puntuacion=${req.body.Puntuacion}  where idUsuario=${req.body.IdUsuario} and idPelicula=${req.body.IdPelicula} ;`,
                        function (err, result) {
                            if (err) throw err
                            //ya se guardo en mysql
                            console.log("todo ok! se guardo la actualizacion de calificacion en mysql")//update en mysql
                        })

                    res.send({ "guardado": true })

                } else { //no existe tal actor se procede a almacenar en mysql
                    var query = conn.query(//                                                                                                           Nombre,Director,Resumen,duracion,clasificacion,imagen,trailer,Estreno

                        //guardamos la calificacion de usuario
                        `INSERT INTO Calificacion(Puntuacion,idUsuario,idPelicula) VALUES (${req.body.Puntuacion},${req.body.IdUsuario},${req.body.IdPelicula}   );`,
                        function (err, result) {
                            if (err) throw err
                            //ya se guardo en mysql
                            console.log("todo ok! se guardo la calificacion por primera vez en mysql")//inserto en mysql
                        })

                    res.send({ "guardado": true })

                }
            }
        )

    } catch (error) {//Error si algo sale mal pero le vale madres al try no sirve F
        console.log("catch error en guardar calificacion :(")
        return res.send({ "guardado": false })
    }

}


// retornar calificación promedio de la película
export const getAverageRating = async (req, res) => {
    const idPelicula = req.body.idPelicula;

    var query = conn.query(
        `SELECT FORMAT(AVG(Puntuacion), 1) AS promedio
         FROM Calificacion
         WHERE idPelicula = ${idPelicula};`,
        function (err, result) {
            if (err) throw err;
            res.send(result[0]);
        }
    );
}