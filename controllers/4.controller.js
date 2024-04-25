//query post-mysql
import {createTransport } from "nodemailer";

import {
    DB_DATABASE,
    DB_HOST,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
  } from "../config/config.js";

import {createConnection } from "mysql";

//encriptado
import {encrypt,compare} from '../config/handleBcrypt.js'
import { json } from "express";
import useLambda from "../utils/lambda.js";

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

export const query1 = async (req, res) =>{
    //ENCRIPTAR CONTRA

    var query1 = conn.query(

        `SELECT idUsuario,Nombre,Apellido,Password,Tipo,Foto FROM Usuario WHERE Correo = '${req.body.Correo}';`,
        function (err, result){
            if(err) throw err

            try {
                if(result.length > 0){
                    const compareEncrypt =  compare(req.body.Password,result[0].Password)
                    console.log(">>>> comparacion")
                    console.log(compareEncrypt)
                    if(compareEncrypt){
                        res.send({"idUsuario": result[0].idUsuario, 
                                    "Nombre": result[0].Nombre,
                                    "Apellido" : result[0].Apellido,
                                    "Tipo": result[0].Tipo,
                                    "Foto": result[0].Foto})
                    }else{
                        res.send({"message" : "Correo o Password Incorrecto"})
                    }
                }else{
                    res.send({"message":"No existe el Usuario Registrese por favor"})
                }
            } catch (error) {
                res.send({"message":"Algo a salido mal",error})
            }
            
        }
    )

}

//loginFace
export const query6 = async (req, res) =>{
    const user = req.body.username;
    const imageB64 = req.body.imageB64;
    var query1 = conn.query(
        `SELECT Password, Foto FROM Usuario WHERE Correo = '${user}';`,
    
        function(err,result){
            if(err) throw err
            try {
                if(result.length > 0){
                    let data = {
                        username: user,
                        password: result[0].Password,
                        profileImageS3Url: result[0].Foto,
                        imageB64: imageB64
                    }

                    res.send(useLambda("loginFace", data))
                }else{
                    res.send({"message":"Error con el usuario"})
                }
            } catch (error) {
                res.send({"message":"Algo ha salido mal",error})
            }
        }
    )
    }

export const query2 = async (req, res) =>{

    var query1 =  conn.query(
        `SELECT * FROM Pelicula WHERE Nombre LIKE '%${req.body.Nombre}%';`,
        function (err,result){
            if(err) throw err
            try {
                console.log(result)
                if(result.length > 0){
                    res.json({
                        Peliculas: result}
                    )
                }else{
                    res.send({"message":"No existe Pelicula con ese Nombre ingrese otro"})
                }
            } catch (error) {
                res.send({"message":"Algo a salido mal",error})
            }
            

        }
    )
}


export const query3 = async (req, res) =>{
    const user = req.body.idUsuario;
    const pelicula  = req.body.idPelicula;


    var query1 =  conn.query(
        `SELECT IdWatchlist FROM Watchlist Where idUsuario = ${user};`,
        function (err,result){
            if(err) throw err
            try {
                console.log(result)
                if(result.length > 0){
                    const watchlist = result[0].IdWatchlist;
                   var query2 = conn.query(
                        `DELETE FROM Watchlist_Pelicula Where idWatchlist = ${watchlist} AND idPelicula = ${pelicula};`, 
                        function(err2,result2){
                            if(err2) throw err
                            try {
                                if(result2.length > 0){
                                    res.send({"message":"Error Pelicula no Eliminada"})
                                    
                                }else{
                                    res.send({"message":"Pelicula Eliminada con Exito de WatchList"})
                                }
                            } catch (error) {
                                res.send({"message":"Error con la eliminacion de Watchlist"})
                            }
                        }
                    )
                }else{
                    res.send({"message":"Error con el Usuario Actual"})
                }
            } catch (error) {
                res.send({"message":"Algo a salido mal",error})
            }
            

        }
    )
}


export const query4 = async (req, res) =>{
    
    const pelicula = req.body.idPelicula;
    let sql = `CALL Eliminar_Pelicula(?)`;

    var query1 =  conn.query(sql,pelicula,(err,results,fields) =>{
        if(err){
            return res.send({"message":"No se pudo eliminar la pelicula",err})
        }else{
            return res.send({"message": "Pelicula Eliminada con Exito"})
        }
        console.log(results);
    
    });      
}

export const query5 = async (req, res) =>{
    const user = req.body.idUsuario;
    const pelicula  = req.body.idPelicula;


    var query1 =  conn.query(
        `SELECT IdWatchlist FROM Watchlist Where idUsuario = ${user};`,
        function (err,result){
            if(err) throw err
            try {
                console.log(result)
                if(result.length > 0){
                    const watchlist = result[0].IdWatchlist;
                   var query2 = conn.query(
                        `SELECT * FROM Watchlist_Pelicula WHERE idWatchlist = ${watchlist} AND idPelicula = ${pelicula};`, 
                        function(err2,result2){
                            if(err2) throw err
                            try {
                                if(result2.length > 0){
                                    res.send({"Pelicula":true})
                                    
                                }else{
                                    res.send({"Pelicula":false})
                                }
                            } catch (error) {
                                res.send({"message":"Error con no existe Pelicula"})
                            }
                        }
                    )
                }else{
                    res.send({"message":"Error con el Usuario Actual"})
                }
            } catch (error) {
                res.send({"message":"Algo a salido mal",error})
            }
            

        }
    )
}