//correr este para que l backend despierte xd

import app from "./app.js";
import { PORT } from "./config/config.js";

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.listen(PORT);
console.log(`Server on port http://localhost:${PORT}`);