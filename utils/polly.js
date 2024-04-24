import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Crear un nuevo objeto Polly
const polly = new AWS.Polly();

// Función para convertir texto a voz y guardar el audio en un archivo
const textToSpeech = async (text, outputPath) => {
    const params = {
        OutputFormat: 'mp3',
        Text: text,
        VoiceId: 'Joanna' // Cambia esto según la voz que prefieras
    };

    try {
        const data = await polly.synthesizeSpeech(params).promise();
        const audioStream = data.AudioStream;

        // Guardar el audio en un archivo
        const filePath = path.resolve(outputPath, 'output.mp3');
        audioStream.pipe(fs.createWriteStream(filePath));

        return filePath;
    } catch (err) {
        throw new Error('Error al convertir texto a voz: ' + err.message);
    }
};

// Ejemplo de uso de la función
const texto = '¡Hola! Este es un ejemplo de texto convertido a voz con Amazon Polly.';
const outputPath = './audio'; // Carpeta donde se guardará el audio
textToSpeech(texto, outputPath)
    .then(filePath => {
        console.log('Audio guardado en:', filePath);
    })
    .catch(error => {
        console.error('Error al generar audio:', error);
    });

export default textToSpeech;
