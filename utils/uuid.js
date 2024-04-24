import { v4 as uuidv4 } from 'uuid';

// Genera un UUID versión 4 y trunca la cadena para obtener un UUID más pequeño
function generarUUID(length) {
    const uuid = uuidv4();
    return uuid.replace(/-/g, '').substr(0, length); // Por ejemplo, obtiene los primeros 10 caracteres
}

export default generarUUID;