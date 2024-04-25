//correr este para que l backend despierte xd

import app from "./app.js";
import { PORT } from "./config/config.js";


app.listen(PORT);
console.log(`Server on port http://localhost:${PORT}`);