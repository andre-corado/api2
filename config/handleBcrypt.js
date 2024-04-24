import crypto from 'crypto';

// Función para cifrar una contraseña en texto plano utilizando MD5
export const encrypt = (passwordNormal) => {
    return crypto.createHash('md5').update(passwordNormal).digest('hex');
}

// Función para comparar una contraseña en texto plano con un hash MD5
export const compare = (passwordNormal, hashPassword) => {
    const hashedPassword = crypto.createHash('md5').update(passwordNormal).digest('hex');
    return hashedPassword === hashPassword;
}
