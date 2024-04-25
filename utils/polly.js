import AWS from 'aws-sdk';
import dotenv from 'dotenv';

// Función para convertir texto a voz y guardar el audio en un archivo
const textToSpeech = async (text) => {

    // Cargar variables de entorno desde el archivo .env
    dotenv.config();

    // Crear un nuevo objeto Polly
    const polly = new AWS.Polly();

    const params = {
        Engine: 'standard',
        LanguageCode: 'es-MX',
        OutputFormat: 'mp3',
        Text: text,
        VoiceId: 'Enrique' // Cambia esto según la voz que prefieras
    };

    try {
        const data = await polly.synthesizeSpeech(params).promise();
        const b64 = data.AudioStream.toString('base64');        
        return 'data:audio/mp3;base64,' + b64;
    } catch (err) {
        throw new Error('Error al convertir texto a voz: ' + err.message);
    }
};

export default textToSpeech;
