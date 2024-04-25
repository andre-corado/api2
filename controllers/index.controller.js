import {pool} from "../config/db.js"
import textToSpeech from "../utils/polly.js"

export const index = (req, res) => res.json({ message: "Welcome to my api" });

export const ping = async (req, res) => {
    const [result] = await pool.query('SELECT "ping" as result');
    res.json(result[0]);
};

export const tts = async (req, res) => {    
    try {
        const texto = req.body.text;
        const b = await textToSpeech(texto);
        res.send({"message":"Texto convertido a voz exitosamente","audio": b});
    } catch (error) {
        res.send({"message":"Algo a salido mal",error : error.message})
    }
}