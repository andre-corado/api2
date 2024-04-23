//var bcrypt = require('bcryptjs')

//import { genSaltSync,hashSync,compareSync } from "bcryptjs";

import pkg from 'bcryptjs';
const { genSaltSync,hashSync,compareSync } = pkg;

//encriptar texto plano
export var encrypt =  (passwordNormal) => {//texto plano
    var salt = genSaltSync(10);
    var hash = hashSync(passwordNormal, salt);
    return hash
}

//comparar texto plano con hash
export var compare =  (passwordNormal, hashPassword) => {//texto plano, hash
    var resultado =  compareSync(passwordNormal, hashPassword);
    return resultado
}
